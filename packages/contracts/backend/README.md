# SCK NFT Contract System

## 🎯 Overview

The SCK (Secure Code KnAIght) NFT contract system provides a single, unified smart contract for managing digital twins and achievements on the blockchain. This system enables:

- **Digital Twin NFTs**: Represent users' digital identities with DID, role, and organization
- **Achievement Tracking**: Record certifications, activities, and milestones
- **Soulbound Tokens**: Prevent transfer of important achievements
- **Role-Based System**: Support different roles and organizations

## 📁 Contract Structure

### Core Contract: `SCKNFT.sol`

A single ERC-721 contract that handles both digital twins and achievements:

```solidity
contract SCKNFT is ERC721, Ownable {
    // Digital Twin data
    struct DigitalTwin {
        string did;              // Decentralized Identifier
        string role;             // Role (Developer, Security Expert, etc.)
        string organization;     // Organization name
        uint256 createdAt;       // Creation timestamp
        bool isActive;           // Active status
    }

    // Achievement data
    struct Achievement {
        string achievementType;  // Type (certification, activity, milestone)
        string title;            // Achievement title
        string metadata;         // Additional metadata (JSON)
        uint256 earnedAt;        // Timestamp when earned
        bool isSoulbound;        // Whether this achievement is soulbound
    }
}
```

## 🚀 Key Features

### 1. Digital Twin Minting
```solidity
function mintDigitalTwin(
    address to,
    string memory did,
    string memory role,
    string memory organization
) external onlyOwner returns (uint256)
```

### 2. Achievement Minting
```solidity
function mintAchievement(
    uint256 tokenId,
    string memory achievementType,
    string memory title,
    string memory metadata,
    bool isSoulbound
) external onlyOwner
```

### 3. Soulbound Functionality
- Achievements can be marked as soulbound
- Soulbound tokens cannot be transferred
- Maintains integrity of important achievements

### 4. DID Integration
- Each digital twin has a unique DID
- DIDs cannot be duplicated
- Easy lookup by DID

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Hardhat

### Installation
```bash
cd packages/contracts/backend
npm install
```

### Compilation
```bash
npm run compile
```

### Testing
```bash
npm test
```

### Local Deployment
```bash
# Start local node
npm run node

# Deploy to local network
npm run deploy:local
```

### Testnet Deployment
```bash
# Set environment variables
export PRIVATE_KEY=your_private_key
export SEPOLIA_URL=your_sepolia_rpc_url

# Deploy to Sepolia
npm run deploy:testnet
```

## 🔧 Configuration

### Environment Variables
Copy `env.template` to `.env` and configure your environment:

```bash
cp env.template .env
```

Then edit `.env` with your values:

```env
# Network URLs (get from Infura, Alchemy, etc.)
SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
MAINNET_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Private Key (for deployment) - without 0x prefix
PRIVATE_KEY=your_private_key_here

# Etherscan API Key (for verification)
ETHERSCAN_API_KEY=your_etherscan_api_key

# Gas Reporting (optional)
REPORT_GAS=1
```

### Network Configuration
The contract supports multiple networks with production-ready settings:

- **Hardhat**: Local development with unlimited contract size
- **Localhost**: For testing on local blockchain
- **Sepolia**: For testnet deployment with 21 gwei gas price
- **Mainnet**: For production deployment with 21 gwei gas price

### Enhanced Features
- **TypeScript Support**: Both JS and TS configs available
- **Gas Optimization**: Accurate gas estimation with 21 gwei pricing
- **Contract Size**: Unlimited size for development prototyping
- **Gas Reporting**: Optional gas cost analysis for CI/CD
- **Defensive Patterns**: Graceful handling of missing env vars

## 📊 Contract Functions

### Core Functions
| Function | Description | Access |
|----------|-------------|---------|
| `mintDigitalTwin()` | Mint new digital twin NFT | Owner only |
| `mintAchievement()` | Mint achievement for digital twin | Owner only |

### View Functions
| Function | Description |
|----------|-------------|
| `getDigitalTwinData()` | Get digital twin information |
| `getAchievements()` | Get all achievements for a token |
| `getTokenIdByDID()` | Find token ID by DID |
| `isSoulbound()` | Check if token is soulbound |
| `getAchievementCount()` | Get number of achievements |
| `totalDigitalTwins()` | Get total number of digital twins |
| `doesDIDExist()` | Check if DID exists |

