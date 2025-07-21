# Organizational NFT Flow Documentation

## 🏢 Overview

The SCK platform now supports a sophisticated organizational structure where:

1. **Organizations** manage digital twins
2. **DIDs** represent humans in the organization  
3. **NFTs** represent achievements/scores/certifications attached to twins

## 🔄 User Flow

### 1. Organization Setup
- Organization admin connects wallet
- Creates organization profile
- Gets organization ID for management

### 2. Digital Twin Creation
- Organization selects/create digital twins
- Assigns DIDs to represent humans
- Twins are privacy-preserving (no personal data)

### 3. Achievement NFT Minting
- Organization mints achievement NFTs for twins
- NFTs represent certifications, scores, milestones
- Each NFT is tied to a specific digital twin

## 🏗️ Architecture

### Smart Contract Structure

```solidity
// Organization Management
struct Organization {
    string name;
    string description;
    address admin;
    bool active;
}

// Digital Twin Management  
struct DigitalTwin {
    string name;
    string role;
    string assignedDid;  // DID representing human
    string description;
    uint256 organizationId;
    bool active;
}

// Achievement NFT Management
struct Achievement {
    string title;
    string description;
    uint8 achievementType; // 0: certification, 1: score, 2: milestone
    uint8 score;
    string metadata;
    uint256 twinId;
    uint256 tokenId;
}
```

### Frontend Components

1. **OrganizationDashboard** - Main organizational management interface
2. **DigitalTwinManager** - Create and manage digital twins
3. **AchievementManager** - Mint achievement NFTs
4. **NFTManager** - View and manage NFT collection

## 🎯 Key Features

### Organization Management
- ✅ Create organization profile
- ✅ Manage organization settings
- ✅ View organization statistics
- ✅ Admin wallet connection

### Digital Twin Management
- ✅ Create digital twins with role assignments
- ✅ Assign DIDs to represent humans
- ✅ Privacy-preserving (no personal data stored)
- ✅ Role-based identification system

### Achievement NFT System
- ✅ Mint certification NFTs
- ✅ Mint score-based NFTs  
- ✅ Mint milestone NFTs
- ✅ Metadata support for rich data
- ✅ NFT collection viewing

### Wallet Integration
- ✅ MetaMask connection
- ✅ WalletConnect support
- ✅ Transaction status tracking
- ✅ Error handling

## 🔧 Technical Implementation

### Smart Contract Functions

```typescript
// Organization
createOrganization(name, description) → organizationId
getOrganization(organizationId) → Organization

// Digital Twins
createDigitalTwin(orgId, name, role, did, description) → twinId
getDigitalTwin(twinId) → DigitalTwin

// Achievements
mintAchievement(twinId, title, description, type, score, metadata) → achievementId
getAchievement(achievementId) → Achievement

// Queries
getOrganizationTwins(organizationId) → twinIds[]
getTwinAchievements(twinId) → achievementIds[]
```

### Frontend Integration

```typescript
// Service class for contract interaction
class OrganizationalNFTService {
  async createOrganization(name, description)
  async createDigitalTwin(orgId, name, role, did, description)
  async mintAchievement(twinId, title, description, type, score, metadata)
  async getOrganizationData(organizationId)
}
```

## 🎨 UI Components

### Organization Dashboard
- **Overview Tab**: Statistics and organization info
- **Digital Twins Tab**: Create and manage twins
- **Achievements Tab**: Mint achievement NFTs
- **NFT Management Tab**: View NFT collection

### Key UI Features
- ✅ Real-time wallet connection status
- ✅ Transaction progress indicators
- ✅ Error handling and user feedback
- ✅ Responsive design
- ✅ Dark/light mode support

## 🚀 Testing Scenarios

### 1. Organization Setup
```
1. Connect wallet (MetaMask)
2. Create organization profile
3. Verify organization creation
4. Check admin permissions
```

### 2. Digital Twin Creation
```
1. Navigate to Digital Twins tab
2. Fill in twin details (name, role, DID)
3. Submit creation transaction
4. Verify twin appears in list
```

### 3. Achievement NFT Minting
```
1. Select digital twin
2. Choose achievement type (certification/score/milestone)
3. Fill achievement details
4. Mint NFT transaction
5. Verify NFT appears in collection
```

### 4. NFT Collection Viewing
```
1. Navigate to NFT Management tab
2. View all minted NFTs
3. Filter by achievement type
4. View NFT metadata
```

## 🔒 Privacy & Security

### DID Integration
- **Decentralized Identifiers** represent humans
- **No personal data** stored on-chain
- **Privacy-preserving** twin management
- **Role-based** identification system

### Smart Contract Security
- **Access control** for organization admins
- **Input validation** for all functions
- **Event logging** for transparency
- **Soulbound tokens** for achievements

## 📊 Data Flow

```
Organization Admin
    ↓
Connect Wallet
    ↓
Create Organization
    ↓
Create Digital Twins
    ↓
Assign DIDs to Twins
    ↓
Mint Achievement NFTs
    ↓
View NFT Collection
```

## 🎯 Benefits

### For Organizations
- **Privacy-preserving** employee management
- **Achievement tracking** via NFTs
- **Decentralized** identity management
- **Transparent** credential verification

### For Individuals
- **Self-sovereign** identity via DIDs
- **Portable** achievements as NFTs
- **Privacy** through DID-based identification
- **Verifiable** credentials

### For the Platform
- **Scalable** organizational structure
- **Interoperable** with existing systems
- **Compliant** with privacy regulations
- **Future-proof** architecture

## 🔮 Future Enhancements

### Planned Features
- **Multi-organization** support
- **Achievement templates** for common certifications
- **NFT marketplace** for achievement trading
- **Integration** with external credential providers
- **Advanced analytics** for organization insights

### Technical Improvements
- **Gas optimization** for batch operations
- **IPFS integration** for metadata storage
- **Cross-chain** NFT support
- **Mobile wallet** integration

## 📝 Configuration

### Environment Variables
```bash
# Contract Addresses
NEXT_PUBLIC_ORGANIZATIONAL_NFT_ADDRESS="0x..."
NEXT_PUBLIC_SCK_NFT_ADDRESS="0x..."
NEXT_PUBLIC_SCK_NFT_DYNAMIC_ADDRESS="0x..."

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your-project-id"

# Network Configuration
NEXT_PUBLIC_CHAIN_ID="11155111" # Sepolia
NEXT_PUBLIC_RPC_URL="https://sepolia.infura.io/v3/..."

# Feature Flags
NEXT_PUBLIC_ENABLE_NFT_MINTING="true"
NEXT_PUBLIC_ENABLE_ORGANIZATIONAL_FEATURES="true"
```

## 🎯 Getting Started

1. **Deploy Smart Contracts** to testnet
2. **Update Environment Variables** with contract addresses
3. **Connect Wallet** to test organization creation
4. **Create Digital Twins** with DID assignments
5. **Mint Achievement NFTs** for testing
6. **Verify NFT Collection** in management interface

The organizational NFT flow provides a comprehensive solution for privacy-preserving achievement management with full blockchain integration and user-friendly interfaces. 