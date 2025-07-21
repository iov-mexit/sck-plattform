import { signalCollection, Signal } from '../signal-collection';
import { sckNFTService, Achievement } from '../contracts/sck-nft';

// =============================================================================
// SIGNAL TO NFT INTEGRATION SERVICE
// =============================================================================

export interface SignalToNFTConfig {
  // Achievement thresholds
  certificationThreshold: number;
  activityThreshold: number;

  // Soulbound settings
  soulboundCertifications: boolean;
  soulboundActivities: boolean;

  // Metadata templates
  achievementTemplates: {
    certification: string;
    activity: string;
  };
}

export class SignalToNFTIntegration {
  private config: SignalToNFTConfig;

  constructor(config: SignalToNFTConfig) {
    this.config = config;
  }

  // =============================================================================
  // CORE INTEGRATION FUNCTIONS
  // =============================================================================

  /**
   * Process a new signal and potentially mint an achievement
   */
  async processSignal(signal: Signal): Promise<{
    achievementMinted: boolean;
    tokenId?: number;
    achievement?: Achievement;
    error?: string;
  }> {
    try {
      // Get the digital twin token ID for this signal
      const tokenId = await this.getTokenIdForSignal(signal);
      if (!tokenId) {
        return {
          achievementMinted: false,
          error: 'Digital twin not found for signal'
        };
      }

      // Check if this signal qualifies for an achievement
      const achievementEligible = await this.checkAchievementEligibility(tokenId, signal);
      if (!achievementEligible.eligible) {
        return {
          achievementMinted: false,
          error: achievementEligible.reason
        };
      }

      // Mint the achievement
      const achievement = await this.mintAchievement(tokenId, signal);

      return {
        achievementMinted: true,
        tokenId,
        achievement
      };

    } catch (error: unknown) {
      console.error('Error processing signal for NFT:', error);
      return {
        achievementMinted: false,
        error: (error as Error).message
      };
    }
  }

  /**
   * Get the token ID for a digital twin based on signal
   */
  private async getTokenIdForSignal(signal: Signal): Promise<number | null> {
    try {
      // Check if the digital twin exists in the contract
      const exists = await sckNFTService.doesDIDExist(signal.digitalTwinId);
      if (!exists) {
        return null;
      }

      return await sckNFTService.getTokenIdByDID(signal.digitalTwinId);
    } catch (error) {
      console.error('Error getting token ID for signal:', error);
      return null;
    }
  }

  /**
   * Check if a signal qualifies for an achievement
   */
  private async checkAchievementEligibility(tokenId: number, signal: Signal): Promise<{
    eligible: boolean;
    reason?: string;
  }> {
    try {
      // Get current achievements for this digital twin
      const achievements = await sckNFTService.getAchievements(tokenId);

      // Check if this specific achievement already exists
      const existingAchievement = achievements.find(
        achievement =>
          achievement.achievementType === signal.type &&
          achievement.title === signal.title
      );

      if (existingAchievement) {
        return {
          eligible: false,
          reason: 'Achievement already exists'
        };
      }

      // Check achievement thresholds
      const signalCount = await signalCollection.getSignalCount(signal.digitalTwinId);

      if (signal.type === 'certification' && signalCount < this.config.certificationThreshold) {
        return {
          eligible: false,
          reason: `Certification threshold not met (${signalCount}/${this.config.certificationThreshold})`
        };
      }

      if (signal.type === 'activity' && signalCount < this.config.activityThreshold) {
        return {
          eligible: false,
          reason: `Activity threshold not met (${signalCount}/${this.config.activityThreshold})`
        };
      }

      return { eligible: true };

    } catch (error) {
      console.error('Error checking achievement eligibility:', error);
      return {
        eligible: false,
        reason: 'Error checking eligibility'
      };
    }
  }

