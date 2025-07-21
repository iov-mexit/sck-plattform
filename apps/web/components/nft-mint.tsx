'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export function NFTMint() {
  const { address, isConnected } = useAccount();
  const [digitalTwinName, setDigitalTwinName] = useState('');
  const [digitalTwinDescription, setDigitalTwinDescription] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<string>('');

  const handleMint = async () => {
    if (!isConnected || !address) {
      setMintResult('Please connect your wallet first');
      return;
    }

    if (!digitalTwinName.trim()) {
      setMintResult('Please enter a digital twin name');
      return;
    }

    setIsMinting(true);
    setMintResult('');

    try {
      // Mock transaction for testing
      console.log('Mock minting digital twin:', {
        to: address,
        name: digitalTwinName,
        description: digitalTwinDescription
      });

      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setMintResult('✅ Digital Twin NFT minted successfully! (Mock transaction)');
      setDigitalTwinName('');
      setDigitalTwinDescription('');
    } catch (error) {
      console.error('Minting error:', error);
      setMintResult('❌ Failed to mint NFT. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎨 Mint Digital Twin NFT
        </CardTitle>
        <CardDescription>
          Create your first Digital Twin NFT to represent your achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Digital Twin Name *</Label>
          <Input
            id="name"
            placeholder="Enter digital twin name"
            value={digitalTwinName}
            onChange={(e) => setDigitalTwinName(e.target.value)}
            disabled={isMinting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Enter description (optional)"
            value={digitalTwinDescription}
            onChange={(e) => setDigitalTwinDescription(e.target.value)}
            disabled={isMinting}
          />
        </div>

        <div className="space-y-2">
          <Label>Wallet Status</Label>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  ✅ Connected
                </Badge>
                <span className="text-sm text-gray-600">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </>
            ) : (
              <Badge variant="secondary">❌ Not Connected</Badge>
            )}
          </div>
        </div>

        <Button
          onClick={handleMint}
          disabled={!isConnected || isMinting || !digitalTwinName.trim()}
          className="w-full"
        >
          {isMinting ? 'Minting...' : 'Mint Digital Twin NFT'}
        </Button>

        {mintResult && (
          <div className={`p-3 rounded-md text-sm ${mintResult.includes('✅')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
            {mintResult}
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>💡 This is a mock implementation for testing</p>
          <p>🔗 Connect real contract to enable actual minting</p>
          <p>⚡ Gas fees will apply on real transactions</p>
        </div>
      </CardContent>
    </Card>
  );
} 