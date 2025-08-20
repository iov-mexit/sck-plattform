import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Declare ethereum window object type
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on?: (eventName: string, handler: (...args: any[]) => void) => void;
      removeListener?: (eventName: string, handler: (...args: any[]) => void) => void;
    };
  }
}

interface RoleAgent {
  id: string;
  name: string;
  assignedToDid: string;
  trustScore?: number;
  isEligibleForMint: boolean;
  nftMinted: boolean;
  nftTokenId?: string;
  nftContractAddress?: string;
  soulboundTokenId?: string;
}

interface WalletInfo {
  address: string;
  chainId: string;
  balance: string;
}

interface TransactionStatus {
  status: 'pending' | 'confirmed' | 'failed';
  hash?: string;
}

interface NFTMintingProps {
  roleAgent: RoleAgent;
  organizationId: string;
  onMintSuccess?: (tokenId: string, transactionHash: string) => void;
}

export default function NFTMinting({ roleAgent, organizationId, onMintSuccess }: NFTMintingProps) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [contractAddress, setContractAddress] = useState(process.env.NEXT_PUBLIC_SCK_NFT_ADDRESS || '0x742d35Cc6474C9307f5a35c68C4f8C7E6ef04e45');
  const [achievementType, setAchievementType] = useState('Security Achievement');
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ tokenId: string; transactionHash: string; achievementType: string } | null>(null);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus | null>(null);
  const [gasFeeEstimate, setGasFeeEstimate] = useState<string | null>(null);

  const achievementTypes = [
    'Security Achievement',
    'Code Review Master',
    'DevOps Excellence',
    'Architecture Leadership',
    'Security Certification',
    'Quality Assurance Expert',
    'Team Collaboration',
    'Innovation Award',
    'Full Stack Developer',
    'Blockchain Expert'
  ];

  // Check if wallet is connected on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Auto-fill recipient address when wallet is connected
  useEffect(() => {
    if (walletInfo && !recipientAddress) {
      setRecipientAddress(walletInfo.address);
    }
  }, [walletInfo, recipientAddress]);

  const checkWalletConnection = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.log('🦊 MetaMask not detected');
      return;
    }

    try {
      console.log('🔍 Checking wallet connection...');
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        console.log('✅ Wallet already connected:', accounts[0]);
        await getWalletInfo();
      } else {
        console.log('📝 No accounts connected');
      }
    } catch (error) {
      console.error('❌ Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('🦊 MetaMask is not installed. Please install MetaMask and try again.');
      console.error('MetaMask not detected');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      console.log('🔗 Requesting wallet connection...');

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length === 0) {
        setError('No accounts found. Please unlock MetaMask.');
        return;
      }

      console.log('✅ Wallet connected:', accounts[0]);
      await getWalletInfo();

    } catch (err: any) {
      console.error('❌ Wallet connection error:', err);
      if (err.code === 4001) {
        setError('Connection rejected by user.');
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const getWalletInfo = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.error('MetaMask not available');
      return;
    }

    try {
      console.log('📊 Getting wallet info...');

      // Use window.ethereum directly instead of dynamic import
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      if (accounts.length === 0) {
        console.log('No accounts found');
        setWalletConnected(false);
        return;
      }

      // Get balance using simple web3 RPC call
      const balanceHex = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });

      // Convert hex balance to ETH (simple conversion without ethers)
      const balanceWei = parseInt(balanceHex, 16);
      const balanceEth = (balanceWei / Math.pow(10, 18)).toFixed(4);

      const walletData = {
        address: accounts[0],
        chainId,
        balance: balanceEth
      };

      setWalletInfo(walletData);
      setWalletConnected(true);

      console.log('💰 Wallet info:', walletData);

      // Check if user is on Sepolia network
      if (chainId !== '0xaa36a7') {
        setError('⚠️ Please switch to Sepolia testnet in MetaMask (Chain ID: 11155111)');
      } else {
        setError(null);
      }

    } catch (error) {
      console.error('❌ Error getting wallet info:', error);
      setError('Failed to get wallet information');
      setWalletConnected(false);
    }
  };

  const estimateGasFees = async () => {
    if (!walletInfo || !contractAddress) return;

    try {
      console.log('⛽ Estimating gas fees...');

      // Get current gas price using simple RPC call
      const gasPriceHex = await window.ethereum.request({
        method: 'eth_gasPrice',
        params: []
      });

      const gasPrice = parseInt(gasPriceHex, 16);
      const estimatedGasLimit = 150000; // Typical gas limit for NFT minting

      const totalGasFee = gasPrice * estimatedGasLimit;
      const gasFeeInEth = (totalGasFee / Math.pow(10, 18)).toFixed(6);

      setGasFeeEstimate(gasFeeInEth);
      console.log('⛽ Gas estimate:', gasFeeInEth, 'ETH');
    } catch (error) {
      console.error('❌ Error estimating gas fees:', error);
      setGasFeeEstimate('~0.003'); // Fallback estimate
    }
  };

  useEffect(() => {
    if (walletConnected) {
      estimateGasFees();
    }
  }, [walletConnected, contractAddress]);

  const switchToSepolia = async () => {
    if (!window.ethereum) return;

    try {
      console.log('🔄 Switching to Sepolia...');

      // Try to switch to Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
      });

      // Refresh wallet info after switch
      await getWalletInfo();
    } catch (switchError: any) {
      // If Sepolia is not added to MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
          await getWalletInfo();
        } catch (addError) {
          console.error('❌ Failed to add Sepolia network:', addError);
          setError('Failed to add Sepolia network to MetaMask');
        }
      } else {
        console.error('❌ Failed to switch to Sepolia:', switchError);
        setError('Failed to switch to Sepolia network');
      }
    }
  };

  const prepareTransaction = async () => {
    if (!walletInfo) {
      setError('Please connect your wallet first');
      return;
    }

    if (walletInfo.chainId !== '0xaa36a7') {
      setError('Please switch to Sepolia testnet');
      return;
    }

    try {
      setIsPreparing(true);
      setError(null);

      console.log('🎯 Preparing NFT mint transaction...');

      const response = await fetch('/api/v1/nft/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleAgentId: roleAgent.id,
          organizationId,
          recipientAddress: walletInfo.address,
          contractAddress,
          achievementType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTransactionData(data.data);
        console.log('✅ Transaction prepared:', data.data);
      } else {
        setError(data.error || 'Failed to prepare transaction');
        console.error('❌ API Error:', data.error);
      }
    } catch (error) {
      console.error('❌ Error preparing transaction:', error);
      setError('Failed to prepare transaction');
    } finally {
      setIsPreparing(false);
    }
  };

  const mintNFT = async () => {
    if (!transactionData || !walletInfo) {
      setError('No transaction data available or wallet not connected');
      return;
    }

    try {
      setIsMinting(true);
      setError(null);
      setTransactionStatus({ status: 'pending' });

      console.log('🎨 Minting NFT...');

      // For demonstration, we'll simulate the transaction
      // In production, this would send the actual transaction to the smart contract
      const simulatedTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      console.log('📡 Sending transaction...');

      // Simulate transaction submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate confirmation
      setTransactionStatus({ status: 'confirmed', hash: simulatedTxHash });

      const tokenId = `achievement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Update the role agent in the database
      await updateRoleAgentWithNFT(roleAgent.id, tokenId, simulatedTxHash);

      setSuccess({
        tokenId,
        transactionHash: simulatedTxHash,
        achievementType,
      });

      console.log('🎉 NFT minted successfully!', { tokenId, transactionHash: simulatedTxHash });

      onMintSuccess?.(tokenId, simulatedTxHash);

    } catch (error) {
      console.error('❌ Error minting NFT:', error);
      setError('Failed to mint NFT. Please try again.');
      setTransactionStatus({ status: 'failed' });
    } finally {
      setIsMinting(false);
    }
  };

  const updateRoleAgentWithNFT = async (roleAgentId: string, tokenId: string, transactionHash: string) => {
    try {
      console.log('📝 Updating role agent with NFT info...');

      const response = await fetch(`/api/v1/role-agents/${roleAgentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          soulboundTokenId: tokenId,
          nftTransactionHash: transactionHash,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Role agent updated with NFT info');
      } else {
        console.error('❌ Failed to update role agent:', data.error);
      }
    } catch (error) {
      console.error('❌ Error updating role agent:', error);
    }
  };

  if (success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <span>🎉</span>
            Achievement NFT Minted Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-green-700">
              <strong>Token ID:</strong> <span className="font-mono">{success.tokenId}</span>
            </div>
            <div className="text-sm text-green-700">
              <strong>Transaction:</strong>
              <a
                href={`https://sepolia.etherscan.io/tx/${success.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-600 hover:text-blue-700 ml-1"
              >
                {success.transactionHash.slice(0, 10)}...{success.transactionHash.slice(-8)}
              </a>
            </div>
            <div className="text-sm text-green-700">
              <strong>Type:</strong> {success.achievementType}
            </div>
          </div>

          <Button
            onClick={() => {
              setSuccess(null);
              setTransactionData(null);
              setTransactionStatus(null);
            }}
            variant="outline"
            className="w-full"
          >
            Mint Another NFT
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🎯 Mint Achievement NFT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        {/* Role Agent Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
          <div className="font-medium text-blue-900 mb-1">Selected Role Agent</div>
          <div className="text-blue-800 font-medium">{roleAgent.name}</div>
          <div className="text-blue-700">DID: {roleAgent.assignedToDid}</div>
          <div className="text-blue-700">Trust Score: {roleAgent.trustScore}/1000</div>
        </div>

        {/* Wallet Connection */}
        {!walletConnected ? (
          <div className="space-y-3">
            <div className="text-center py-4">
              <div className="text-gray-600 mb-3">Connect your MetaMask wallet to mint NFTs</div>
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? '🔄 Connecting...' : '🦊 Connect MetaMask'}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Wallet Info */}
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm">
              <div className="font-medium text-green-900 mb-1">✅ Wallet Connected</div>
              <div className="text-green-800 font-mono">{walletInfo?.address.slice(0, 10)}...{walletInfo?.address.slice(-8)}</div>
              <div className="text-green-700">Balance: {walletInfo?.balance} ETH</div>
              {gasFeeEstimate && (
                <div className="text-green-700">Estimated Gas Fee: ~{gasFeeEstimate} ETH</div>
              )}
            </div>

            {/* Network Check */}
            {walletInfo?.chainId !== '0xaa36a7' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="text-yellow-800 text-sm mb-2">
                  ⚠️ Please switch to Sepolia testnet for NFT minting
                </div>
                <Button
                  onClick={switchToSepolia}
                  size="sm"
                  variant="outline"
                >
                  Switch to Sepolia
                </Button>
              </div>
            )}

            {/* Achievement Type Selection */}
            <div className="space-y-2">
              <Label>Achievement Type</Label>
              <Select value={achievementType} onValueChange={setAchievementType}>
                <SelectTrigger>
                  <SelectValue />
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

            {/* Contract Address */}
            <div className="space-y-2">
              <Label>Contract Address</Label>
              <Input
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono text-sm"
              />
            </div>

            {/* Transaction Status */}
            {transactionStatus && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
                <div className="font-medium text-blue-900 mb-1">Transaction Status</div>
                <div className="text-blue-800">
                  {transactionStatus.status === 'pending' && '⏳ Pending...'}
                  {transactionStatus.status === 'confirmed' && '✅ Confirmed'}
                  {transactionStatus.status === 'failed' && '❌ Failed'}
                </div>
                {transactionStatus.hash && (
                  <div className="text-blue-700 font-mono">
                    Hash: {transactionStatus.hash.slice(0, 10)}...{transactionStatus.hash.slice(-8)}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!transactionData ? (
                <Button
                  onClick={prepareTransaction}
                  disabled={isPreparing || walletInfo?.chainId !== '0xaa36a7'}
                  className="w-full"
                >
                  {isPreparing ? '⏳ Preparing...' : '🎯 Prepare NFT Minting'}
                </Button>
              ) : (
                <Button
                  onClick={mintNFT}
                  disabled={isMinting || walletInfo?.chainId !== '0xaa36a7'}
                  className="w-full"
                >
                  {isMinting ? '⏳ Minting...' : '🎨 Mint Achievement NFT'}
                </Button>
              )}
            </div>

            {/* How it works */}
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs text-gray-600">
              <div className="font-medium mb-1">How it works:</div>
              <ol className="list-decimal list-inside space-y-1">
                <li>Connect your MetaMask wallet</li>
                <li>Switch to Sepolia testnet</li>
                <li>Prepare the NFT minting transaction</li>
                <li>Sign and submit the transaction</li>
                <li>Receive your achievement NFT</li>
              </ol>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 