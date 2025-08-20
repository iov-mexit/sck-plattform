import { ethers } from 'ethers';

// SCK Dynamic NFT contract ABI - key functions
const SCK_DYNAMIC_NFT_ABI = [
  // Role Agent Functions
  "function mintRoleAgent(address to, string memory did, string memory name, string memory role, string memory organization, uint256 initialTrustScore) external returns (uint256)",
  "function getRoleAgentData(uint256 tokenId) external view returns (tuple(string did, string name, string role, string organization, uint256 trustScore, uint8 trustLevel, uint256 createdAt, uint256 lastUpdated, bool isActive, bool isEligibleForAchievements, uint256 totalSignals, uint256 achievementCount))",

  // Trust Signal Functions
  "function processTrustSignal(uint256 tokenId, uint8 signalType, int256 scoreImpact, string memory source, string memory metadata) external",
  "function batchProcessTrustSignals(uint256[] memory tokenIds, uint8[] memory signalTypes, int256[] memory scoreImpacts, string[] memory sources, string[] memory metadataArray) external",
  "function getTrustSignals(uint256 tokenId) external view returns (tuple(uint8 signalType, int256 scoreImpact, string source, string metadata, uint256 timestamp, address reporter, bool isVerified)[])",
  "function getRecentTrustSignals(uint256 tokenId, uint256 count) external view returns (tuple(uint8 signalType, int256 scoreImpact, string source, string metadata, uint256 timestamp, address reporter, bool isVerified)[])",

  // Achievement Functions
  "function mintAchievement(uint256 tokenId, string memory achievementType, string memory title, string memory description, string memory metadata, bool isSoulbound, string memory imageURI) external",
  "function getAchievements(uint256 tokenId) external view returns (tuple(string achievementType, string title, string description, string metadata, uint256 trustScoreAtEarning, uint256 earnedAt, bool isSoulbound, string imageURI)[])",

  // Platform Statistics
  "function getPlatformStats() external view returns (uint256 totalAgents, uint256 totalSignalsProcessed, uint256 totalAchievementsEarned, uint256 eligibleAgents, uint256 unverifiedAgents, uint256 basicAgents, uint256 trustedAgents, uint256 highlyTrustedAgents, uint256 eliteAgents)",

  // Lookup Functions
  "function getTokenIdByDID(string memory did) external view returns (uint256)",
  "function isSoulbound(uint256 tokenId) external view returns (bool)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenURI(uint256 tokenId) external view returns (string)",

  // Role Management
  "function hasRole(bytes32 role, address account) external view returns (bool)",
  "function SIGNAL_UPDATER_ROLE() external view returns (bytes32)",
  "function ACHIEVEMENT_MINTER_ROLE() external view returns (bytes32)",

  // Standard ERC721 Events
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event RoleAgentMinted(uint256 indexed tokenId, string indexed did, string name, string role, string organization, address indexed owner)",
  "event TrustScoreUpdated(uint256 indexed tokenId, uint256 oldScore, uint256 newScore, uint8 oldLevel, uint8 newLevel, uint8 signalType)",
  "event TrustSignalProcessed(uint256 indexed tokenId, uint8 indexed signalType, int256 scoreImpact, string source, address indexed reporter)",
  "event AchievementEarned(uint256 indexed tokenId, string achievementType, string title, uint256 trustScoreAtEarning, bool isSoulbound)",
  "event EligibilityChanged(uint256 indexed tokenId, bool wasEligible, bool isEligible, uint256 trustScore)"
];

// Enums matching the contract
export enum TrustLevel {
  UNVERIFIED = 0,
  BASIC = 1,
  TRUSTED = 2,
  HIGHLY_TRUSTED = 3,
  ELITE = 4
}

export enum SignalType {
  SECURITY_AUDIT = 0,
  CODE_REVIEW = 1,
  VULNERABILITY_FOUND = 2,
  CERTIFICATION_EARNED = 3,
  PEER_VALIDATION = 4,
  PERFORMANCE_METRIC = 5,
  TRAINING_COMPLETED = 6
}

