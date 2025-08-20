# SCK Dynamic NFT Smart Contracts

## 🎯 Overview

The SCK Dynamic NFT system provides blockchain-based role agents with dynamic trust scores and achievement tracking. This contract enables:

- **Dynamic Trust Scores**: Trust scores that update based on real-world signals
- **Achievement System**: NFT-based achievements for role agents
- **Soulbound Tokens**: Non-transferable achievement tokens
- **Platform Statistics**: Global metrics and analytics
- **Role-Based Access**: Granular permissions for different operations

## 📋 Contract Features

### Core Functionality
- ✅ **Role Agent Minting**: Create role agents with initial trust scores
- ✅ **Dynamic Trust Updates**: Process trust signals to update scores
- ✅ **Achievement Minting**: Award achievements to eligible agents
- ✅ **Soulbound Support**: Non-transferable achievement tokens
- ✅ **Dynamic Metadata**: NFT metadata that updates with trust score
- ✅ **Platform Analytics**: Global statistics and metrics

### Trust System
- **Trust Levels**: 5 levels from Unverified (0-249) to Elite (900-1000)
- **Signal Types**: 7 different signal types for various activities
- **Batch Processing**: Efficient batch processing of multiple signals
- **Eligibility Threshold**: 750+ trust score required for achievements

### Security Features
- **Role-Based Access Control**: Separate roles for different operations
- **Transfer Restrictions**: Soulbound tokens cannot be transferred
- **Input Validation**: Comprehensive validation of all inputs
- **Emergency Controls**: Admin functions for edge cases

## 📁 File Structure

```
packages/contracts/backend/
├── SCKDynamicNFT.sol              # Main contract (395 lines)
├── scripts/
│   └── deploy-sck-dynamic.js      # Deployment script with testing
├── test/
│   └── SCKDynamicNFT.test.js      # Comprehensive test suite
├── hardhat.config.ts              # Hardhat configuration
├── package.json                   # Dependencies and scripts
├── README.md                      # This file
└── .env.example                   # Environment variables template
```

## 🚀 Quick Start

### 1. Installation

```bash
cd packages/contracts/backend
npm install
```

### 2. Environment Setup

Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your values
```

Required environment variables:
```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR-PROJECT-ID
ETHERSCAN_API_KEY=your_etherscan_api_key
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key (optional)
```

### 3. Compile Contract

```bash
npm run compile
```

### 4. Run Tests

```bash
npm run test
```

For coverage report:
```bash
npm run test:coverage
```

### 5. Deploy to Sepolia Testnet

```bash
npm run deploy:sepolia
```

## 🔧 Contract Interface

### Core Structs

```solidity
struct RoleAgent {
    string did;                      // Decentralized Identifier
    string name;                     // Agent name
    string role;                     // Role category
    string organization;             // Organization name
    uint256 trustScore;              // Current trust score (0-1000)
    TrustLevel trustLevel;           // Derived trust level
    uint256 createdAt;               // Creation timestamp
    uint256 lastUpdated;             // Last update timestamp
    bool isActive;                   // Active status
    bool isEligibleForAchievements;  // NFT eligibility (≥750)
    uint256 totalSignals;            // Total signals processed
    uint256 achievementCount;        // Number of achievements
}

struct TrustSignal {
    SignalType signalType;           // Type of signal
    int256 scoreImpact;             // Score change (-100 to +100)
    string source;                  // Signal source
    string metadata;                // Additional data (JSON)
    uint256 timestamp;              // When recorded
    address reporter;               // Who reported
    bool isVerified;                // Verification status
}

