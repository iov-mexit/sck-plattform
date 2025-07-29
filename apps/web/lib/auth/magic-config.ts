// Magic Link Configuration - Official SDK
import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';

export const MAGIC_CONFIG = {
  // Magic Link API Key (get from https://magic.link)
  apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY || '',

  // Network configuration
  network: {
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC || '',
    chainId: 11155111, // Sepolia testnet
  },

  // UI configuration
  ui: {
    accentColor: '#3B82F6', // Blue
    logoUrl: '/logo.png',
    theme: 'light' as const,
  },

  // Email configuration
  email: {
    from: 'noreply@securecodeknight.com',
    subject: 'Login to Secure Code KnAIght',
  },

  // Session configuration
  session: {
    duration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  },

  // Wallet connection settings
  wallet: {
    required: false, // Wallet connection is optional
    autoConnect: false, // Don't auto-connect wallet
    networks: ['ethereum', 'polygon', 'flare'],
  },
};

// Network utilities
export const getNetworkUrl = () => {
  return MAGIC_CONFIG.network.rpcUrl;
};

export const getChainId = () => {
  return MAGIC_CONFIG.network.chainId;
};

// Create Magic instance
export const createMagicInstance = (): Magic<OAuthExtension[]> | null => {
  if (!MAGIC_CONFIG.apiKey) {
    console.warn('Magic API key not configured');
    return null;
  }

  if (!MAGIC_CONFIG.network.rpcUrl) {
    console.warn('Ethereum RPC URL not configured');
    return null;
  }

  try {
    return new Magic(MAGIC_CONFIG.apiKey, {
      network: {
        rpcUrl: getNetworkUrl(),
        chainId: getChainId(),
      },
      extensions: [new OAuthExtension()],
    });
  } catch (error) {
    console.error('Failed to create Magic instance:', error);
    return null;
  }
};

// Validation function
export function validateMagicConfig() {
  const errors: string[] = [];

  if (!MAGIC_CONFIG.apiKey) {
    errors.push('NEXT_PUBLIC_MAGIC_API_KEY is required');
  }

  if (!MAGIC_CONFIG.network.rpcUrl || MAGIC_CONFIG.network.rpcUrl.includes('YOUR_INFURA_KEY')) {
    errors.push('NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC must be configured');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Magic Link instance (will be initialized in components)
export let magicInstance: Magic<OAuthExtension[]> | null = null;

export function setMagicInstance(instance: Magic<OAuthExtension[]> | null) {
  magicInstance = instance;
}

export function getMagicInstance() {
  return magicInstance;
} 