import { ethers } from 'ethers';

// =============================================================================
// SCK NFT DYNAMIC CONTRACT INTERFACE
// =============================================================================

export interface DigitalTwin {
  did: string;
  role: string;
  organization: string;
  createdAt: number;
  isActive: boolean;
  lastUpdated: number;
}

export interface Achievement {
  achievementType: string;
  title: string;
  metadata: string;
  earnedAt: number;
  lastUpdated: number;
  isSoulbound: boolean;
  isActive: boolean;
  version: number;
}

export interface AchievementUpdate {
  achievementIndex: number;
  newMetadata: string;
  updatedAt: number;
  updateReason: string;
}

export interface AchievementTemplate {
  achievementType: string;
  title: string;
  metadata: string;
  isSoulbound: boolean;
  isActive: boolean;
  minThreshold: number;
  maxThreshold: number;
}

export interface SCKNFTDynamicContract {
  // Core functions
  mintDigitalTwin(to: string, did: string, role: string, organization: string): Promise<ethers.ContractTransaction>;
  updateDigitalTwin(tokenId: number, newRole: string, newOrganization: string): Promise<ethers.ContractTransaction>;
  mintAchievement(tokenId: number, achievementType: string, title: string, metadata: string, isSoulbound: boolean): Promise<ethers.ContractTransaction>;

  // Dynamic update functions
  updateAchievement(tokenId: number, achievementIndex: number, newMetadata: string, reason: string): Promise<ethers.ContractTransaction>;
  deactivateAchievement(tokenId: number, achievementIndex: number, reason: string): Promise<ethers.ContractTransaction>;
  reactivateAchievement(tokenId: number, achievementIndex: number, reason: string): Promise<ethers.ContractTransaction>;

  // Template management
  addAchievementTemplate(achievementType: string, title: string, metadata: string, isSoulbound: boolean, minThreshold: number, maxThreshold: number): Promise<ethers.ContractTransaction>;
  updateAchievementTemplate(achievementType: string, title: string, metadata: string, isSoulbound: boolean, minThreshold: number, maxThreshold: number): Promise<ethers.ContractTransaction>;
  mintAchievementFromTemplate(tokenId: number, achievementType: string, customMetadata: string): Promise<ethers.ContractTransaction>;

  // View functions
  getDigitalTwinData(tokenId: number): Promise<DigitalTwin>;
  getAchievements(tokenId: number): Promise<Achievement[]>;
  getActiveAchievements(tokenId: number): Promise<Achievement[]>;
  getAchievementUpdates(tokenId: number): Promise<AchievementUpdate[]>;
  getAchievementTemplate(achievementType: string): Promise<AchievementTemplate>;
  getActiveAchievementTypes(): Promise<string[]>;
  getAchievementCount(tokenId: number): Promise<number>;
  getActiveAchievementCount(tokenId: number): Promise<number>;

  // Events
  on(event: 'DigitalTwinMinted', listener: (tokenId: number, did: string, role: string, organization: string, owner: string) => void): void;
  on(event: 'DigitalTwinUpdated', listener: (tokenId: number, role: string, organization: string, updatedAt: number) => void): void;
  on(event: 'AchievementEarned', listener: (tokenId: number, achievementType: string, title: string, isSoulbound: boolean, version: number) => void): void;
  on(event: 'AchievementUpdated', listener: (tokenId: number, achievementIndex: number, newMetadata: string, version: number, reason: string) => void): void;
  on(event: 'AchievementTemplateAdded', listener: (achievementType: string, title: string, isSoulbound: boolean, minThreshold: number, maxThreshold: number) => void): void;
  on(event: 'AchievementTemplateUpdated', listener: (achievementType: string, title: string, isSoulbound: boolean, minThreshold: number, maxThreshold: number) => void): void;
}

// =============================================================================
// SCK NFT DYNAMIC SERVICE
// =============================================================================

export class SCKNFTDynamicService {
  private contract: SCKNFTDynamicContract | null = null;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() { }

