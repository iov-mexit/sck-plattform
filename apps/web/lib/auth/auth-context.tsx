'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import { RPCError, RPCErrorCode } from 'magic-sdk';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { createMagicInstance, setMagicInstance, getMagicInstance } from './magic-config';
import { showToast } from '@/lib/utils/toast';
import {
  AuthContextType,
  User,
  MagicAuthState,
  WalletConnectionState,
  AuthError
} from './auth-types';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

  // Initialize Magic Link
  useEffect(() => {
    const initializeMagic = async () => {
      try {
        if (typeof window !== 'undefined') {
          const magic = createMagicInstance();
          if (magic) {
            setMagicInstance(magic);

            // Check if user is already logged in
            const isLoggedIn = await magic.user.isLoggedIn();
            if (isLoggedIn) {
              const metadata = await magic.user.getInfo();
              const user: User = {
                id: metadata.issuer || '',
                email: metadata.email || '',
                walletAddress: metadata.publicAddress || undefined,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              setMagicAuth({
                isLoggedIn: true,
                isLoggingIn: false,
                user,
                error: null,
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize Magic Link:', error);
        setMagicAuth(prev => ({
          ...prev,
          error: 'Failed to initialize authentication',
        }));
      } finally {
        setLoading(false);
      }
    };

    initializeMagic();
  }, []);

  // Initialize Wagmi hooks with error handling
  let wagmiAccount: any = null;
  let wagmiConnect: any = null;
  let wagmiDisconnect: any = null;

  try {
    wagmiAccount = useAccount();
    wagmiConnect = useConnect();
    wagmiDisconnect = useDisconnect();
  } catch (error) {
    console.warn('Wagmi hooks not available:', error);
    // Continue without wallet functionality
  }

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
        throw new Error('Magic Link not initialized');
      }

      // Send magic link email using Email OTP
      const token = await magic.auth.loginWithEmailOTP({ email });

      // Get user metadata
      const metadata = await magic.user.getInfo();

      if (!token || !metadata?.publicAddress) {
        throw new Error('Magic login failed');
      }

      const user: User = {
        id: metadata.issuer || '',
        email: metadata.email || '',
        walletAddress: metadata.publicAddress || undefined,
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

      let errorMessage = 'Login failed';

      if (error instanceof RPCError) {
        switch (error.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
            errorMessage = 'Magic link verification failed. Please try again.';
            break;
          case RPCErrorCode.MagicLinkExpired:
            errorMessage = 'Magic link has expired. Please request a new one.';
            break;
          case RPCErrorCode.MagicLinkRateLimited:
            errorMessage = 'Too many login attempts. Please wait before trying again.';
            break;
          case RPCErrorCode.UserAlreadyLoggedIn:
            errorMessage = 'You are already logged in.';
            break;
          default:
            errorMessage = error.message || 'Something went wrong. Please try again.';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
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
      if (!wagmiConnect) {
        throw new Error('Wallet connection not available');
      }

      setWalletConnection(prev => ({ ...prev, isConnecting: true, error: null }));

      const connector = wagmiConnect.connectors[0]; // Use first available connector (MetaMask)
      if (!connector) {
        throw new Error('No wallet connector available');
      }

      await wagmiConnect.connect({ connector });

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
      if (wagmiDisconnect) {
        wagmiDisconnect.disconnect();
      }

      setWalletConnection({
        isConnected: false,
        isConnecting: false,
        address: null,
        chainId: null,
        error: null,
      });

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
  const isAuthenticated = magicAuth.isLoggedIn;
  const user = magicAuth.user;

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