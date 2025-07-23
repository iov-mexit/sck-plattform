'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get the first available connector (should be injected/MetaMask)
  const connector = connectors[0];

  const handleConnect = async () => {
    if (!connector) {
      alert('No wallet connector available. Please install MetaMask.');
      return;
    }

    setIsConnecting(true);

    try {
      await connect({ connector });
    } catch (err) {
      console.error('Connection failed:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  // Show loading during SSR
  if (!isClient) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary">Loading</Badge>
            Connecting to MetaMask
          </CardTitle>
          <CardDescription>
            Initializing wallet connection...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (isConnected && address) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-600">Connected</Badge>
            MetaMask Connected
          </CardTitle>
          <CardDescription>
            Your wallet is connected and ready to use
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-white rounded-lg border">
            <p className="text-sm font-medium text-gray-900">Connected Address:</p>
            <p className="text-sm text-gray-600 font-mono break-all">
              {address}
            </p>
          </div>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="w-full"
          >
            Disconnect MetaMask
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Required</Badge>
          Connect MetaMask Wallet
        </CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to access blockchain features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg border">
            <p className="text-sm text-gray-600">
              Click the button below to connect your MetaMask wallet
            </p>
          </div>

          <Button
            onClick={handleConnect}
            disabled={isConnecting || isPending}
            className="w-full"
            size="lg"
          >
            {isConnecting || isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting to MetaMask...
              </>
            ) : (
              'Connect MetaMask'
            )}
          </Button>

          {error && (
            <div className="p-3 bg-red-100 rounded-lg border border-red-300">
              <p className="text-sm text-red-700">
                Connection failed: {error.message}
              </p>
            </div>
          )}

          {/* Debug info */}
          <details className="p-3 bg-gray-100 rounded-lg">
            <summary className="cursor-pointer font-medium text-gray-700">Debug Info</summary>
            <div className="text-xs text-gray-600 mt-2 space-y-1">
              <div>Connectors: {connectors.length}</div>
              <div>First connector: {connector?.name || 'None'}</div>
              <div>Connector ready: {connector?.ready ? 'Yes' : 'No'}</div>
              <div>Window ethereum: {typeof window !== 'undefined' && window.ethereum ? 'Yes' : 'No'}</div>
              <div>Error: {error?.message || 'None'}</div>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
} 