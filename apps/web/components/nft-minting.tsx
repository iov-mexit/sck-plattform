import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { ethers } from 'ethers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoleAgent {
  id: string;
  name: string;
  assignedToDid: string;
  organizationId?: string;
  trustScore?: number;
  isEligibleForMint: boolean;
  nftMinted: boolean;
  nftTokenId?: string;
  nftContractAddress?: string;
  soulboundTokenId?: string;
  roleTemplate?: {
    title: string;
    category: string;
  };
  organization?: {
    name: string;
  };
}

interface Organization {
  id: string;
  name: string;
  domain: string;
  description?: string;
}

interface NFTMintingProps {
  selectedAgent: RoleAgent;
  onMintSuccess?: (tokenId: string, transactionHash: string) => void;
}

interface MintResult {
  tokenId: string;
  transactionHash: string;
  contractAddress: string;
  explorerUrl: string;
  achievementType: string;
  simulation?: boolean; // Added for simulation flag
}

// SCK Dynamic NFT Contract ABI (organization-controlled minting only)
const NFT_CONTRACT_ABI = [
  "function mintRoleAgent(address to, string memory did, string memory name, string memory role, string memory organization, uint256 initialTrustScore) external returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)"
];

export default function NFTMinting({ selectedAgent, onMintSuccess }: NFTMintingProps) {
  // State management
  const { address: connectedAddress, isConnected } = useAccount();
  const { connect } = useConnect();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('0xF9e079690C0C11c6bF770348b30eE71a46C16643');
  const [achievementType, setAchievementType] = useState('Security Achievement');
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mintResult, setMintResult] = useState<MintResult | null>(null);

  const [roleAgents, setRoleAgents] = useState<RoleAgent[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Effects
  useEffect(() => {
    if (connectedAddress) {
      setRecipientAddress(connectedAddress);
    }
  }, [connectedAddress]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsResponse, orgsResponse] = await Promise.all([
          fetch('/api/v1/role-agents?limit=20'),
          fetch('/api/v1/organizations?domain=websocon.de')
        ]);

        if (agentsResponse.ok) {
          const agentsData = await agentsResponse.json();
          setRoleAgents(agentsData.agents || []);
        }

        if (orgsResponse.ok) {
          const orgsData = await orgsResponse.json();
          setOrganizations(orgsData.organizations || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load role agents and organizations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Backend minting function (organization-controlled)
  const mintNFT = async () => {
    if (!selectedAgent) {
      setError('Please select a role agent to mint');
      return;
    }

    if (!recipientAddress) {
      setError('Please provide recipient address');
      return;
    }

    try {
      setIsMinting(true);
      setError(null);
      console.log('🚀 Starting organization-controlled NFT minting...');

      const response = await fetch('/api/v1/nft/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roleAgentId: selectedAgent.id,
          organizationId: selectedAgent.organizationId || 'test-org-1',
          recipientAddress,
          contractAddress,
          achievementType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const result: MintResult = {
          tokenId: data.tokenId || data.data?.tokenId || '0',
          transactionHash: data.transactionHash || data.data?.transactionHash || 'simulated',
          contractAddress: data.contractAddress || contractAddress,
          explorerUrl: data.explorerUrl || `https://sepolia.etherscan.io/tx/${data.transactionHash}`,
          achievementType
        };

        setMintResult(result);

        if (onMintSuccess) {
          onMintSuccess(result.tokenId, result.transactionHash);
        }

        console.log('🎉 Organization-controlled NFT minting successful!', result);
      } else {
        throw new Error(data.error || 'Minting failed');
      }
    } catch (err: any) {
      console.error('❌ Organization minting failed:', err);
      setError(`Organization minting failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsMinting(false);
    }
  };

  // Show already minted status
  if (selectedAgent.nftMinted && selectedAgent.nftTokenId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-600">Achievement NFT Minted</Badge>
            NFT Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Token ID:</span>
              <span className="text-sm text-gray-600 font-mono">{selectedAgent.nftTokenId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Contract Address:</span>
              <span className="text-sm text-gray-600 font-mono">
                {selectedAgent.nftContractAddress ?
                  `${selectedAgent.nftContractAddress.slice(0, 10)}...${selectedAgent.nftContractAddress.slice(-8)}` :
                  'Not available'
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant="default">Transferable Achievement NFT</Badge>
            </div>
            <div className="mt-4 pt-3 border-t">
              <a
                href={`https://sepolia.etherscan.io/token/${selectedAgent.nftContractAddress}?a=${selectedAgent.nftTokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                🔍 View on Etherscan
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show minting result
  if (mintResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="default" className={mintResult.simulation ? "bg-yellow-600" : "bg-green-600"}>
              {mintResult.simulation ? "Simulated!" : "Success!"}
            </Badge>
            NFT Minted Successfully
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className={`font-medium mb-4 ${mintResult.simulation ? "text-yellow-600" : "text-green-600"}`}>
                {mintResult.simulation ? "🔬 Achievement NFT Simulated Successfully!" : "🎉 Achievement NFT Minted Successfully!"}
              </div>

              {mintResult.simulation && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                  <div className="text-sm text-yellow-800">
                    <strong>📋 Simulation Mode:</strong> This demonstrates the full NFT minting flow. For real blockchain minting, the system needs to be configured with proper owner credentials.
                  </div>
                </div>
              )}

              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Achievement:</span>
                  <span className="text-sm text-gray-600">{mintResult.achievementType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Token ID:</span>
                  <span className="text-sm text-gray-600 font-mono">{mintResult.tokenId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Contract:</span>
                  <span className="text-sm text-gray-600 font-mono">
                    {mintResult.contractAddress.slice(0, 10)}...{mintResult.contractAddress.slice(-8)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Network:</span>
                  <span className="text-sm text-gray-600">
                    {mintResult.simulation ? "Sepolia Testnet (Simulated)" : "Sepolia Testnet"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Transaction:</span>
                  <span className="text-sm text-gray-600 font-mono break-all">
                    {mintResult.transactionHash.slice(0, 16)}...
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <a
                  href={mintResult.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-2 px-4 rounded-md transition-colors text-sm ${mintResult.simulation
                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  🔍 {mintResult.simulation ? "View Simulation Data" : "View on Etherscan"}
                </a>
                <div className="text-xs text-gray-500 mt-4">
                  {mintResult.simulation
                    ? "✅ NFT data saved to database. Real blockchain integration requires proper configuration."
                    : "✅ NFT is now live on Sepolia and should appear in MetaMask within a few minutes."
                  }
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs">
                  <div className="font-medium text-yellow-800 mb-2">📋 To see your NFT in MetaMask:</div>
                  <div className="text-yellow-700 space-y-1">
                    <div>1. Make sure you're connected to <strong>Sepolia Testnet</strong></div>
                    <div>2. Go to NFTs tab in MetaMask</div>
                    <div>3. Tap "Import NFT" and enter:</div>
                    <div className="ml-4 font-mono text-xs">
                      <div>Address: {mintResult.contractAddress}</div>
                      <div>Token ID: {mintResult.tokenId}</div>
                    </div>
                    <div>4. Your achievement NFT will appear!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show not eligible status
  if (!selectedAgent.isEligibleForMint) {
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
              Trust score: {selectedAgent.trustScore || 'N/A'}/1000 (requires ≥750)
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show minting interface
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="default">Eligible</Badge>
          Mint Achievement NFT
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Wallet connected info (optional) */}
          {isConnected && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="text-sm text-green-800">
                🦊 MetaMask Connected: {connectedAddress?.slice(0, 6)}...{connectedAddress?.slice(-4)}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Achievement Type</Label>
            <Select value={achievementType} onValueChange={setAchievementType}>
              <SelectTrigger>
                <SelectValue placeholder="Select achievement type" />
              </SelectTrigger>
              <SelectContent>
                {/* Removed direct minting options */}
                <SelectItem value="Security Achievement">Security Achievement</SelectItem>
                <SelectItem value="Code Review Master">Code Review Master</SelectItem>
                <SelectItem value="DevOps Excellence">DevOps Excellence</SelectItem>
                <SelectItem value="Architecture Design">Architecture Design</SelectItem>
                <SelectItem value="UX Design Achievement">UX Design Achievement</SelectItem>
                <SelectItem value="Project Leadership">Project Leadership</SelectItem>
                <SelectItem value="Innovation Award">Innovation Award</SelectItem>
                <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                <SelectItem value="Mentorship Excellence">Mentorship Excellence</SelectItem>
                <SelectItem value="Technical Writing">Technical Writing</SelectItem>
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
            <div className="text-xs text-gray-500">
              {isConnected
                ? `Connected wallet: ${connectedAddress?.slice(0, 6)}...${connectedAddress?.slice(-4)} (or enter different address)`
                : "Enter the wallet address that will receive the NFT"
              }
            </div>
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
            <div className="text-xs text-gray-500">
              SCK Dynamic NFT contract on Sepolia testnet
            </div>
          </div>

          <div className="space-y-2">
            <Label>Role Agent Info</Label>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Name: {selectedAgent.name}</div>
              <div>DID: {selectedAgent.assignedToDid}</div>
              <div>Role: {selectedAgent.roleTemplate?.title || 'Unknown'}</div>
              <div>Trust Score: {selectedAgent.trustScore || 'N/A'}/1000</div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="text-sm text-blue-800">
              <strong>🏢 Organization-Controlled Minting:</strong> Only authorized organizations can issue credential NFTs to maintain trust and security. This NFT will be minted on Sepolia testnet and transferred to your specified address.
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>
          )}

          <Button
            onClick={mintNFT}
            disabled={isMinting || !recipientAddress || !contractAddress || !selectedAgent}
            className="w-full"
          >
            {isMinting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Organization Minting NFT...
              </>
            ) : (
              "🏢 Mint Credential NFT"
            )}
          </Button>

          <div className="space-y-2">
            <div className="text-xs text-gray-500 text-center">
              ✅ Organization controls credential issuance for trust and security. NFT will appear in the specified wallet.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 