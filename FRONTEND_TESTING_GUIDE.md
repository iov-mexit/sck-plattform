# Frontend NFT Testing Guide

## 🎯 **What's Ready for Testing**

We've successfully implemented the frontend NFT system with the following components:

### ✅ **Implemented Components**
- **Wallet Connection**: Connect MetaMask, WalletConnect, etc.
- **NFT Minting Interface**: Mint Digital Twins and Achievements
- **Blockchain Integration**: Wagmi + Viem setup
- **TypeScript Support**: Full type safety
- **UI Components**: Beautiful, responsive interface

### ✅ **Dependencies Added**
```json
{
  "ethers": "^6.8.1",
  "wagmi": "^2.5.7", 
  "viem": "^2.7.9",
  "@tanstack/react-query": "^5.17.9"
}
```

## 🚀 **How to Start Testing**

### Step 1: Install Dependencies
```bash
cd apps/web
npm install
```

### Step 2: Set Up Environment
```bash
# Copy environment template
cp env.template .env.local

# Edit .env.local and add:
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Test NFT Features
1. **Navigate to NFT System Tab**
   - Go to http://localhost:3000
   - Click on "NFT System" tab

2. **Connect Wallet**
   - Click "Connect Wallet"
   - Choose MetaMask or WalletConnect
   - Approve connection

3. **Test NFT Minting**
   - Select "Digital Twin NFT" or "Achievement NFT"
   - Fill in the form
   - Click "Mint" button
   - Watch the transaction

## 🧪 **Testing Scenarios**

### Scenario 1: Digital Twin NFT Minting
```
1. Connect wallet
2. Select "Digital Twin NFT"
3. Fill in:
   - DID: did:sck:123456789
   - Role: Security Engineer
   - Organization: SecureCorp
4. Click "Mint Digital Twin"
5. Verify success message
```

### Scenario 2: Achievement NFT Minting
```
1. Connect wallet
2. Select "Achievement NFT"
3. Fill in:
   - Token ID: 0 (or existing token)
   - Achievement Type: Certification
   - Title: Security Expert Certification
   - Metadata: {"score": 95, "provider": "SecureCodeWarrior"}
   - Check "Soulbound"
4. Click "Mint Achievement"
5. Verify success message
```

### Scenario 3: Wallet Connection
```
1. Click "Connect Wallet"
2. Test different connectors:
   - MetaMask
   - WalletConnect
   - Other injected wallets
3. Verify connection status
4. Test disconnect functionality
```

## 🔧 **Current Implementation Status**

### ✅ **What Works Now**
- **Mock NFT Minting**: Simulated minting with realistic delays
- **Wallet Connection**: Full wagmi integration
- **UI Components**: Complete minting interface
- **Type Safety**: Full TypeScript support
- **Error Handling**: Graceful error messages

### 🔄 **What's Mocked (For Testing)**
- **Contract Calls**: Currently using mock transactions
- **Gas Estimation**: Simulated gas costs
- **Transaction Confirmation**: Mock confirmation delays
- **Token IDs**: Random generation for testing

### 🚧 **What Needs Real Contract**
- **Actual Minting**: Connect to deployed SCK NFT contract
- **Real Transactions**: Actual blockchain transactions
- **Gas Costs**: Real gas estimation
- **Token Verification**: Verify minted tokens on blockchain

## 📊 **Testing Checklist**

### Wallet Connection
- [ ] MetaMask connection works
- [ ] WalletConnect connection works
- [ ] Disconnect functionality works
- [ ] Error handling for failed connections
- [ ] Network switching works

### NFT Minting
- [ ] Digital Twin minting form validation
- [ ] Achievement minting form validation
- [ ] Soulbound checkbox functionality
- [ ] Metadata JSON validation
- [ ] Success/error message display
- [ ] Loading states during minting

### UI/UX
- [ ] Responsive design on mobile
- [ ] Dark mode compatibility
- [ ] Accessibility features
- [ ] Form validation messages
- [ ] Loading indicators

## 🎯 **Next Steps for Production**

### 1. Deploy Contracts
```bash
cd packages/contracts/backend
npm run deploy:sepolia
```

### 2. Update Environment Variables
```bash
# Add contract addresses to .env.local
NEXT_PUBLIC_SCK_NFT_ADDRESS=0x... # Deployed contract address
NEXT_PUBLIC_SCK_NFT_DYNAMIC_ADDRESS=0x... # Deployed dynamic contract address
```

### 3. Connect Real Contracts
- Replace mock minting with real contract calls
- Add real gas estimation
- Implement transaction confirmation
- Add token verification

### 4. Add Advanced Features
- Achievement management interface
- NFT metadata viewer
- Transaction history
- Gas optimization

## 🐛 **Common Issues & Solutions**

### Issue: Wallet Not Connecting
**Solution**: 
- Check if MetaMask is installed
- Ensure you're on the correct network (Sepolia for testing)
- Clear browser cache and try again

### Issue: Transaction Failing
**Solution**:
- Ensure you have enough ETH for gas
- Check network connection
- Verify contract is deployed

### Issue: Form Validation Errors
**Solution**:
- Check all required fields are filled
- Ensure DID format is correct
- Verify JSON metadata format

## 📈 **Performance Testing**

### Load Testing
- Test with multiple wallet connections
- Verify UI responsiveness during minting
- Check memory usage with multiple transactions

### Network Testing
- Test on different networks (Sepolia, Mainnet)
- Verify gas estimation accuracy
- Test transaction confirmation times

## 🎉 **Ready for Demo**

The frontend is now **ready for demonstration** with:

- ✅ **Complete UI**: Beautiful, responsive interface
- ✅ **Wallet Integration**: Full blockchain connectivity
- ✅ **Mock Functionality**: Realistic NFT minting simulation
- ✅ **Error Handling**: Graceful error management
- ✅ **Type Safety**: Full TypeScript support

You can now show stakeholders a working NFT minting interface that demonstrates the complete SCK platform vision!

---

**Status**: ✅ **FRONTEND READY FOR TESTING**  
**Next**: Deploy contracts and connect real blockchain functionality 