struct Achievement {
    string achievementType;          // Achievement category
    string title;                   // Achievement title
    string description;             // Description
    string metadata;                // Additional metadata (JSON)
    uint256 trustScoreAtEarning;    // Trust score when earned
    uint256 earnedAt;               // Timestamp when earned
    bool isSoulbound;               // Transfer restriction
    string imageURI;                // Achievement image
}
```

### Trust Levels

```solidity
enum TrustLevel {
    UNVERIFIED,     // 0-249
    BASIC,          // 250-499
    TRUSTED,        // 500-749
    HIGHLY_TRUSTED, // 750-899
    ELITE           // 900-1000
}
```

### Signal Types

```solidity
enum SignalType {
    SECURITY_AUDIT,       // Security audits
    CODE_REVIEW,          // Code reviews
    VULNERABILITY_FOUND,  // Vulnerability discoveries
    CERTIFICATION_EARNED, // Training certifications
    PEER_VALIDATION,      // Peer validations
    PERFORMANCE_METRIC,   // Performance measurements
    TRAINING_COMPLETED    // Training completions
}
```

## 🎮 Usage Examples

### Mint Role Agent

```solidity
uint256 tokenId = sckNFT.mintRoleAgent(
    userAddress,
    "did:ethr:0x123...",
    "Alice Security Expert",
    "Security Expert",
    "SCK Platform",
    850  // Initial trust score
);
```

### Process Trust Signal

```solidity
sckNFT.processTrustSignal(
    tokenId,
    SignalType.SECURITY_AUDIT,
    50,  // +50 trust score
    "audit-system-v1",
    '{"audit_type":"smart_contract","severity":"high"}'
);
```

### Mint Achievement

```solidity
sckNFT.mintAchievement(
    tokenId,
    "Security Certification",
    "Smart Contract Security Expert",
    "Completed advanced security audit training",
    '{"certification_level":"expert"}',
    false, // Not soulbound
    "https://api.sck.com/achievements/security-expert.png"
);
```

## 📊 Platform Statistics

Get comprehensive platform metrics:

```solidity
(
    uint256 totalAgents,
    uint256 totalSignals,
    uint256 totalAchievements,
    uint256 eligibleAgents,
    uint256 unverifiedAgents,
    uint256 basicAgents,
    uint256 trustedAgents,
    uint256 highlyTrustedAgents,
    uint256 eliteAgents
) = sckNFT.getPlatformStats();
```

## 🔐 Security & Roles

### Access Control Roles

- **DEFAULT_ADMIN_ROLE**: Full contract administration
- **SIGNAL_UPDATER_ROLE**: Can process trust signals
- **ACHIEVEMENT_MINTER_ROLE**: Can mint achievements

### Security Features

- **Role-based permissions** for sensitive operations
- **Input validation** for all parameters
- **Soulbound token enforcement** to prevent transfers
- **Emergency deactivation** for problematic agents
- **Trust score bounds** (0-1000 range)

## 🧪 Testing

Comprehensive test suite covering:

- ✅ Role agent minting with various trust scores
- ✅ Trust signal processing and batch operations
- ✅ Achievement minting and soulbound enforcement
- ✅ Transfer restrictions for soulbound tokens
- ✅ Platform statistics and analytics
- ✅ Dynamic metadata generation
- ✅ Access control and security features
- ✅ Edge cases and error conditions

Run tests:
```bash
npm run test                    # Run all tests
npm run test:coverage          # Run with coverage
npm run gas-report             # Gas usage analysis
npm run size                   # Contract size analysis
```

## 🌐 Deployment

### Sepolia Testnet Deployment

```bash
npm run deploy:sepolia
```

The deployment script will:
1. Deploy the SCKDynamicNFT contract
2. Verify deployment and roles
3. Test basic functionality
4. Output contract address and environment variables
5. Display Etherscan verification link

### Environment Variables for Frontend

After deployment, add to your frontend `.env`:

```env
NEXT_PUBLIC_SCK_NFT_ADDRESS=0x...deployed_contract_address
NEXT_PUBLIC_SCK_NFT_NETWORK=sepolia
NEXT_PUBLIC_SCK_NFT_CHAIN_ID=11155111
```

## 🔗 Frontend Integration

The contract integrates with the frontend through:

1. **SCKDynamicNFTService** (`apps/web/lib/sck-dynamic-nft-service.ts`)
2. **Updated NFT minting component** (`apps/web/components/nft-minting.tsx`)
3. **Real-time trust score updates** via trust signal APIs
4. **Dynamic metadata** that updates automatically

## 📈 Gas Optimization

The contract is optimized for gas efficiency:

- **Packed structs** to minimize storage slots
- **Batch operations** for multiple signals
- **Efficient mappings** for quick lookups
- **Optimized compiler settings** with IR enabled
- **Gas limit buffers** (20%) for reliable transactions

## 🚨 Important Notes

1. **Trust Score Range**: 0-1000 (inclusive)
2. **Achievement Eligibility**: Requires ≥750 trust score
3. **Soulbound Tokens**: Cannot be transferred once marked
4. **Signal Impact**: Limited to ±100 per signal
5. **DID Uniqueness**: Each DID can only mint one role agent

## 📝 Contract Verification

After deployment, verify on Etherscan:

```bash
npm run verify:sepolia -- DEPLOYED_CONTRACT_ADDRESS "SCK Role Agents" "SCKRA" "https://api.securecodeknight.com/metadata/" "https://api.securecodeknight.com/contract-metadata.json"
```

## 🎯 Next Steps

1. **Deploy to Sepolia**: Test the contract on testnet
2. **Frontend Integration**: Connect with the SCK platform
3. **Signal Processing**: Implement automated trust signal processing
4. **Achievement System**: Create achievement templates and rules
5. **Mainnet Deployment**: Deploy to Ethereum mainnet when ready

---

**Contract Address (Sepolia)**: `TBD after deployment`  
**Etherscan**: `https://sepolia.etherscan.io/address/CONTRACT_ADDRESS`  
**OpenSea**: `https://testnets.opensea.io/collection/sck-role-agents` 