### Admin Functions
| Function | Description | Access |
|----------|-------------|---------|
| `setBaseURI()` | Set metadata base URI | Owner only |
| `setSoulboundStatus()` | Set soulbound status | Owner only |
| `deactivateDigitalTwin()` | Deactivate digital twin | Owner only |

## 🎨 Metadata Structure

### Digital Twin Metadata
```json
{
  "name": "SCK Digital Twin #1",
  "description": "Secure Code KnAIght Digital Identity",
  "image": "https://api.securecodeknight.com/images/digital-twin/1.png",
  "attributes": [
    {
      "trait_type": "DID",
      "value": "did:sck:123456789"
    },
    {
      "trait_type": "Role",
      "value": "Developer"
    },
    {
      "trait_type": "Organization",
      "value": "SecureCorp"
    },
    {
      "trait_type": "Achievements",
      "value": "5"
    },
    {
      "trait_type": "Created At",
      "value": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Achievement Metadata
```json
{
  "achievementType": "certification",
  "title": "Security Expert Certification",
  "metadata": {
    "provider": "SecureCodeWarrior",
    "score": 95,
    "validUntil": "2025-01-15T10:30:00Z",
    "certificateUrl": "https://securecodewarrior.com/cert/123"
  }
}
```

## 🔗 Integration with Web App

### TypeScript Interface
The web application uses a TypeScript interface (`apps/web/lib/contracts/sck-nft.ts`) to interact with the contract:

```typescript
// Initialize service
await sckNFTService.initialize(provider, signer);

// Mint digital twin
const tx = await sckNFTService.mintDigitalTwin(
  userAddress,
  did,
  role,
  organization
);

// Mint achievement
const tx = await sckNFTService.mintAchievement(
  tokenId,
  "certification",
  "Security Expert",
  metadata,
  true // soulbound
);
```

### Signal Collection Integration
The contract integrates with the signal collection system:

1. **Signal triggers achievement**: When a signal is collected, it can trigger an achievement mint
2. **Achievement validation**: Contract validates achievement data before minting
3. **Metadata storage**: Achievement metadata includes signal information

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
The test suite covers:
- ✅ Contract deployment
- ✅ Digital twin minting
- ✅ Achievement minting
- ✅ Soulbound functionality
- ✅ View functions
- ✅ Admin functions
- ✅ Error handling

### Test Scenarios
1. **Digital Twin Creation**: Mint new digital twins with DID validation
2. **Achievement Minting**: Add achievements to digital twins
3. **Soulbound Logic**: Test transfer restrictions for soulbound tokens
4. **DID Uniqueness**: Ensure DIDs cannot be duplicated
5. **Admin Controls**: Verify only owner can call admin functions

## 🚀 Deployment Guide

### 1. Local Development
```bash
# Start local blockchain
npx hardhat node

# Deploy contract
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Testnet Deployment
```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Verify contract
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### 3. Production Deployment
```bash
# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Verify contract
npx hardhat verify --network mainnet CONTRACT_ADDRESS
```

## 🔒 Security Considerations

### Access Control
- Only contract owner can mint digital twins and achievements
- Owner can deactivate digital twins
- Soulbound tokens prevent unauthorized transfers

### Data Validation
- DIDs must be non-empty and unique
- Achievement types must be non-empty
- Token existence is validated before operations

### Gas Optimization
- Contract uses efficient data structures
- View functions are optimized for read operations
- Events are used for important state changes

## 📈 Future Enhancements

### Planned Features
1. **Role Templates**: Predefined role structures
2. **Achievement Levels**: Tiered achievement system
3. **Governance**: DAO-based contract upgrades
4. **Cross-Chain**: Multi-chain digital twin support
5. **Privacy**: Zero-knowledge proof integration

### Extensibility
The contract is designed to be extensible:
- Modular achievement system
- Configurable soulbound logic
- Flexible metadata structure
- Upgradeable contract patterns

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Write tests for new functionality
3. Update documentation
4. Submit pull request

### Code Standards
- Follow Solidity style guide
- Include comprehensive tests
- Document all public functions
- Use meaningful variable names

## 📞 Support

For questions or issues:
- Create GitHub issue
- Check test cases for examples
- Review contract documentation
- Consult integration guide

---

**SCK NFT Contract System** - Building the future of secure digital identities on the blockchain. 