  // Initialize the service with provider and signer
  async initialize(provider: ethers.Provider, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer || null;

    // Contract address - this should be configurable
    const contractAddress = process.env.NEXT_PUBLIC_SCK_NFT_DYNAMIC_ADDRESS;
    if (!contractAddress) {
      throw new Error('SCK NFT Dynamic contract address not configured');
    }

    // Contract ABI - this should be imported from compiled contract
    const contractABI = [
      // Core functions
      "function mintDigitalTwin(address to, string did, string role, string organization) external returns (uint256)",
      "function updateDigitalTwin(uint256 tokenId, string newRole, string newOrganization) external",
      "function mintAchievement(uint256 tokenId, string achievementType, string title, string metadata, bool isSoulbound) external returns (uint256)",

      // Dynamic update functions
      "function updateAchievement(uint256 tokenId, uint256 achievementIndex, string newMetadata, string reason) external",
      "function deactivateAchievement(uint256 tokenId, uint256 achievementIndex, string reason) external",
      "function reactivateAchievement(uint256 tokenId, uint256 achievementIndex, string reason) external",

      // Template management
      "function addAchievementTemplate(string achievementType, string title, string metadata, bool isSoulbound, uint256 minThreshold, uint256 maxThreshold) external",
      "function updateAchievementTemplate(string achievementType, string title, string metadata, bool isSoulbound, uint256 minThreshold, uint256 maxThreshold) external",
      "function mintAchievementFromTemplate(uint256 tokenId, string achievementType, string customMetadata) external returns (uint256)",

      // View functions
      "function getDigitalTwinData(uint256 tokenId) external view returns (tuple(string did, string role, string organization, uint256 createdAt, bool isActive, uint256 lastUpdated))",
      "function getAchievements(uint256 tokenId) external view returns (tuple(string achievementType, string title, string metadata, uint256 earnedAt, uint256 lastUpdated, bool isSoulbound, bool isActive, uint256 version)[])",
      "function getActiveAchievements(uint256 tokenId) external view returns (tuple(string achievementType, string title, string metadata, uint256 earnedAt, uint256 lastUpdated, bool isSoulbound, bool isActive, uint256 version)[])",
      "function getAchievementUpdates(uint256 tokenId) external view returns (tuple(uint256 achievementIndex, string newMetadata, uint256 updatedAt, string updateReason)[])",
      "function getAchievementTemplate(string achievementType) external view returns (tuple(string achievementType, string title, string metadata, bool isSoulbound, bool isActive, uint256 minThreshold, uint256 maxThreshold))",
      "function getActiveAchievementTypes() external view returns (string[])",
      "function getAchievementCount(uint256 tokenId) external view returns (uint256)",
      "function getActiveAchievementCount(uint256 tokenId) external view returns (uint256)",

      // Events
      "event DigitalTwinMinted(uint256 indexed tokenId, string indexed did, string role, string organization, address indexed owner)",
      "event DigitalTwinUpdated(uint256 indexed tokenId, string role, string organization, uint256 updatedAt)",
      "event AchievementEarned(uint256 indexed tokenId, string achievementType, string title, bool isSoulbound, uint256 version)",
      "event AchievementUpdated(uint256 indexed tokenId, uint256 achievementIndex, string newMetadata, uint256 version, string reason)",
      "event AchievementTemplateAdded(string achievementType, string title, bool isSoulbound, uint256 minThreshold, uint256 maxThreshold)",
      "event AchievementTemplateUpdated(string achievementType, string title, bool isSoulbound, uint256 minThreshold, uint256 maxThreshold)"
    ];

    this.contract = new ethers.Contract(contractAddress, contractABI, signer || provider) as SCKNFTDynamicContract;
  }

  // Check if service is initialized
  private checkInitialized() {
    if (!this.contract || !this.provider) {
      throw new Error('SCK NFT Dynamic Service not initialized');
    }
  }

  // =============================================================================
  // CORE FUNCTIONS
  // =============================================================================

