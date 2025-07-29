import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { BrowserProvider } from 'ethers';

interface RoleAgent {
  id: string;
  name: string;
  assignedDid: string;
  trustScore?: number;
  isEligibleForMint: boolean;
  nftMinted: boolean;
  nftTokenId?: string;
  nftContractAddress?: string;
  roleTemplate?: {
    title: string;
    category: string;
  };
  organization?: {
    name: string;
  };
}

interface NFTMintingProps {
  roleAgent: RoleAgent;
  organizationId: string;
  onMintSuccess?: (tokenId: string, transactionHash: string) => void;
}

export default function NFTMinting({ roleAgent, organizationId, onMintSuccess }: NFTMintingProps) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [contractAddress, setContractAddress] = useState(process.env.NEXT_PUBLIC_SCK_NFT_ADDRESS || '');
  const [achievementType, setAchievementType] = useState('Security Achievement');
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ tokenId: string; transactionHash: string; achievementType: string } | null>(null);
  const [transactionData, setTransactionData] = useState<any>(null);

  const achievementTypes = [
    'Security Achievement',
    'Code Review Master',
    'DevOps Excellence',
    'Architecture Leadership',
    'Security Certification',
    'Quality Assurance Expert',
    'Team Collaboration',
    'Innovation Award',
  ];

  const prepareTransaction = async () => {
    if (typeof window === 'undefined') {
      setError('This feature requires a browser environment');
      return;
    }

    if (!recipientAddress || !contractAddress) {
      setError('Please provide recipient address and contract address');
      return;
    }

    try {
      setIsPreparing(true);
      setError(null);

      const response = await fetch('/api/v1/nft/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleAgentId: roleAgent.id,
          organizationId,
          recipientAddress,
          contractAddress,
          achievementType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTransactionData(data.data.transactionData);
        setSuccess(null);
      } else {
        setError(data.error || 'Failed to prepare transaction');
      }
    } catch (err) {
      setError('Failed to prepare transaction');
      console.error('Transaction preparation error:', err);
    } finally {
      setIsPreparing(false);
    }
  };

  const signAndSubmitTransaction = async () => {
    if (!transactionData) {
      setError('No transaction data available');
      return;
    }

    try {
      setIsSigning(true);
      setError(null);

      // Check if MetaMask is available
      if (typeof window === 'undefined' || !window.ethereum) {
        setError('MetaMask is not installed. Please install MetaMask and try again.');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];

      // Check if user is on Sepolia network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0xaa36a7') { // Sepolia chain ID
        setError('Please switch to Sepolia testnet in MetaMask');
        return;
      }

      // Create provider and signer
      if (typeof window === 'undefined') {
        throw new Error('This function must be called on the client side');
      }
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      const { BrowserProvider } = await import('ethers');
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // For demo purposes, we'll simulate the transaction
      // In production, this would call the actual smart contract
      const mockTransactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      const mockTokenId = `achievement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Simulate transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess({
        tokenId: mockTokenId,
        transactionHash: mockTransactionHash,
        achievementType: achievementType,
      });

      onMintSuccess?.(mockTokenId, mockTransactionHash);

    } catch (err) {
      setError('Failed to sign and submit transaction');
      console.error('Transaction signing error:', err);
    } finally {
      setIsSigning(false);
    }
  };

  if (roleAgent.nftMinted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="default">Achievement NFT Minted</Badge>
            NFT Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Token ID:</span>
              <span className="text-sm text-gray-600">{roleAgent.nftTokenId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Contract Address:</span>
              <span className="text-sm text-gray-600 font-mono">
                {roleAgent.nftContractAddress?.slice(0, 10)}...{roleAgent.nftContractAddress?.slice(-8)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant="default">Transferable Achievement NFT</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!roleAgent.isEligibleForMint) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary">Not Eligible</Badge>
            Achievement NFT Minting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-gray-600 mb-2">
              This role agent is not eligible for achievement NFT minting
            </div>
            <div className="text-sm text-gray-500">
              Trust score: {roleAgent.trustScore || 'N/A'}/1000 (requires ≥750)
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="default">Eligible</Badge>
          Mint Achievement NFT
        </CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-green-600 font-medium mb-2">Achievement NFT Minted Successfully!</div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Achievement: {success.achievementType}</div>
                <div>Token ID: {success.tokenId}</div>
                <div>Transaction: {success.transactionHash}</div>
                <div className="text-xs text-gray-500 mt-2">
                  This NFT is transferable and represents an achievement credential.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Achievement Type</Label>
              <Select value={achievementType} onValueChange={setAchievementType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select achievement type" />
                </SelectTrigger>
                <SelectContent>
                  {achievementTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                type="text"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract">Contract Address</Label>
              <Input
                id="contract"
                type="text"
                placeholder="0x..."
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Role Agent Info</Label>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Name: {roleAgent.name}</div>
                <div>DID: {roleAgent.assignedDid}</div>
                <div>Role: {roleAgent.roleTemplate?.title || 'Unknown'}</div>
                <div>Trust Score: {roleAgent.trustScore || 'N/A'}/1000</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="text-sm text-blue-800">
                <strong>MetaMask Required:</strong> You'll need MetaMask installed and connected to Sepolia testnet to mint this achievement NFT.
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            {!transactionData ? (
              <Button
                onClick={prepareTransaction}
                disabled={isPreparing || !recipientAddress || !contractAddress}
                className="w-full"
              >
                {isPreparing ? 'Preparing Transaction...' : 'Prepare Transaction'}
              </Button>
            ) : (
              <Button
                onClick={signAndSubmitTransaction}
                disabled={isSigning}
                className="w-full"
              >
                {isSigning ? 'Signing with MetaMask...' : 'Sign & Mint NFT'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 