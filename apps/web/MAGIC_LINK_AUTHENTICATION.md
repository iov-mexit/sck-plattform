# Magic Link Authentication System

## 🎯 Overview

The SCK platform now uses **Magic Link** for email-based SaaS authentication with optional wallet connection. This provides a seamless user experience where users can:

1. **Login with Email**: No passwords required
2. **Optional Wallet Connection**: Connect wallet only when needed (NFT minting, transactions)
3. **System-wide Authentication**: Email-based auth across the entire platform

## 🏗️ Architecture

### **Authentication Flow**

```
User enters email → Magic Link sent → User clicks link → Authenticated → Optional wallet connection
```

### **Key Components**

1. **Magic Link Authentication**: Primary authentication method
2. **Optional Wallet Connection**: Secondary for blockchain features
3. **Session Management**: Secure session handling
4. **User State Management**: Combined auth + wallet state

## 📦 Dependencies

```json
{
  "@magic-sdk/admin": "^2.0.0",
  "@magic-sdk/pnp": "^2.0.0",
  "next-auth": "^4.0.0",
  "@auth/prisma-adapter": "^1.0.0"
}
```

## 🔧 Configuration

### **Environment Variables**

```bash
# Magic Link Configuration
NEXT_PUBLIC_MAGIC_API_KEY=your_magic_link_api_key

# Optional: Web3 Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

### **Magic Link Setup**

1. **Get API Key**: Sign up at [magic.link](https://magic.link)
2. **Configure Network**: Set RPC URL for your preferred network
3. **Customize UI**: Configure branding and email templates

## 🚀 Implementation

### **1. Auth Context Provider**

```typescript
// lib/auth/auth-context.tsx
export function AuthProvider({ children }) {
  // Magic Link state
  const [magicAuth, setMagicAuth] = useState<MagicAuthState>({...});
  
  // Wallet connection state
  const [walletConnection, setWalletConnection] = useState<WalletConnectionState>({...});
  
  // Combined authentication
  const isAuthenticated = magicAuth.isLoggedIn;
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

### **2. Magic Login Component**

```typescript
// components/auth/magic-login.tsx
export function MagicLogin() {
  const { loginWithMagic } = useAuth();
  
  const handleSubmit = async (email: string) => {
    await loginWithMagic(email);
    // Magic Link sent to email
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="your@email.com" />
      <button>Send Magic Link</button>
    </form>
  );
}
```

### **3. Optional Wallet Connection**

```typescript
// components/auth/optional-wallet-connect.tsx
export function OptionalWalletConnect() {
  const { connectWallet, walletConnection } = useAuth();
  
  // Only show if user is authenticated
  if (!isAuthenticated) return null;
  
  return (
    <button onClick={connectWallet}>
      Connect MetaMask (Optional)
    </button>
  );
}
```

## 🎨 User Experience

### **Login Flow**

1. **User visits platform** → Sees Magic Link login form
2. **Enters email** → Magic Link sent to email
3. **Clicks link** → Automatically authenticated
4. **Optional wallet** → Can connect wallet for blockchain features

### **Authentication States**

```typescript
// Not authenticated
{ isAuthenticated: false, user: null }

// Authenticated without wallet
{ isAuthenticated: true, user: { email: "user@example.com" } }

// Authenticated with wallet
{ 
  isAuthenticated: true, 
  user: { email: "user@example.com" },
  walletConnection: { isConnected: true, address: "0x..." }
}
```

## 🔒 Security Features

### **Magic Link Security**

- **Time-limited links**: Links expire after 15 minutes
- **One-time use**: Each link can only be used once
- **Email verification**: Only verified email addresses can login
- **No password storage**: Eliminates password-related security risks

### **Wallet Connection Security**

- **Optional by design**: Users can use platform without wallet
- **Secure connection**: Uses wagmi for secure wallet interactions
- **Network validation**: Ensures correct network connection
- **Error handling**: Graceful handling of connection failures

## 📱 Component Usage

### **Main Page Integration**

```typescript
// app/page.tsx
export default function HomePage() {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div>
      {!isAuthenticated ? (
        <MagicLogin />
      ) : (
        <>
          <UserProfile user={user} />
          <OptionalWalletConnect />
          <PlatformFeatures />
        </>
      )}
    </div>
  );
}
```

### **Protected Routes**

```typescript
// components/auth/protected-route.tsx
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <RedirectToLogin />;
  
  return children;
}
```

## 🧪 Testing

### **Magic Link Testing**

```typescript
// Test Magic Link login
const testMagicLogin = async () => {
  const { loginWithMagic } = useAuth();
  
  try {
    await loginWithMagic('test@example.com');
    // Check email for magic link
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### **Wallet Connection Testing**

```typescript
// Test wallet connection
const testWalletConnection = async () => {
  const { connectWallet, walletConnection } = useAuth();
  
  try {
    await connectWallet();
    console.log('Wallet connected:', walletConnection.address);
  } catch (error) {
    console.error('Wallet connection failed:', error);
  }
};
```

## 🔧 Development Setup

### **1. Install Dependencies**

```bash
npm install @magic-sdk/admin @magic-sdk/pnp next-auth @auth/prisma-adapter
```

### **2. Configure Environment**

```bash
# Copy template
cp env.template .env.local

# Add Magic Link API key
NEXT_PUBLIC_MAGIC_API_KEY=pk_live_A9411297CC00BA0D


### **3. Start Development**

```bash
npm run dev
```

## 🚀 Production Deployment

### **1. Magic Link Configuration**

1. **Create Magic Link account** at [magic.link](https://magic.link)
2. **Get API key** from dashboard
3. **Configure network** (Ethereum mainnet, Sepolia testnet, etc.)
4. **Customize email templates** with your branding

### **2. Environment Variables**

```bash
# Production environment
NEXT_PUBLIC_MAGIC_API_KEY=pk_live_your_production_key
NEXT_PUBLIC_ETHEREUM_MAINNET_RPC=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
```

### **3. Security Considerations**

- **HTTPS required**: Magic Link requires HTTPS in production
- **Domain verification**: Verify your domain in Magic Link dashboard
- **Rate limiting**: Configure appropriate rate limits
- **Error monitoring**: Set up error tracking for auth failures

## 📊 Benefits

### **For Users**

- **No passwords**: Eliminates password management
- **Quick login**: One-click authentication
- **Optional wallet**: Can use platform without crypto knowledge
- **Secure**: Time-limited, one-time use links

### **For Developers**

- **Simplified auth**: No password handling
- **Flexible wallet**: Optional blockchain integration
- **Better UX**: Seamless authentication flow
- **Security**: Reduced attack surface

### **For Business**

- **Lower friction**: Easier user onboarding
- **Broader adoption**: Non-crypto users can participate
- **Scalable**: Magic Link handles infrastructure
- **Compliant**: GDPR and privacy-friendly

## 🔄 Migration from Wallet-Only Auth

### **Before (Wallet-Only)**

```typescript
// Required wallet connection
const { isConnected, address } = useAccount();
if (!isConnected) {
  return <WalletConnect />;
}
```

### **After (Magic Link + Optional Wallet)**

```typescript
// Email-based auth with optional wallet
const { isAuthenticated, walletConnection } = useAuth();
if (!isAuthenticated) {
  return <MagicLogin />;
}
if (!walletConnection.isConnected) {
  return <OptionalWalletConnect />;
}
```

## 🎯 Next Steps

1. **Deploy to production** with Magic Link configuration
2. **Test user flows** with real email addresses
3. **Monitor authentication metrics** and error rates
4. **Optimize email templates** for better conversion
5. **Add additional features** like social login or 2FA

---

**🎉 Magic Link authentication provides a modern, secure, and user-friendly authentication experience for the SCK platform!** 