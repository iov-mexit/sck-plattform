# 🧪 Frontend Testing Guide

## Overview

This guide provides comprehensive testing instructions for the SCK (Secure Code KnAIght) platform frontend components, focusing on role agent management, NFT minting, and trust system validation.

## Features to Test

- **NFT Minting Interface**: Mint Role Agents and Achievements
- **Role Templates**: Browse and select from 35+ security-focused roles
- **Organization Dashboard**: View role agent statistics and trust metrics
- **Authentication**: Magic Link login and wallet connectivity
- **Trust Score System**: Real-time trust validation and scoring

## Prerequisites

1. **Development Environment**
   - Next.js development server running (`npm run dev`)
   - PostgreSQL database with seeded data
   - MetaMask wallet with Sepolia testnet ETH

2. **Test Accounts**
   - Valid email for Magic Link authentication
   - MetaMask wallet connected to Sepolia testnet
   - Test organization domain configured

3. **Environment Variables**
   - Magic Link keys configured
   - Blockchain contract addresses set
   - Database connection established

## Testing Scenarios

### Authentication Flow

1. **Magic Link Login**
   - Navigate to `/` (homepage)
   - Enter email address in login form
   - Check email for Magic Link
   - Click link to authenticate
   - Verify redirect to dashboard

2. **Organization Setup**
   - Complete organization onboarding
   - Set company name and domain
   - Verify organization creation in database

### Role Agent Management

1. **Create Role Agent**
   - Navigate to `/role-agents`
   - Click "Create Role Agent"
   - Select role template from library
   - Enter DID and basic information
   - Set initial trust score
   - Submit and verify creation

2. **Manage Existing Agents**
   - View role agent list
   - Edit agent details
   - Update trust scores
   - Toggle NFT eligibility
   - Delete agents if needed

### NFT Minting Testing

#### Setup Requirements
- MetaMask installed and configured
- Sepolia testnet selected
- Contract deployed and address configured
- Sufficient test ETH for gas fees

#### Test Data
- Select "Role Agent NFT" or "Achievement NFT"
- Choose eligible role agent (trust score ≥ 750)
- Verify wallet connection
- Confirm transaction details
- Monitor blockchain confirmation

### Scenario 1: Role Agent NFT Minting

**Steps:**
1. Navigate to `/nft-minting`
2. Select "Role Agent NFT"
3. Choose role agent from dropdown
4. Connect MetaMask wallet
4. Click "Mint Role Agent"
5. Confirm transaction in MetaMask
6. Wait for blockchain confirmation
7. Verify NFT appears in wallet

**Expected Results:**
- Transaction completes successfully
- NFT metadata displays correctly
- Trust score reflected in token
- Database updated with transaction
- OpenSea shows new token

### Scenario 2: Achievement NFT Minting

**Steps:**
1. Select existing role agent
2. Choose achievement type
3. Enter achievement details
4. Set soulbound status
5. Mint achievement NFT
6. Verify achievement attribution

### Trust Score Validation

1. **Score Calculation**
   - Add trust signals to role agent
   - Verify automatic score updates
   - Test eligibility threshold (≥750)
   - Validate score ranges (0-1000)

2. **Real-Time Updates**
   - Monitor dashboard metrics
   - Verify live score changes
   - Test batch signal processing
   - Validate trust level badges

### Error Handling

1. **Network Issues**
   - Test with poor connectivity
   - Verify error messages
   - Test retry mechanisms
   - Validate graceful degradation

2. **Wallet Integration**
   - Test without MetaMask
   - Wrong network selection
   - Insufficient gas fees
   - Transaction rejection

3. **Data Validation**
   - Invalid DID formats
   - Out-of-range trust scores
   - Missing required fields
   - Duplicate role assignments

## Browser Compatibility

Test across multiple browsers:
- Chrome (recommended for MetaMask)
- Firefox
- Safari (limited MetaMask support)
- Edge

## Mobile Testing

1. **Responsive Design**
   - Test on various screen sizes
   - Verify component layouts
   - Check navigation usability

2. **Wallet Integration**
   - Test mobile wallet apps
   - Verify WalletConnect functionality
   - Check QR code scanning

## Performance Testing

1. **Page Load Times**
   - Monitor initial load performance
   - Test with large datasets
   - Verify lazy loading
   - Check bundle sizes

2. **Database Queries**
   - Monitor API response times
   - Test with many role agents
   - Verify pagination
   - Check query optimization

## Security Testing

1. **Authentication**
   - Test session management
   - Verify logout functionality
   - Check token expiration
   - Test unauthorized access

2. **Data Protection**
   - Verify DID-only storage
   - Test organization isolation
   - Check API access controls
   - Validate input sanitization

## Checklist

### Core Functionality
- [ ] Magic Link authentication works
- [ ] Organization onboarding complete
- [ ] Role agent creation functional
- [ ] Role template library accessible
- [ ] Trust score system operational
- [ ] NFT minting successful
- [ ] Dashboard displays correctly

### Integration Testing
- [ ] MetaMask connectivity works
- [ ] Blockchain transactions confirm
- [ ] Database updates properly
- [ ] Real-time updates functional
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness

### Error Scenarios
- [ ] Network failure handling
- [ ] Invalid input validation
- [ ] Transaction failure recovery
- [ ] Role agent minting form validation
- [ ] Trust score boundary testing
- [ ] Insufficient gas handling

### Performance
- [ ] Page load under 3 seconds
- [ ] API responses under 500ms
- [ ] Large dataset handling
- [ ] Memory usage reasonable

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. MetaMask version
3. Steps to reproduce
4. Expected vs actual behavior
5. Console error messages
6. Network requests (if relevant)
7. Screenshots or screen recordings

## Test Data Reset

To reset test data:
```bash
# Reset role agent minting status
curl -X POST "http://localhost:3000/api/v1/nft/reset"

# Reset database to initial state
npx prisma migrate reset
npx prisma db seed
```

---

**Note**: This testing guide covers the current role agent-based system. For legacy digital twin references, please update to role agent terminology. 