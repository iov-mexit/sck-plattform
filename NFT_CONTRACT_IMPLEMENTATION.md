# 🎯 SCK NFT Contract Implementation

## Overview

We successfully implemented a **single, unified NFT contract system** for the SCK (Secure Code KnAIght) platform that handles both role agents and achievements in one contract.

## Contract Architecture

### 🏗️ Unified Contract Design

- **Contract Name**: `SCKDynamicNFT`
- **Token Standard**: ERC-721 
- **Purpose**: Role agent NFTs with achievement tracking
- **Network**: Sepolia Testnet (for development)

#### 1. Role Agent Management
```solidity
struct RoleAgent {
    string did;                      // Decentralized Identifier
    string name;                     // Agent name
    string role;                     // Role category (e.g., "Security Engineer")
    string organization;             // Organization name
    uint256 trustScore;              // Trust score (0-1000)
    TrustLevel trustLevel;           // Derived from trust score
    uint256 createdAt;              // Creation timestamp
    uint256 lastUpdated;            // Last update timestamp
    bool isActive;                  // Active status
    bool isEligibleForAchievements; // Can mint achievements
    uint256 totalSignals;           // Number of trust signals
    uint256 achievementCount;       // Number of achievements earned
}
```

#### 2. Achievement System
```solidity
struct Achievement {
    string achievementType;          // Category
    string title;                   // Achievement title
    string description;             // Description
    string metadata;                // JSON metadata
    uint256 trustScoreAtEarning;    // Trust score when earned
    uint256 earnedAt;              // Timestamp
    bool isSoulbound;              // Cannot be transferred
    string imageURI;               // Achievement image
}
```

#### 3. Trust Signal Processing
```solidity
struct TrustSignal {
    SignalType signalType;          // Signal category
    int256 scoreImpact;            // Score change (-100 to +100)
    string source;                 // Signal source
    string metadata;               // Additional data
    uint256 timestamp;             // When recorded
    address reporter;              // Who reported
    bool isVerified;               // Verification status
}
```

## 📋 Function Reference

### Core Functions

| Function | Description | Access Level |
|----------|-------------|--------------|
| `mintRoleAgent()` | Mint new role agent NFT | Owner only |
| `mintAchievement()` | Mint achievement for role agent | Owner only |
| `processTrustSignal()` | Update trust score | Signal updater |
| `batchProcessSignals()` | Process multiple signals | Signal updater |
| `updateRoleAgentData()` | Update agent information | Owner only |
| `deactivateRoleAgent()` | Deactivate role agent | Owner only |

### Query Functions

| Function | Description |
|----------|-------------|
| `getRoleAgentData()` | Get role agent information |
| `getAchievement()` | Get achievement details |
| `getTrustSignals()` | Get all signals for agent |
| `getPlatformStats()` | Get platform-wide statistics |
| `isEligibleForAchievements()` | Check achievement eligibility |
| `totalRoleAgents()` | Get total number of role agents |

### Role Agent Metadata

```json
{
  "name": "SCK Role Agent #1",
  "description": "Security Engineer at SecureCorp",
  "image": "https://api.securecodeknight.com/images/role-agent/1.png",
  "attributes": [
    {
      "trait_type": "Role",
      "value": "Security Engineer"
    },
    {
      "trait_type": "Organization", 
      "value": "SecureCorp"
    },
    {
      "trait_type": "Trust Score",
      "value": 850
    },
    {
      "trait_type": "Trust Level",
      "value": "Highly Trusted"
    },
    {
      "trait_type": "Active",
      "value": "Yes"
    },
    {
      "trait_type": "Achievements",
      "value": 3
    }
  ],
  "properties": {
    "did": "did:ethr:0x123...",
    "created_at": "2024-01-15T10:30:00Z",
    "last_updated": "2024-01-20T14:45:00Z",
    "total_signals": 42,
    "eligible_for_achievements": true
  }
}
```

## 🚀 Deployment Information

### Contract Addresses
- **Sepolia Testnet**: `0x741619748382c07566BefCC986d8fBbB8EC7168e`
- **Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0x741619748382c07566BefCC986d8fBbB8EC7168e)

### Deployment Configuration
```javascript
module.exports = {
  name: "SCK Role Agents",
  symbol: "SCKRA", 
  baseTokenURI: "https://api.securecodeknight.com/metadata/",
  contractURI: "https://api.securecodeknight.com/contract-metadata.json"
};
```

## 🔐 Security Features

### Access Control

- Only contract owner can mint role agents and achievements
- Signal updater role can process trust signals
- Owner can deactivate role agents
- Soulbound achievements cannot be transferred

### Trust System

1. **Trust Levels** (based on score 0-1000):
   - `UNVERIFIED` (0-249)
   - `BASIC` (250-499) 
   - `TRUSTED` (500-749)
   - `HIGHLY_TRUSTED` (750-899)
   - `ELITE` (900-1000)

2. **Achievement Eligibility**: Requires trust score ≥ 750

3. **Signal Types**:
   - Security Audit
   - Code Review
   - Vulnerability Found
   - Certification Earned
   - Peer Validation
   - Performance Metric
   - Training Completed

## 🎮 Usage Examples

### Mint Role Agent
```solidity
uint256 tokenId = sckNFT.mintRoleAgent(
    userAddress,
    "did:ethr:0x123...",
    "Alice Security Expert", 
    "Security Engineer",
    "SecureCorp",
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

## 📊 Cross-Chain Support

### Phase 1: Single Chain (Current)
- ✅ Role agent identity management
- ✅ Achievement tracking
- ✅ Trust score updates
- ✅ Soulbound tokens

### Phase 2: Multi-Chain (Planned)
- 🔄 Cross-chain role agent verification
- 🔄 Universal achievement recognition
- 🔄 Trust score synchronization
- 🔄 Cross-chain governance

## 🧪 Testing

### Contract Tests
```bash
cd packages/contracts/backend
npm run test
```

### Frontend Integration Tests
```bash
cd apps/web
npm run test:integration
```

## 📈 Platform Statistics

The contract provides comprehensive analytics:

```solidity
function getPlatformStats() external view returns (
    uint256 totalAgents,
    uint256 totalSignals, 
    uint256 totalAchievements,
    uint256 eligibleAgents,
    uint256 unverifiedAgents,
    uint256 basicAgents,
    uint256 trustedAgents,
    uint256 highlyTrustedAgents,
    uint256 eliteAgents
);
```

## 🔧 Integration Points

### Frontend Integration
- `apps/web/lib/sck-dynamic-nft-service.ts` - Service layer
- `apps/web/components/nft-minting.tsx` - UI component
- `apps/web/app/api/v1/nft/mint/route.ts` - API endpoint

### Database Integration
- Role agent data stored in PostgreSQL
- Blockchain transactions tracked
- Trust signals logged and processed
- Achievement records maintained

## 🎯 Next Steps

1. **Enhanced Trust Scoring**: Machine learning-based trust calculation
2. **External Integrations**: GitHub, LinkedIn verification
3. **Achievement Templates**: Predefined achievement categories
4. **Cross-Chain**: Multi-chain role agent support
5. **DAO Governance**: Community-driven role template approval

---

**Contract Status**: ✅ **DEPLOYED AND FUNCTIONAL**  
**Network**: Sepolia Testnet  
**Integration**: Complete with SCK platform 