  /**
   * Mint an achievement based on a signal
   */
  private async mintAchievement(tokenId: number, signal: Signal): Promise<Achievement> {
    // Determine if this achievement should be soulbound
    const isSoulbound = signal.type === 'certification'
      ? this.config.soulboundCertifications
      : this.config.soulboundActivities;

    // Create achievement metadata
    const metadata = this.createAchievementMetadata(signal);

    // Mint the achievement
    const tx = await sckNFTService.mintAchievement(
      tokenId,
      signal.type,
      signal.title,
      JSON.stringify(metadata),
      isSoulbound
    );

    // Wait for transaction confirmation
    await tx.wait();

    // Return the achievement data
    const achievements = await sckNFTService.getAchievements(tokenId);
    return achievements[achievements.length - 1]; // Return the latest achievement
  }

  /**
   * Create metadata for an achievement
   */
  private createAchievementMetadata(signal: Signal): unknown {
    const baseMetadata = {
      source: signal.source,
      url: signal.url,
      value: signal.value,
      timestamp: new Date().toISOString(),
      signalId: signal.digitalTwinId
    };

    // Add signal-specific metadata
    if (signal.metadata) {
      return {
        ...baseMetadata,
        ...signal.metadata
      };
    }

    return baseMetadata;
  }

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  /**
   * Get achievement statistics for a digital twin
   */
  async getAchievementStats(digitalTwinId: string): Promise<{
    totalAchievements: number;
    certifications: number;
    activities: number;
    soulboundAchievements: number;
  }> {
    try {
      const tokenId = await sckNFTService.getTokenIdByDID(digitalTwinId);
      if (!tokenId) {
        return {
          totalAchievements: 0,
          certifications: 0,
          activities: 0,
          soulboundAchievements: 0
        };
      }

      const achievements = await sckNFTService.getAchievements(tokenId);

      return {
        totalAchievements: achievements.length,
        certifications: achievements.filter(a => a.achievementType === 'certification').length,
        activities: achievements.filter(a => a.achievementType === 'activity').length,
        soulboundAchievements: achievements.filter(a => a.isSoulbound).length
      };

    } catch (error) {
      console.error('Error getting achievement stats:', error);
      return {
        totalAchievements: 0,
        certifications: 0,
        activities: 0,
        soulboundAchievements: 0
      };
    }
  }

  /**
   * Check if a digital twin has a specific achievement
   */
  async hasAchievement(digitalTwinId: string, achievementType: string, title: string): Promise<boolean> {
    try {
      const tokenId = await sckNFTService.getTokenIdByDID(digitalTwinId);
      if (!tokenId) {
        return false;
      }

      const achievements = await sckNFTService.getAchievements(tokenId);

      return achievements.some(
        achievement =>
          achievement.achievementType === achievementType &&
          achievement.title === title
      );

    } catch (error) {
      console.error('Error checking achievement:', error);
      return false;
    }
  }

  /**
   * Get all achievements for a digital twin
   */
  async getDigitalTwinAchievements(digitalTwinId: string): Promise<Achievement[]> {
    try {
      const tokenId = await sckNFTService.getTokenIdByDID(digitalTwinId);
      if (!tokenId) {
        return [];
      }

      return await sckNFTService.getAchievements(tokenId);

    } catch (error) {
      console.error('Error getting digital twin achievements:', error);
      return [];
    }
  }

  // =============================================================================
  // CONFIGURATION FUNCTIONS
  // =============================================================================

  /**
   * Update integration configuration
   */
  updateConfig(newConfig: Partial<SignalToNFTConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   */
  getConfig(): SignalToNFTConfig {
    return { ...this.config };
  }
}

// =============================================================================
// DEFAULT CONFIGURATION
// =============================================================================

export const defaultSignalToNFTConfig: SignalToNFTConfig = {
  certificationThreshold: 1,
  activityThreshold: 5,
  soulboundCertifications: true,
  soulboundActivities: false,
  achievementTemplates: {
    certification: 'Certification Achievement',
    activity: 'Activity Achievement'
  }
};

// Export singleton instance
export const signalToNFTIntegration = new SignalToNFTIntegration(defaultSignalToNFTConfig); 