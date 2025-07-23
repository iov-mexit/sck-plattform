# Archived Smart Contracts

This directory contains archived smart contracts that are no longer actively used in the current system.

## SCKNFTDynamic.sol

**Archived Date**: December 2024  
**Original Location**: `packages/contracts/backend/SCKNFTDynamic.sol`  
**Archive Reason**: Contract superseded by newer implementation

### Contract Overview

The SCKNFTDynamic contract was an enhanced ERC721 implementation for the Secure Code KnAIght Digital Twin & Dynamic Achievement System. It featured:

- **Digital Twin Management**: Minting and updating digital twin NFTs
- **Dynamic Achievements**: Achievement system with metadata updates
- **Soulbound Tokens**: Non-transferable tokens for certain achievements
- **Achievement Templates**: Template-based achievement creation
- **Audit Trail**: Complete history of achievement updates

### Key Features

1. **Digital Twin Structure**:
   - Decentralized Identifier (DID)
   - Role assignment (Developer, Security Expert, etc.)
   - Organization association
   - Creation and update timestamps

2. **Achievement System**:
   - Dynamic achievement updates
   - Soulbound achievement support
   - Version tracking
   - Metadata customization

3. **Template System**:
   - Predefined achievement templates
   - Threshold-based achievement criteria
   - Customizable metadata

4. **Security Features**:
   - Owner-only minting and updates
   - Soulbound token protection
   - Comprehensive audit trail

### Technical Specifications

- **Solidity Version**: ^0.8.20
- **OpenZeppelin Dependencies**: ERC721, Ownable, Strings
- **License**: MIT
- **Token Standard**: ERC721

### Migration Notes

If you need to reference this contract for migration purposes:

1. **State Variables**: All mappings and arrays are preserved
2. **Events**: Event signatures remain compatible
3. **Functions**: Core functionality can be migrated to new contracts
4. **Metadata**: Token URI structure is maintained

### Accessing Archived Contract

The contract can still be accessed for reference or migration purposes:

```bash
# View the archived contract
cat packages/contracts/backend/archive/SCKNFTDynamic.sol

# Copy to working directory if needed
cp packages/contracts/backend/archive/SCKNFTDynamic.sol ./working-directory/
```

---

**Note**: This contract is archived and should not be used in production. Refer to current contract implementations for active development. 