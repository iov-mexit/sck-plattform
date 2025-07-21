import { ethers } from 'ethers';

// Smart contract ABI for Digital Twin NFT
const DIGITAL_TWIN_ABI = [
  "function mintDigitalTwin(address to, string memory did, string memory role, string memory org) external returns (uint256)",
  "function mintAchievement(uint256 tokenId, string memory achievementType, string memory title, string memory metadata, bool isSoulbound) external",
  "function setTwinStatus(uint256 tokenId, bool isActive) external",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function isActive(uint256 tokenId) external view returns (bool)",
  "event DigitalTwinMinted(uint256 indexed tokenId, address indexed to, string did, string role, string org)",
  "event AchievementMinted(uint256 indexed tokenId, string achievementType, string title, bool isSoulbound)",
  "event TwinStatusChanged(uint256 indexed tokenId, bool isActive)"
];

export interface MintDigitalTwinParams {
  to: string;
  did: string;
  role: string;
  org: string;
  contractAddress: string;
  signer: ethers.Signer;
}

export interface MintAchievementParams {
  tokenId: string;
  achievementType: string;
  title: string;
  metadata: string;
  isSoulbound: boolean;
  contractAddress: string;
  signer: ethers.Signer;
}

export interface BlockchainTransaction {
  hash: string;
  network: string;
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export class BlockchainService {
  private provider: ethers.Provider;
  private contract: ethers.Contract | null = null;

  constructor(provider: ethers.Provider) {
    this.provider = provider;
  }

  // Initialize contract instance
  private getContract(contractAddress: string, signer?: ethers.Signer) {
    if (!this.contract || this.contract.address !== contractAddress) {
      this.contract = new ethers.Contract(contractAddress, DIGITAL_TWIN_ABI, signer || this.provider);
    }
    return this.contract;
  }

  // Mint a new Digital Twin NFT
  async mintDigitalTwin(params: MintDigitalTwinParams): Promise<BlockchainTransaction> {
    try {
      const contract = this.getContract(params.contractAddress, params.signer);

      // Estimate gas
      const gasEstimate = await contract.mintDigitalTwin.estimateGas(
        params.to,
        params.did,
        params.role,
        params.org
      );

      // Mint the digital twin
      const tx = await contract.mintDigitalTwin(
        params.to,
        params.did,
        params.role,
        params.org,
        {
          gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
        }
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      return {
        hash: tx.hash,
        network: 'ethereum', // or get from provider
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed?.toString(),
        gasPrice: receipt?.gasPrice?.toString(),
        status: 'confirmed',
      };
    } catch (error) {
      console.error('Error minting digital twin:', error);
      throw new Error(`Failed to mint digital twin: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Mint an achievement for a digital twin
  async mintAchievement(params: MintAchievementParams): Promise<BlockchainTransaction> {
    try {
      const contract = this.getContract(params.contractAddress, params.signer);

      // Estimate gas
      const gasEstimate = await contract.mintAchievement.estimateGas(
        params.tokenId,
        params.achievementType,
        params.title,
        params.metadata,
        params.isSoulbound
      );

      // Mint the achievement
      const tx = await contract.mintAchievement(
        params.tokenId,
        params.achievementType,
        params.title,
        params.metadata,
        params.isSoulbound,
        {
          gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
        }
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      return {
        hash: tx.hash,
        network: 'ethereum', // or get from provider
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

  // Set digital twin status (active/inactive)
  async setTwinStatus(tokenId: string, isActive: boolean, contractAddress: string, signer: ethers.Signer): Promise<BlockchainTransaction> {
    try {
      const contract = this.getContract(contractAddress, signer);

      // Estimate gas
      const gasEstimate = await contract.setTwinStatus.estimateGas(tokenId, isActive);

      // Set the status
      const tx = await contract.setTwinStatus(tokenId, isActive, {
        gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      return {
        hash: tx.hash,
        network: 'ethereum', // or get from provider
        blockNumber: receipt?.blockNumber,
        gasUsed: receipt?.gasUsed?.toString(),
        gasPrice: receipt?.gasPrice?.toString(),
        status: 'confirmed',
      };
    } catch (error) {
      console.error('Error setting twin status:', error);
      throw new Error(`Failed to set twin status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get digital twin owner
  async getTwinOwner(tokenId: string, contractAddress: string): Promise<string> {
    try {
      const contract = this.getContract(contractAddress);
      return await contract.ownerOf(tokenId);
    } catch (error) {
      console.error('Error getting twin owner:', error);
      throw new Error(`Failed to get twin owner: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get digital twin status
  async getTwinStatus(tokenId: string, contractAddress: string): Promise<boolean> {
    try {
      const contract = this.getContract(contractAddress);
      return await contract.isActive(tokenId);
    } catch (error) {
      console.error('Error getting twin status:', error);
      throw new Error(`Failed to get twin status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get token URI
  async getTokenURI(tokenId: string, contractAddress: string): Promise<string> {
    try {
      const contract = this.getContract(contractAddress);
      return await contract.tokenURI(tokenId);
    } catch (error) {
      console.error('Error getting token URI:', error);
      throw new Error(`Failed to get token URI: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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