// Type definitions
export interface RoleAgentData {
  did: string;
  name: string;
  role: string;
  organization: string;
  trustScore: number;
  trustLevel: TrustLevel;
  createdAt: number;
  lastUpdated: number;
  isActive: boolean;
  isEligibleForAchievements: boolean;
  totalSignals: number;
  achievementCount: number;
}

export interface TrustSignal {
  signalType: SignalType;
  scoreImpact: number;
  source: string;
  metadata: string;
  timestamp: number;
  reporter: string;
  isVerified: boolean;
}

export interface Achievement {
  achievementType: string;
  title: string;
  description: string;
  metadata: string;
  trustScoreAtEarning: number;
  earnedAt: number;
  isSoulbound: boolean;
  imageURI: string;
}

export interface PlatformStats {
  totalAgents: number;
  totalSignalsProcessed: number;
  totalAchievementsEarned: number;
  eligibleAgents: number;
  unverifiedAgents: number;
  basicAgents: number;
  trustedAgents: number;
  highlyTrustedAgents: number;
  eliteAgents: number;
}

export interface BlockchainTransaction {
  hash: string;
  network: string;
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

// Service class
export class SCKDynamicNFTService {
  private provider: ethers.Provider;
  private contract: ethers.Contract | null = null;

  constructor(provider: ethers.Provider) {
    this.provider = provider;
  }

  // Initialize contract instance
  private getContract(contractAddress: string, signer?: ethers.Signer) {
    if (!this.contract || this.contract.target !== contractAddress) {
      this.contract = new ethers.Contract(contractAddress, SCK_DYNAMIC_NFT_ABI, signer || this.provider);
    }
    return this.contract;
  }

