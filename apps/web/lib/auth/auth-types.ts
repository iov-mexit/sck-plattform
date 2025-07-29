// Authentication Types

export interface Organization {
  id: string;
  name: string;
  description?: string;
  domain: string;
  isActive: boolean;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  did?: string; // Decentralized Identifier (optional)
  walletAddress?: string; // Wallet address (optional)
  organization?: Organization; // Organization data including onboarding state
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
  isAuthenticated: boolean;
}

export interface MagicAuthState {
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  user: User | null;
  error: string | null;
}

export interface WalletConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  chainId: number | null;
  error: string | null;
}

export interface AuthContextType {
  // Magic Link authentication
  magicAuth: MagicAuthState;
  loginWithMagic: (email: string) => Promise<void>;
  logout: () => Promise<void>;

  // Wallet connection (optional)
  walletConnection: WalletConnectionState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;

  // Combined state
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface LoginFormData {
  email: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

// Magic Link specific types
export interface MagicUserMetadata {
  email: string;
  issuer: string;
  publicAddress: string;
  walletType: string;
}

export interface MagicAuthResult {
  success: boolean;
  user?: User;
  error?: AuthError;
}

// Wallet connection types
export interface WalletConnectionResult {
  success: boolean;
  address?: string;
  chainId?: number;
  error?: AuthError;
} 