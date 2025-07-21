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
  const [hasAttemptedConnection, setHasAttemptedConnection] = useState(false);

  // Get only MetaMask connector
  const metaMaskConnector = connectors.find(connector =>
    connector.name.toLowerCase().includes('metamask') ||
    connector.name.toLowerCase().includes('injected')
  );

  // Reset connection attempt when MetaMask status changes
  useEffect(() => {
    if (!isConnected && hasAttemptedConnection) {
      setHasAttemptedConnection(false);
    }
  }, [isConnected, hasAttemptedConnection]);

  const handleConnect = async () => {
    if (!metaMaskConnector) {
      alert('MetaMask not found. Please install MetaMask extension.');
      return;
    }

    setIsConnecting(true);
    setHasAttemptedConnection(true);

    try {
      await connect({ connector: metaMaskConnector });
    } catch (err) {
      console.error('Connection failed:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setHasAttemptedConnection(false);
  };

  // Check if MetaMask is available
  const isMetaMaskAvailable = typeof window !== 'undefined' && window.ethereum;

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
        {!isMetaMaskAvailable ? (
          <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-300">
            <h4 className="font-medium text-yellow-800 mb-2">MetaMask Not Found</h4>
            <p className="text-sm text-yellow-700 mb-3">
              MetaMask extension is not installed or not detected.
            </p>
            <Button
              onClick={() => window.open('https://metamask.io/download/', '_blank')}
              variant="outline"
              className="w-full"
            >
              Install MetaMask
            </Button>
          </div>
        ) : (
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

            {hasAttemptedConnection && !isConnected && !error && (
              <div className="p-3 bg-blue-100 rounded-lg border border-blue-300">
                <p className="text-sm text-blue-700">
                  Please approve the connection in your MetaMask popup
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 