  // Role Agent Functions
  async mintRoleAgent(
    contractAddress: string,
    signer: ethers.Signer,
    to: string,
    did: string,
    name: string,
    role: string,
    organization: string,
    initialTrustScore: number
  ): Promise<BlockchainTransaction> {
    try {
      const contract = this.getContract(contractAddress, signer);

      const gasEstimate = await contract.mintRoleAgent.estimateGas(
        to, did, name, role, organization, initialTrustScore
      );

      const tx = await contract.mintRoleAgent(
        to, did, name, role, organization, initialTrustScore,
        { gasLimit: (gasEstimate * 120n) / 100n } // 20% buffer
      );

      const receipt = await tx.wait();

      return {
        hash: tx.hash,
        network: 'sepolia',
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed?.toString(),
        gasPrice: receipt?.gasPrice?.toString(),
        status: 'confirmed',
      };
    } catch (error) {
      console.error('Error minting role agent:', error);
      throw new Error(`Failed to mint role agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRoleAgentData(contractAddress: string, tokenId: number): Promise<RoleAgentData> {
    try {
      const contract = this.getContract(contractAddress);
      const data = await contract.getRoleAgentData(tokenId);

      return {
        did: data[0],
        name: data[1],
        role: data[2],
        organization: data[3],
        trustScore: Number(data[4]),
        trustLevel: Number(data[5]) as TrustLevel,
        createdAt: Number(data[6]),
        lastUpdated: Number(data[7]),
        isActive: data[8],
        isEligibleForAchievements: data[9],
        totalSignals: Number(data[10]),
        achievementCount: Number(data[11])
      };
    } catch (error) {
      console.error('Error getting role agent data:', error);
      throw new Error(`Failed to get role agent data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Trust Signal Functions
  async processTrustSignal(
    contractAddress: string,
    signer: ethers.Signer,
    tokenId: number,
    signalType: SignalType,
    scoreImpact: number,
    source: string,
    metadata: string
  ): Promise<BlockchainTransaction> {
    try {
      const contract = this.getContract(contractAddress, signer);

      const gasEstimate = await contract.processTrustSignal.estimateGas(
        tokenId, signalType, scoreImpact, source, metadata
      );

      const tx = await contract.processTrustSignal(
        tokenId, signalType, scoreImpact, source, metadata,
        { gasLimit: (gasEstimate * 120n) / 100n }
      );

      const receipt = await tx.wait();

      return {
        hash: tx.hash,
        network: 'sepolia',
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed?.toString(),
        gasPrice: receipt?.gasPrice?.toString(),
        status: 'confirmed',
      };
    } catch (error) {
      console.error('Error processing trust signal:', error);
      throw new Error(`Failed to process trust signal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTrustSignals(contractAddress: string, tokenId: number): Promise<TrustSignal[]> {
    try {
      const contract = this.getContract(contractAddress);
      const signals = await contract.getTrustSignals(tokenId);

      return signals.map((signal: any) => ({
        signalType: Number(signal[0]) as SignalType,
        scoreImpact: Number(signal[1]),
        source: signal[2],
        metadata: signal[3],
        timestamp: Number(signal[4]),
        reporter: signal[5],
        isVerified: signal[6]
      }));
    } catch (error) {
      console.error('Error getting trust signals:', error);
      throw new Error(`Failed to get trust signals: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRecentTrustSignals(contractAddress: string, tokenId: number, count: number): Promise<TrustSignal[]> {
    try {
      const contract = this.getContract(contractAddress);
      const signals = await contract.getRecentTrustSignals(tokenId, count);

      return signals.map((signal: any) => ({
        signalType: Number(signal[0]) as SignalType,
        scoreImpact: Number(signal[1]),
        source: signal[2],
        metadata: signal[3],
        timestamp: Number(signal[4]),
        reporter: signal[5],
        isVerified: signal[6]
      }));
    } catch (error) {
      console.error('Error getting recent trust signals:', error);
      throw new Error(`Failed to get recent trust signals: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Achievement Functions
  async mintAchievement(
    contractAddress: string,
    signer: ethers.Signer,
    tokenId: number,
    achievementType: string,
    title: string,
    description: string,
    metadata: string,
    isSoulbound: boolean,
    imageURI: string
  ): Promise<BlockchainTransaction> {
    try {
      const contract = this.getContract(contractAddress, signer);

      const gasEstimate = await contract.mintAchievement.estimateGas(
        tokenId, achievementType, title, description, metadata, isSoulbound, imageURI
      );

      const tx = await contract.mintAchievement(
        tokenId, achievementType, title, description, metadata, isSoulbound, imageURI,
        { gasLimit: (gasEstimate * 120n) / 100n }
      );

      const receipt = await tx.wait();

      return {
        hash: tx.hash,
        network: 'sepolia',
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed?.toString(),
        gasPrice: receipt?.gasPrice?.toString(),
        status: 'confirmed',
      };
    } catch (error) {
      console.error('Error minting achievement:', error);
      throw new Error(`Failed to mint achievement: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAchievements(contractAddress: string, tokenId: number): Promise<Achievement[]> {
    try {
      const contract = this.getContract(contractAddress);
      const achievements = await contract.getAchievements(tokenId);

      return achievements.map((achievement: any) => ({
        achievementType: achievement[0],
        title: achievement[1],
        description: achievement[2],
        metadata: achievement[3],
        trustScoreAtEarning: Number(achievement[4]),
        earnedAt: Number(achievement[5]),
        isSoulbound: achievement[6],
        imageURI: achievement[7]
      }));
    } catch (error) {
      console.error('Error getting achievements:', error);
      throw new Error(`Failed to get achievements: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Platform Statistics
  async getPlatformStats(contractAddress: string): Promise<PlatformStats> {
    try {
      const contract = this.getContract(contractAddress);
      const stats = await contract.getPlatformStats();

      return {
        totalAgents: Number(stats[0]),
        totalSignalsProcessed: Number(stats[1]),
        totalAchievementsEarned: Number(stats[2]),
        eligibleAgents: Number(stats[3]),
        unverifiedAgents: Number(stats[4]),
        basicAgents: Number(stats[5]),
        trustedAgents: Number(stats[6]),
        highlyTrustedAgents: Number(stats[7]),
        eliteAgents: Number(stats[8])
      };
    } catch (error) {
      console.error('Error getting platform stats:', error);
      throw new Error(`Failed to get platform stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Utility Functions
  async getTokenIdByDID(contractAddress: string, did: string): Promise<number> {
    try {
      const contract = this.getContract(contractAddress);
      const tokenId = await contract.getTokenIdByDID(did);
      return Number(tokenId);
    } catch (error) {
      console.error('Error getting token ID by DID:', error);
      throw new Error(`Failed to get token ID by DID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async isSoulbound(contractAddress: string, tokenId: number): Promise<boolean> {
    try {
      const contract = this.getContract(contractAddress);
      return await contract.isSoulbound(tokenId);
    } catch (error) {
      console.error('Error checking soulbound status:', error);
      throw new Error(`Failed to check soulbound status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTokenOwner(contractAddress: string, tokenId: number): Promise<string> {
    try {
      const contract = this.getContract(contractAddress);
      return await contract.ownerOf(tokenId);
    } catch (error) {
      console.error('Error getting token owner:', error);
      throw new Error(`Failed to get token owner: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTokenURI(contractAddress: string, tokenId: number): Promise<string> {
    try {
      const contract = this.getContract(contractAddress);
      return await contract.tokenURI(tokenId);
    } catch (error) {
      console.error('Error getting token URI:', error);
      throw new Error(`Failed to get token URI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Helper Functions
  getTrustLevelName(level: TrustLevel): string {
    switch (level) {
      case TrustLevel.ELITE:
        return 'Elite';
      case TrustLevel.HIGHLY_TRUSTED:
        return 'Highly Trusted';
      case TrustLevel.TRUSTED:
        return 'Trusted';
      case TrustLevel.BASIC:
        return 'Basic';
      case TrustLevel.UNVERIFIED:
      default:
        return 'Unverified';
    }
  }

  getSignalTypeName(type: SignalType): string {
    switch (type) {
      case SignalType.SECURITY_AUDIT:
        return 'Security Audit';
      case SignalType.CODE_REVIEW:
        return 'Code Review';
      case SignalType.VULNERABILITY_FOUND:
        return 'Vulnerability Found';
      case SignalType.CERTIFICATION_EARNED:
        return 'Certification Earned';
      case SignalType.PEER_VALIDATION:
        return 'Peer Validation';
      case SignalType.PERFORMANCE_METRIC:
        return 'Performance Metric';
      case SignalType.TRAINING_COMPLETED:
        return 'Training Completed';
      default:
        return 'Unknown';
    }
  }

  isEligibleForAchievements(trustScore: number): boolean {
    return trustScore >= 750;
  }

  calculateTrustLevel(trustScore: number): TrustLevel {
    if (trustScore >= 900) return TrustLevel.ELITE;
    if (trustScore >= 750) return TrustLevel.HIGHLY_TRUSTED;
    if (trustScore >= 500) return TrustLevel.TRUSTED;
    if (trustScore >= 250) return TrustLevel.BASIC;
    return TrustLevel.UNVERIFIED;
  }

  // Wait for transaction confirmation
  async waitForTransaction(hash: string): Promise<ethers.TransactionReceipt | null> {
    try {
      return await this.provider.waitForTransaction(hash);
    } catch (error) {
      console.error('Error waiting for transaction:', error);
      throw new Error(`Failed to wait for transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get transaction status
  async getTransactionStatus(hash: string): Promise<'pending' | 'confirmed' | 'failed'> {
    try {
      const receipt = await this.provider.getTransactionReceipt(hash);
      if (!receipt) return 'pending';
      return receipt.status === 1 ? 'confirmed' : 'failed';
    } catch (error) {
      console.error('Error getting transaction status:', error);
      return 'failed';
    }
  }
} 