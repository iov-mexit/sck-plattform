# Magic Link Authentication Implementation

## Overview

This implementation uses the **official Magic SDK** (`magic-sdk`) for secure, passwordless authentication with optional wallet connection. The system provides a seamless SaaS experience with email-based login and optional blockchain wallet integration.

## Key Features

### ✅ Official Magic SDK
- Uses `magic-sdk` instead of deprecated PnP version
- Email OTP authentication (`loginWithEmailOTP`)
- OAuth extension support for social logins
- Comprehensive error handling with specific error codes

### ✅ Enhanced User Experience
- Real-time toast notifications for all actions
- Loading states and proper error feedback
- Email validation with regex pattern
- Responsive UI with modern design

### ✅ Optional Wallet Connection
- Deferred wallet connection (not required for login)
- MetaMask and other wallet support via Wagmi
- Network detection and chain ID display
- Graceful error handling for wallet operations

### ✅ Security Features
- Secure session management
- Automatic token refresh
- Rate limiting protection
- Network validation

## Architecture

```
apps/web/
├── lib/
│   ├── auth/
│   │   ├── auth-context.tsx      # Main auth provider
│   │   ├── auth-types.ts         # TypeScript types
│   │   └── magic-config.ts       # Magic SDK configuration
│   └── utils/
│       └── toast.ts              # Toast notifications
├── components/
│   └── auth/
│       └── magic-link-login.tsx  # UI components
└── app/
    └── page.tsx                  # Main page with auth
```

## Configuration

### Environment Variables

```bash
# Magic Link Configuration
NEXT_PUBLIC_MAGIC_API_KEY=pk_live_YOUR_MAGIC_API_KEY

# Network Configuration
NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Feature Flags
NEXT_PUBLIC_ENABLE_MAGIC_LINK=true
NEXT_PUBLIC_ENABLE_WALLET_CONNECTION=true
```

### Magic SDK Setup

1. **Get API Key**: Visit [https://magic.link](https://magic.link) and create an account
2. **Configure Network**: Set up your preferred blockchain network
3. **Customize UI**: Modify the Magic Link configuration in `magic-config.ts`

## Usage

### Basic Authentication Flow

```typescript
import { useAuth } from '@/lib/auth/auth-context';

function MyComponent() {
  const { loginWithMagic, isAuthenticated, user } = useAuth();
  
  const handleLogin = async (email: string) => {
    await loginWithMagic(email);
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.email}!</p>
      ) : (
        <button onClick={() => handleLogin('user@example.com')}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Optional Wallet Connection

```typescript
import { useAuth } from '@/lib/auth/auth-context';

function WalletComponent() {
  const { connectWallet, disconnectWallet, walletConnection } = useAuth();
  
  return (
    <div>
      {walletConnection.isConnected ? (
        <div>
          <p>Connected: {walletConnection.address}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
```

## Error Handling

The implementation includes comprehensive error handling for various scenarios:

### Magic Link Errors
- `MagicLinkFailedVerification`: Link verification failed
- `MagicLinkExpired`: Link has expired
- `MagicLinkRateLimited`: Too many attempts
- `UserAlreadyLoggedIn`: User already authenticated

### Wallet Errors
- Connection failures
- Network switching issues
- User rejection

### Toast Notifications
All errors and successes are displayed via toast notifications:
- Success: Green toast for successful operations
- Error: Red toast for errors with specific messages
- Info: Blue toast for informational messages

## Security Considerations

### ✅ Implemented Security Features
- Email validation with regex pattern
- Rate limiting through Magic SDK
- Secure session management
- Network validation
- Error message sanitization

### 🔒 Best Practices
- Never expose API keys in client-side code
- Use environment variables for configuration
- Implement proper error boundaries
- Validate all user inputs
- Use HTTPS in production

## Migration from PnP to Official SDK

### Changes Made
1. **Package Updates**:
   - Removed: `@magic-sdk/pnp`, `@magic-sdk/admin`
   - Added: `magic-sdk`, `@magic-ext/oauth`, `react-toastify`

2. **API Changes**:
   - `loginWithMagicLink()` → `loginWithEmailOTP()`
   - `getMetadata()` → `getInfo()`
   - Enhanced error handling with `RPCError`

3. **Configuration Updates**:
   - Updated network configuration
   - Added OAuth extension support
   - Improved type safety

## Development Setup

### 1. Install Dependencies
```bash
npm install magic-sdk @magic-ext/oauth react-toastify
```

### 2. Configure Environment
```bash
cp env.template .env.local
# Edit .env.local with your Magic API key
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test Authentication
1. Visit `http://localhost:3000`
2. Enter your email address
3. Check your email for the Magic Link
4. Click the link to authenticate
5. Optionally connect a wallet

## Production Deployment

### Environment Setup
1. Set `NEXT_PUBLIC_MAGIC_API_KEY` with your production API key
2. Configure production RPC endpoints
3. Set `NEXTAUTH_URL` to your production domain
4. Generate a secure `NEXTAUTH_SECRET`

### Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables configured
- [ ] Error boundaries implemented
- [ ] Rate limiting configured
- [ ] Logging and monitoring set up

## Troubleshooting

### Common Issues

1. **Magic Link not sending**:
   - Check API key configuration
   - Verify email format
   - Check Magic dashboard for rate limits

2. **Wallet connection fails**:
   - Ensure MetaMask is installed
   - Check network configuration
   - Verify RPC endpoint

3. **Authentication errors**:
   - Check browser console for details
   - Verify Magic SDK initialization
   - Check network connectivity

### Debug Mode
Enable debug logging by setting:
```typescript
// In magic-config.ts
console.log('Magic instance:', magic);
console.log('User metadata:', metadata);
```

## API Reference

### Auth Context Methods
- `loginWithMagic(email: string)`: Authenticate with email
- `logout()`: Logout user
- `connectWallet()`: Connect blockchain wallet
- `disconnectWallet()`: Disconnect wallet

### Auth State
- `isAuthenticated`: Boolean indicating auth status
- `user`: User object with email and wallet address
- `loading`: Loading state for auth operations
- `magicAuth`: Magic Link specific state
- `walletConnection`: Wallet connection state

## Contributing

When contributing to the authentication system:

1. **Follow TypeScript patterns** in `auth-types.ts`
2. **Add error handling** for all async operations
3. **Include toast notifications** for user feedback
4. **Test with different networks** and wallet providers
5. **Update documentation** for any API changes

## License

This implementation is part of the Secure Code KnAIght platform and follows the project's licensing terms. 