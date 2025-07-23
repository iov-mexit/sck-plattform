'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function OptionalWalletConnect() {
  const {
    walletConnection,
    connectWallet,
    disconnectWallet,
    isAuthenticated
  } = useAuth();

  // Don't show if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show connected state
  if (walletConnection.isConnected && walletConnection.address) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="default">✅ Connected</Badge>
            Wallet Connected
          </CardTitle>
          <CardDescription>
            Your wallet is connected and ready for blockchain operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-sm text-gray-600">
                <strong>Address:</strong> {walletConnection.address.slice(0, 6)}...{walletConnection.address.slice(-4)}
              </p>
              {walletConnection.chainId && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Network:</strong> Chain ID {walletConnection.chainId}
                </p>
              )}
            </div>

            <Button
              onClick={disconnectWallet}
              variant="outline"
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show connection error
  if (walletConnection.error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="destructive">⚠️ Error</Badge>
            Wallet Connection Failed
          </CardTitle>
          <CardDescription>
            There was an issue connecting your wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-red-100 rounded-lg border border-red-300">
              <p className="text-sm text-red-700">
                {walletConnection.error}
              </p>
            </div>

            <Button
              onClick={connectWallet}
              disabled={walletConnection.isConnecting}
              className="w-full"
            >
              {walletConnection.isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                'Try Again'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show connect option
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Optional</Badge>
          Connect Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet for blockchain features (NFT minting, transactions)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg border">
            <p className="text-sm text-gray-600">
              Connect your MetaMask wallet to enable blockchain features like:
            </p>
            <ul className="text-sm text-gray-600 mt-2 list-disc list-inside space-y-1">
              <li>Minting NFTs</li>
              <li>Verifying transactions</li>
              <li>Digital twin management</li>
              <li>Blockchain-based credentials</li>
            </ul>
          </div>

          <Button
            onClick={connectWallet}
            disabled={walletConnection.isConnecting}
            className="w-full"
            size="lg"
          >
            {walletConnection.isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting to MetaMask...
              </>
            ) : (
              'Connect MetaMask'
            )}
          </Button>

          <div className="text-center text-xs text-gray-500">
            <p>Wallet connection is optional</p>
            <p>You can use the platform without connecting a wallet</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 