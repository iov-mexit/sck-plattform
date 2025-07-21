import { ethers } from 'ethers';

// =============================================================================
// SCK NFT CONTRACT INTERFACE
// =============================================================================

export interface DigitalTwin {
  did: string;
  role: string;
  organization: string;
  createdAt: number;
  isActive: boolean;
}

export interface Achievement {
  achievementType: string;
  title: string;
  metadata: string;
  earnedAt: number;
  isSoulbound: boolean;
}

export interface SCKNFTContract {
  // Core functions
  mintDigitalTwin(to: string, did: string, role: string, organization: string): Promise<ethers.ContractTransaction>;
  mintAchievement(tokenId: number, achievementType: string, title: string, metadata: string, isSoulbound: boolean): Promise<ethers.ContractTransaction>;

  // View functions
  getDigitalTwinData(tokenId: number): Promise<DigitalTwin>;
  getAchievements(tokenId: number): Promise<Achievement[]>;
  getTokenIdByDID(did: string): Promise<number>;
  isSoulbound(tokenId: number): Promise<boolean>;
  getAchievementCount(tokenId: number): Promise<number>;
  totalDigitalTwins(): Promise<number>;
  doesDIDExist(did: string): Promise<boolean>;

  // Admin functions
  setBaseURI(baseURI: string): Promise<ethers.ContractTransaction>;
  setSoulboundStatus(tokenId: number, isSoulbound: boolean): Promise<ethers.ContractTransaction>;
  deactivateDigitalTwin(tokenId: number): Promise<ethers.ContractTransaction>;

  // Events
  on(event: 'DigitalTwinMinted', listener: (tokenId: number, did: string, role: string, organization: string, owner: string) => void): void;
  on(event: 'AchievementEarned', listener: (tokenId: number, achievementType: string, title: string, isSoulbound: boolean) => void): void;
  on(event: 'SoulboundStatusChanged', listener: (tokenId: number, isSoulbound: boolean) => void): void;
}

// =============================================================================
// SCK NFT SERVICE
// =============================================================================

export class SCKNFTService {
  private contract: SCKNFTContract | null = null;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor() { }

  // Initialize the service with provider and signer
  async initialize(provider: ethers.Provider, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer || null;

    // Contract address - this should be configurable
    const contractAddress = process.env.NEXT_PUBLIC_SCK_NFT_ADDRESS;
    if (!contractAddress) {
      throw new Error('SCK NFT contract address not configured');
    }

    // Contract ABI - this should be imported from compiled contract
    const contractABI = [
      // Core functions
      "function mintDigitalTwin(address to, string did, string role, string organization) external returns (uint256)",
      "function mintAchievement(uint256 tokenId, string achievementType, string title, string metadata, bool isSoulbound) external",

      // View functions
      "function getDigitalTwinData(uint256 tokenId) external view returns (tuple(string did, string role, string organization, uint256 createdAt, bool isActive))",
      "function getAchievements(uint256 tokenId) external view returns (tuple(string achievementType, string title, string metadata, uint256 earnedAt, bool isSoulbound)[])",
      "function getTokenIdByDID(string did) external view returns (uint256)",
      "function isSoulbound(uint256 tokenId) external view returns (bool)",
      "function getAchievementCount(uint256 tokenId) external view returns (uint256)",
      "function totalDigitalTwins() external view returns (uint256)",
      "function doesDIDExist(string did) external view returns (bool)",

      // Admin functions
      "function setBaseURI(string baseURI) external",
      "function setSoulboundStatus(uint256 tokenId, bool isSoulbound) external",
      "function deactivateDigitalTwin(uint256 tokenId) external",

      // Events
      "event DigitalTwinMinted(uint256 indexed tokenId, string indexed did, string role, string organization, address indexed owner)",
      "event AchievementEarned(uint256 indexed tokenId, string achievementType, string title, bool isSoulbound)",
      "event SoulboundStatusChanged(uint256 indexed tokenId, bool isSoulbound)"
    ];

    this.contract = new ethers.Contract(contractAddress, contractABI, signer || provider) as SCKNFTContract;
  }

  // Check if service is initialized
  private checkInitialized() {
    if (!this.contract || !this.provider) {
      throw new Error('SCK NFT Service not initialized');
    }
  }

  // =============================================================================
  // CORE FUNCTIONS
  // =============================================================================

  async mintDigitalTwin(to: string, did: string, role: string, organization: string): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.mintDigitalTwin(to, did, role, organization);
  }

  async mintAchievement(tokenId: number, achievementType: string, title: string, metadata: string, isSoulbound: boolean): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.mintAchievement(tokenId, achievementType, title, metadata, isSoulbound);
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

  async getTokenIdByDID(did: string): Promise<number> {
    this.checkInitialized();
    return await this.contract!.getTokenIdByDID(did);
  }

  async isSoulbound(tokenId: number): Promise<boolean> {
    this.checkInitialized();
    return await this.contract!.isSoulbound(tokenId);
  }

  async getAchievementCount(tokenId: number): Promise<number> {
    this.checkInitialized();
    return await this.contract!.getAchievementCount(tokenId);
  }

  async totalDigitalTwins(): Promise<number> {
    this.checkInitialized();
    return await this.contract!.totalDigitalTwins();
  }

  async doesDIDExist(did: string): Promise<boolean> {
    this.checkInitialized();
    return await this.contract!.doesDIDExist(did);
  }

  // =============================================================================
  // ADMIN FUNCTIONS
  // =============================================================================

  async setBaseURI(baseURI: string): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.setBaseURI(baseURI);
  }

  async setSoulboundStatus(tokenId: number, isSoulbound: boolean): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.setSoulboundStatus(tokenId, isSoulbound);
  }

  async deactivateDigitalTwin(tokenId: number): Promise<ethers.ContractTransaction> {
    this.checkInitialized();
    return await this.contract!.deactivateDigitalTwin(tokenId);
  }

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  // Get contract instance
  getContract(): SCKNFTContract | null {
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
}

// Export singleton instance
export const sckNFTService = new SCKNFTService(); 