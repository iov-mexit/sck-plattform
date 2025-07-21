# MetaMask Testing Guide

## 🦊 MetaMask-Only Wallet Connection

The SCK platform now uses **MetaMask only** for wallet connection to keep complexity minimal and ensure reliable testing.

## 📋 Prerequisites

### 1. Install MetaMask Extension
- Go to [metamask.io](https://metamask.io)
- Install the browser extension for your browser (Chrome, Firefox, Edge, etc.)
- Create a new wallet or import existing one

### 2. Set Up Test Network
- Open MetaMask
- Add Sepolia testnet:
  - Network Name: `Sepolia`
  - RPC URL: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
  - Chain ID: `11155111`
  - Currency Symbol: `ETH`

### 3. Get Test ETH
- Visit [sepoliafaucet.com](https://sepoliafaucet.com)
- Request test ETH for your wallet address

## 🧪 Testing Steps

### Step 1: Access the Application
1. Open your browser and go to `http://localhost:3000`
2. Navigate to the **NFT System** tab
3. You should see the "MetaMask Connection" card

### Step 2: Test MetaMask Detection
**Scenario A: MetaMask Not Installed**
- If MetaMask is not installed, you'll see:
  ```
  ⚠️ MetaMask not detected. Please install the MetaMask browser extension.
  ```

**Scenario B: MetaMask Installed but Locked**
- If MetaMask is installed but locked, you'll see:
  ```
  ⚠️ MetaMask is not ready. Please unlock MetaMask and try again.
  ```

**Scenario C: MetaMask Ready**
- If MetaMask is installed and unlocked, you'll see:
  ```
  Connect MetaMask
  ```

### Step 3: Connect MetaMask
1. Click "Connect MetaMask"
2. MetaMask popup should appear
3. Click "Connect" in the popup
4. You should see:
   ```
   ✅ Connected
   MetaMask Address: 0x1234...5678
   ```

### Step 4: Test Disconnection
1. Click "Disconnect MetaMask"
2. You should return to the disconnected state

### Step 5: Test NFT Minting
1. Once connected, go to the NFT minting section
2. Fill in the form fields
3. Click "Mint Digital Twin NFT"
4. You should see a mock success message

## 🔍 Debug Information

### Console Logs
Open browser developer tools (F12) and check the Console tab for:
- Available connectors
- Connection status
- MetaMask connection attempts
- Error messages

### Expected Console Output
```
Available connectors: [{ name: "MetaMask", ready: true }]
Connection status: { isConnected: false, address: undefined }
MetaMask connected successfully
Connection status: { isConnected: true, address: "0x1234..." }
```

## 🚨 Common Issues

### Issue 1: "MetaMask not detected"
**Solution:** Install MetaMask browser extension

### Issue 2: "MetaMask is not ready"
**Solution:** Unlock MetaMask by entering your password

### Issue 3: Connection fails
**Solutions:**
- Make sure MetaMask is unlocked
- Check if you're on the correct network (Sepolia)
- Try refreshing the page
- Check browser console for error details

### Issue 4: No popup appears
**Solutions:**
- Check if popup blocker is enabled
- Allow popups for localhost:3000
- Try clicking the button again

## 🎯 Testing Checklist

- [ ] MetaMask extension is installed
- [ ] MetaMask is unlocked
- [ ] Connected to Sepolia testnet
- [ ] Application loads at localhost:3000
- [ ] MetaMask connection button appears
- [ ] Connection popup appears
- [ ] Wallet connects successfully
- [ ] Address displays correctly
- [ ] Disconnect works
- [ ] NFT minting works (mock)
- [ ] Console logs show proper status

## 🔧 Development Notes

### Simplified Configuration
- **Only MetaMask** connector is used
- **No WalletConnect** to reduce complexity
- **Better error handling** for common issues
- **Clear user feedback** for connection status

### Technical Details
- Uses `injected()` connector from wagmi
- Supports Mainnet and Sepolia networks
- Includes proper error handling and user feedback
- Console logging for debugging

## 🚀 Next Steps

Once MetaMask connection is working:
1. **Deploy Smart Contracts** to Sepolia testnet
2. **Update Contract Addresses** in environment variables
3. **Test Real Transactions** with actual gas fees
4. **Add More Features** like transaction history

The simplified MetaMask-only approach should provide a much more reliable and testable wallet connection experience! 