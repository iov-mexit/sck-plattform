'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { RPCError, RPCErrorCode } from 'magic-sdk';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { createMagicInstance, setMagicInstance, getMagicInstance } from './magic-config';
import { showToast } from '@/lib/utils/toast';
import { organizationService } from '@/lib/services/organization-service';
import {
  AuthContextType,
  User,
  MagicAuthState,
  WalletConnectionState,
  AuthError
} from './auth-types';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to extract domain from email
const getDomainFromEmail = (email: string): string => {
  return email.split('@')[1] || '';
};

// Helper function to fetch organization data
const fetchOrganizationData = async (email: string) => {
  try {
    // Only return organization data if user is actually authenticated
    // This prevents bypassing authentication
    if (!email) {
      return undefined;
    }

    // MVP: Use default organization for authenticated users
    // TODO: Implement proper multi-org logic for scaling
    return {
      id: 'org-securecodecorp',
      name: 'SecureCode Corp',
      domain: 'securecodecorp.com',
      isActive: true,
      onboardingComplete: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Error fetching organization data:', error);
    return undefined;
  }
};

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Magic Link state
  const [magicAuth, setMagicAuth] = useState<MagicAuthState>({
    isLoggedIn: false,
    isLoggingIn: false,
    user: null,
    error: null,
  });

  // Wallet connection state
  const [walletConnection, setWalletConnection] = useState<WalletConnectionState>({
    isConnected: false,
    isConnecting: false,
    address: null,
    chainId: null,
    error: null,
  });

  // Loading state
  const [loading, setLoading] = useState(true);

  // Initialize Magic Link (with graceful fallback)
  useEffect(() => {
    const initializeMagic = async () => {
      try {
        if (typeof window !== 'undefined') {
          const magic = createMagicInstance();
          if (magic) {
            setMagicInstance(magic);

            // Check if user is already logged in
            const isLoggedIn = await magic.user.isLoggedIn();
            console.log('🔍 Magic Link session check:', isLoggedIn);

            if (isLoggedIn) {
              // User is already authenticated, get their info
              const metadata = await magic.user.getInfo();
              const organization = await fetchOrganizationData(metadata.email || '');

              const user: User = {
                id: metadata.issuer || '',
                email: metadata.email || '',
                walletAddress: metadata.publicAddress || undefined,
                organization,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              setMagicAuth({
                isLoggedIn: true,
                isLoggingIn: false,
                user,
                error: null,
              });

              console.log('🔍 User already authenticated:', user.email);
            } else {
              // User not authenticated, start fresh
              setMagicAuth({
                isLoggedIn: false,
                isLoggingIn: false,
                user: null,
                error: null,
              });

              console.log('🔍 User not authenticated, showing login');
            }
          }
        }
      } catch (error) {
        console.warn('Magic Link initialization failed:', error);
        setMagicAuth({
          isLoggedIn: false,
          isLoggingIn: false,
          user: null,
          error: null,
        });
      } finally {
        setLoading(false);
      }
    };

    initializeMagic();
  }, []);

  // Initialize Wagmi hooks
  const wagmiAccount = useAccount();
  const wagmiConnect = useConnect();
  const wagmiDisconnect = useDisconnect();

  // Sync wallet connection state with wagmi (if available)
  useEffect(() => {
    if (wagmiAccount) {
      setWalletConnection(prev => ({
        ...prev,
        isConnected: wagmiAccount.isConnected,
        address: wagmiAccount.address || null,
        chainId: wagmiAccount.chainId || null,
        error: wagmiConnect?.error?.message || null,
      }));
    }
  }, [wagmiAccount?.isConnected, wagmiAccount?.address, wagmiAccount?.chainId, wagmiConnect?.error]);

  // Login with Magic Link using Email OTP
  const loginWithMagic = async (email: string): Promise<void> => {
    try {
      setMagicAuth(prev => ({ ...prev, isLoggingIn: true, error: null }));

      const magic = getMagicInstance();
      if (!magic) {
        throw new Error('Magic Link is not configured properly. Please use MetaMask to connect.');
      }

      // Send magic link email using Email OTP
      const token = await magic.auth.loginWithEmailOTP({ email });

      // Get user metadata
      const metadata = await magic.user.getInfo();

      if (!token || !metadata?.publicAddress) {
        throw new Error('Magic login failed');
      }

      // Fetch organization data
      const organization = (await fetchOrganizationData(metadata.email || '')) || undefined;

      const user: User = {
        id: metadata.issuer || '',
        email: metadata.email || '',
        walletAddress: metadata.publicAddress || undefined,
        organization,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setMagicAuth({
        isLoggedIn: true,
        isLoggingIn: false,
        user,
        error: null,
      });

      showToast({
        message: 'Successfully logged in!',
        type: 'success'
      });

    } catch (error) {
      console.error('Magic Link login failed:', error);

      let errorMessage = 'Magic Link is currently unavailable. Please use MetaMask to connect.';

      if (error instanceof RPCError) {
        switch (error.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
            errorMessage = 'Magic link verification failed. Please use MetaMask instead.';
            break;
          case RPCErrorCode.MagicLinkExpired:
            errorMessage = 'Magic link has expired. Please use MetaMask instead.';
            break;
          case RPCErrorCode.MagicLinkRateLimited:
            errorMessage = 'Too many login attempts. Please use MetaMask instead.';
            break;
          case RPCErrorCode.UserAlreadyLoggedIn:
            errorMessage = 'You are already logged in.';
            break;
          default:
            errorMessage = 'Magic Link is unavailable. Please use MetaMask to connect.';
        }
      } else if (error instanceof Error) {
        errorMessage = 'Magic Link is unavailable. Please use MetaMask to connect.';
      }

      const authError: AuthError = {
        code: 'MAGIC_LOGIN_FAILED',
        message: errorMessage,
      };

      setMagicAuth(prev => ({
        ...prev,
        isLoggingIn: false,
        error: authError.message,
      }));

      showToast({
        message: errorMessage,
        type: 'error'
      });
    }
  };

  // Logout from Magic Link
  const logout = async (): Promise<void> => {
    try {
      const magic = getMagicInstance();
      if (magic) {
        await magic.user.logout();
      }

      setMagicAuth({
        isLoggedIn: false,
        isLoggingIn: false,
        user: null,
        error: null,
      });

      // Also disconnect wallet if connected
      if (walletConnection.isConnected) {
        await disconnectWallet();
      }

      showToast({
        message: 'Successfully logged out!',
        type: 'success'
      });
    } catch (error) {
      console.error('Logout failed:', error);
      showToast({
        message: 'Logout failed. Please try again.',
        type: 'error'
      });
    }
  };

  // Connect wallet (optional)
  const connectWallet = async (): Promise<void> => {
    try {
      if (!wagmiConnect?.connectors?.length) {
        throw new Error('No wallet connectors available');
      }

      setWalletConnection(prev => ({ ...prev, isConnecting: true, error: null }));

      const connector = wagmiConnect.connectors[0]; // Use first available connector (MetaMask)
      if (!connector) {
        throw new Error('No wallet connector available');
      }

      await wagmiConnect.connect({ connector });

      // The wallet connection state will be updated by the useEffect that syncs with wagmiAccount
      // No need to manually update it here

      showToast({
        message: 'Wallet connected successfully!',
        type: 'success'
      });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';

      setWalletConnection(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));

      showToast({
        message: errorMessage,
        type: 'error'
      });
    }
  };

  // Disconnect wallet
  const disconnectWallet = async (): Promise<void> => {
    try {
      if (wagmiDisconnect?.disconnect) {
        wagmiDisconnect.disconnect();
      }

      setWalletConnection({
        isConnected: false,
        isConnecting: false,
        address: null,
        chainId: null,
        error: null,
      });

      // If user was only authenticated via wallet, log them out completely
      if (!magicAuth.isLoggedIn) {
        setMagicAuth(prev => ({
          ...prev,
          isLoggedIn: false,
          user: null,
        }));
      }

      showToast({
        message: 'Wallet disconnected!',
        type: 'info'
      });
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
      showToast({
        message: 'Failed to disconnect wallet.',
        type: 'error'
      });
    }
  };

  // Combined authentication state
  // For MVP: Only consider Magic Link authentication, not wallet connection
  const isAuthenticated = magicAuth.isLoggedIn;

  // Create user object from wallet connection if not logged in via Magic
  const user = magicAuth.user || (walletConnection.isConnected && walletConnection.address ? {
    id: walletConnection.address,
    email: `${walletConnection.address.slice(0, 6)}...${walletConnection.address.slice(-4)}@wallet.local`,
    walletAddress: walletConnection.address,
    organization: undefined, // Will be set during onboarding
    createdAt: new Date(),
    updatedAt: new Date(),
  } : null);

  const value: AuthContextType = {
    magicAuth,
    loginWithMagic,
    logout,
    walletConnection,
    connectWallet,
    disconnectWallet,
    isAuthenticated,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 