import { ethers } from 'ethers';

// Organizational NFT Contract ABI
export const ORGANIZATIONAL_NFT_ABI = [
  // Organization Management
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "createOrganization",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "organizationId",
        "type": "uint256"
      }
    ],
    "name": "getOrganization",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "admin",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
          }
        ],
        "internalType": "struct OrganizationalNFT.Organization",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Digital Twin Management
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "organizationId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "role",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "assignedDid",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "createDigitalTwin",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "twinId",
        "type": "uint256"
      }
    ],
    "name": "getDigitalTwin",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "role",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "assignedDid",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "organizationId",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "active",
            "type": "bool"
          }
        ],
        "internalType": "struct OrganizationalNFT.DigitalTwin",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Achievement NFT Management
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "twinId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "achievementType",
        "type": "uint8"
      },
      {
        "internalType": "uint8",
        "name": "score",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "metadata",
        "type": "string"
      }
    ],
    "name": "mintAchievement",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "achievementId",
        "type": "uint256"
      }
    ],
    "name": "getAchievement",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "achievementType",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "score",
            "type": "uint8"
          },
          {
            "internalType": "string",
            "name": "metadata",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "twinId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "internalType": "struct OrganizationalNFT.Achievement",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Query Functions
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "organizationId",
        "type": "uint256"
      }
    ],
    "name": "getOrganizationTwins",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "twinId",
        "type": "uint256"
      }
    ],
    "name": "getTwinAchievements",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },

  // Events
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "organizationId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "admin",
        "type": "address"
      }
    ],
    "name": "OrganizationCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "twinId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "organizationId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "assignedDid",
        "type": "string"
      }
    ],
    "name": "DigitalTwinCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "achievementId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "twinId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "AchievementMinted",
    "type": "event"
  }
];

export interface Organization {
  name: string;
  description: string;
  admin: string;
  active: boolean;
}

export interface DigitalTwin {
  name: string;
  role: string;
  assignedDid: string;
  description: string;
  organizationId: number;
  active: boolean;
}

export interface Achievement {
  title: string;
  description: string;
  achievementType: number; // 0: certification, 1: score, 2: milestone
  score: number;
  metadata: string;
  twinId: number;
  tokenId: number;
}

export class OrganizationalNFTService {
  private contract: ethers.Contract;
  private signer?: ethers.Signer;
  private provider: ethers.Provider;

  constructor(
    contractAddress: string,
    signer?: ethers.Signer,
    provider?: ethers.Provider
  ) {
    this.signer = signer;
    this.provider = provider || signer?.provider;

    if (!this.provider) {
      throw new Error('Provider is required');
    }

    this.contract = new ethers.Contract(
      contractAddress,
      ORGANIZATIONAL_NFT_ABI,
      signer || provider
    );
  }

  // Organization Management
  async createOrganization(name: string, description: string): Promise<number> {
    if (!this.signer) throw new Error('Signer required for transactions');

    const tx = await this.contract.createOrganization(name, description);
    const receipt = await tx.wait();

    // Extract organization ID from event
    const event = receipt.logs.find((log: ethers.Log) =>
      log.eventName === 'OrganizationCreated'
    );

    return event?.args?.organizationId || 0;
  }

  async getOrganization(organizationId: number): Promise<Organization> {
    const org = await this.contract.getOrganization(organizationId);
    return {
      name: org.name,
      description: org.description,
      admin: org.admin,
      active: org.active
    };
  }

  // Digital Twin Management
  async createDigitalTwin(
    organizationId: number,
    name: string,
    role: string,
    assignedDid: string,
    description: string = ''
  ): Promise<number> {
    if (!this.signer) throw new Error('Signer required for transactions');

    const tx = await this.contract.createDigitalTwin(
      organizationId,
      name,
      role,
      assignedDid,
      description
    );
    const receipt = await tx.wait();

    // Extract twin ID from event
    const event = receipt.logs.find((log: ethers.Log) =>
      log.eventName === 'DigitalTwinCreated'
    );

    return event?.args?.twinId || 0;
  }

  async getDigitalTwin(twinId: number): Promise<DigitalTwin> {
    const twin = await this.contract.getDigitalTwin(twinId);
    return {
      name: twin.name,
      role: twin.role,
      assignedDid: twin.assignedDid,
      description: twin.description,
      organizationId: twin.organizationId,
      active: twin.active
    };
  }

  // Achievement NFT Management
  async mintAchievement(
    twinId: number,
    title: string,
    description: string,
    achievementType: 'certification' | 'score' | 'milestone',
    score?: number,
    metadata: string = ''
  ): Promise<number> {
    if (!this.signer) throw new Error('Signer required for transactions');

    const typeMap = { certification: 0, score: 1, milestone: 2 };
    const typeValue = typeMap[achievementType];
    const scoreValue = score || 0;

    const tx = await this.contract.mintAchievement(
      twinId,
      title,
      description,
      typeValue,
      scoreValue,
      metadata
    );
    const receipt = await tx.wait();

    // Extract achievement ID from event
    const event = receipt.logs.find((log: ethers.Log) =>
      log.eventName === 'AchievementMinted'
    );

    return event?.args?.achievementId || 0;
  }

  async getAchievement(achievementId: number): Promise<Achievement> {
    const achievement = await this.contract.getAchievement(achievementId);
    return {
      title: achievement.title,
      description: achievement.description,
      achievementType: achievement.achievementType,
      score: achievement.score,
      metadata: achievement.metadata,
      twinId: achievement.twinId,
      tokenId: achievement.tokenId
    };
  }

  // Query Functions
  async getOrganizationTwins(organizationId: number): Promise<number[]> {
    return await this.contract.getOrganizationTwins(organizationId);
  }

  async getTwinAchievements(twinId: number): Promise<number[]> {
    return await this.contract.getTwinAchievements(twinId);
  }

  // Batch Operations
  async getOrganizationData(organizationId: number) {
    const organization = await this.getOrganization(organizationId);
    const twinIds = await this.getOrganizationTwins(organizationId);

    const twins = await Promise.all(
      twinIds.map(async (twinId) => {
        const twin = await this.getDigitalTwin(twinId);
        const achievementIds = await this.getTwinAchievements(twinId);
        const achievements = await Promise.all(
          achievementIds.map(id => this.getAchievement(id))
        );

        return {
          ...twin,
          id: twinId,
          achievements
        };
      })
    );

    return {
      organization,
      twins
    };
  }
}

// Export singleton instance
export const organizationalNFTService = new OrganizationalNFTService(
  process.env.NEXT_PUBLIC_ORGANIZATIONAL_NFT_ADDRESS || '0x0000000000000000000000000000000000000000'
); 