  async mintDigitalTwin(to: string, did: string, role: string, organization: string): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.mintDigitalTwin(to, did, role, organization);
  }

  async updateDigitalTwin(tokenId: number, newRole: string, newOrganization: string): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.updateDigitalTwin(tokenId, newRole, newOrganization);
  }

  async mintAchievement(tokenId: number, achievementType: string, title: string, metadata: string, isSoulbound: boolean): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.mintAchievement(tokenId, achievementType, title, metadata, isSoulbound);
  }

  // =============================================================================
  // DYNAMIC UPDATE FUNCTIONS
  // =============================================================================

  async updateAchievement(tokenId: number, achievementIndex: number, newMetadata: string, reason: string): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.updateAchievement(tokenId, achievementIndex, newMetadata, reason);
  }

  async deactivateAchievement(tokenId: number, achievementIndex: number, reason: string): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.deactivateAchievement(tokenId, achievementIndex, reason);
  }

  async reactivateAchievement(tokenId: number, achievementIndex: number, reason: string): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.reactivateAchievement(tokenId, achievementIndex, reason);
  }

  // =============================================================================
  // TEMPLATE MANAGEMENT
  // =============================================================================

  async addAchievementTemplate(
    achievementType: string,
    title: string,
    metadata: string,
    isSoulbound: boolean,
    minThreshold: number,
    maxThreshold: number
  ): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.addAchievementTemplate(achievementType, title, metadata, isSoulbound, minThreshold, maxThreshold);
  }

  async updateAchievementTemplate(
    achievementType: string,
    title: string,
    metadata: string,
    isSoulbound: boolean,
    minThreshold: number,
    maxThreshold: number
  ): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.updateAchievementTemplate(achievementType, title, metadata, isSoulbound, minThreshold, maxThreshold);
  }

  async mintAchievementFromTemplate(tokenId: number, achievementType: string, customMetadata: string): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.mintAchievementFromTemplate(tokenId, achievementType, customMetadata);
  }

  // =============================================================================
  // VIEW FUNCTIONS
  // =============================================================================

  async getDigitalTwinData(tokenId: number): Promise<DigitalTwin> {
    this.checkInitialized();
    return await this.contract!.getDigitalTwinData(tokenId);
  }

  async getAchievements(tokenId: number): Promise<Achievement[]> {
    this.checkInitialized();
    return await this.contract!.getAchievements(tokenId);
  }

  async getActiveAchievements(tokenId: number): Promise<Achievement[]> {
    this.checkInitialized();
    return await this.contract!.getActiveAchievements(tokenId);
  }

  async getAchievementUpdates(tokenId: number): Promise<AchievementUpdate[]> {
    this.checkInitialized();
    return await this.contract!.getAchievementUpdates(tokenId);
  }

  async getAchievementTemplate(achievementType: string): Promise<AchievementTemplate> {
    this.checkInitialized();
    return await this.contract!.getAchievementTemplate(achievementType);
  }

  async getActiveAchievementTypes(): Promise<string[]> {
    this.checkInitialized();
    return await this.contract!.getActiveAchievementTypes();
  }

  async getAchievementCount(tokenId: number): Promise<number> {
    this.checkInitialized();
    return await this.contract!.getAchievementCount(tokenId);
  }

  async getActiveAchievementCount(tokenId: number): Promise<number> {
    this.checkInitialized();
    return await this.contract!.getActiveAchievementCount(tokenId);
  }

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  // Get contract instance
  getContract(): SCKNFTDynamicContract | null {
    return this.contract;
  }

  // Get provider
  getProvider(): ethers.Provider | null {
    return this.provider;
  }

  // Get signer
  getSigner(): ethers.Signer | null {
    return this.signer;
  }

  // Check if user is connected
  isConnected(): boolean {
    return this.contract !== null && this.provider !== null;
  }

  // Check if user can sign transactions
  canSign(): boolean {
    return this.signer !== null;
  }

  // =============================================================================
  // CONVENIENCE FUNCTIONS
  // =============================================================================

  /**
   * Update achievement metadata with automatic reason
   */
  async updateAchievementMetadata(
    tokenId: number,
    achievementIndex: number,
    newMetadata: string,
    reason: string = "Metadata update"
  ): Promise<ethers.ContractTransaction> {
    return await this.updateAchievement(tokenId, achievementIndex, newMetadata, reason);
  }

  /**
   * Deactivate achievement with automatic reason
   */
  async deactivateAchievementWithReason(
    tokenId: number,
    achievementIndex: number,
    reason: string = "Achievement deactivated"
  ): Promise<ethers.ContractTransaction> {
    return await this.deactivateAchievement(tokenId, achievementIndex, reason);
  }

  /**
   * Reactivate achievement with automatic reason
   */
  async reactivateAchievementWithReason(
    tokenId: number,
    achievementIndex: number,
    reason: string = "Achievement reactivated"
  ): Promise<ethers.ContractTransaction> {
    return await this.reactivateAchievement(tokenId, achievementIndex, reason);
  }

  /**
   * Get achievement audit trail
   */
  async getAchievementAuditTrail(tokenId: number): Promise<AchievementUpdate[]> {
    return await this.getAchievementUpdates(tokenId);
  }

  /**
   * Check if achievement is active
   */
  async isAchievementActive(tokenId: number, achievementIndex: number): Promise<boolean> {
    const achievements = await this.getAchievements(tokenId);
    if (achievementIndex >= achievements.length) {
      return false;
    }
    return achievements[achievementIndex].isActive;
  }
}

// Export singleton instance
export const sckNFTDynamicService = new SCKNFTDynamicService(); 