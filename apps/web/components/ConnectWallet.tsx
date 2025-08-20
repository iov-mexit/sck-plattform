'use client';

import React from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Loader2 } from 'lucide-react';

interface ConnectWalletProps {
  /** Whether wallet connection is required (shows error if not connected) */
  required?: boolean;
  /** Custom title for the connection card */
  title?: string;
  /** Custom description for the connection card */
  description?: string;
  /** Whether to show as a compact button only */
  compact?: boolean;
}

export function ConnectWallet({
  required = false,
  title = "Wallet Connection",
  description = "Connect your MetaMask wallet to access blockchain features",
  compact = false
}: ConnectWalletProps) {
  const { connect, isPending, error } = useConnect();
  const { isConnected, address, chain } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  // Compact button version (for navigation, etc.)
  if (compact) {
    if (isConnected) {
      return (
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => disconnect()}
          >
            Disconnect
          </Button>
        </div>
      );
    }

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleConnect}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  // Full card version
  if (isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Wallet className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-lg">🦊 Wallet Connected</CardTitle>
          <CardDescription>
            Your MetaMask wallet is connected and ready
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Connected Address:</p>
            <Badge variant="outline" className="text-xs font-mono">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Badge>
          </div>
          {chain && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Network:</p>
              <Badge variant="secondary">
                {chain.name || `Chain ID: ${chain.id}`}
              </Badge>
            </div>
          )}
          <Button
            onClick={() => disconnect()}
            variant="outline"
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Not connected state
  return (
    <Card className={`w-full max-w-md mx-auto ${required ? 'border-red-200' : ''}`}>
      <CardHeader className="text-center">
        <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${required ? 'bg-red-100' : 'bg-blue-100'
          }`}>
          <Wallet className={`h-6 w-6 ${required ? 'text-red-600' : 'text-blue-600'}`} />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          {description}
          {required && (
            <span className="block mt-2 text-red-600 font-medium">
              ⚠️ Wallet connection required to continue
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleConnect}
          disabled={isPending}
          className="w-full"
          variant={required ? "default" : "outline"}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting MetaMask...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              🦊 Connect MetaMask
            </>
          )}
        </Button>
        {error && (
          <p className="text-sm text-red-500 mt-2 text-center">
            {error.message || 'Failed to connect wallet'}
          </p>
        )}
        {!required && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Required for NFT minting and blockchain features
          </p>
        )}
      </CardContent>
    </Card>
  );
} 