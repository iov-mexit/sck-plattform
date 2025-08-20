'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConnectWallet } from '@/components/ConnectWallet';
import NFTMinting from '@/components/nft-minting';

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

export default function NFTMintingPage() {
  const { isConnected, address } = useAccount();
  const [roleAgents, setRoleAgents] = useState<RoleAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<RoleAgent | null>(null);
  const [showOnlyEligible, setShowOnlyEligible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only load role agents if wallet is connected
    if (isConnected) {
      loadRoleAgents();
    }
  }, [isConnected]);

  const loadRoleAgents = async () => {
    try {
      console.log('🚀 Loading role agents...');

      const response = await fetch('/api/v1/role-agents?limit=20');
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setRoleAgents(data.data);
        console.log('✅ Loaded', data.data.length, 'role agents');
      } else {
        throw new Error(data.error || 'Failed to load role agents');
      }
    } catch (err) {
      console.error('❌ Error loading role agents:', err);
      setError(err instanceof Error ? err.message : 'Failed to load role agents');
    } finally {
      setIsLoaded(true);
    }
  };

  const filteredAgents = roleAgents.filter(agent =>
    showOnlyEligible ? agent.isEligibleForMint && !agent.nftMinted : true
  );

  const handleMintSuccess = () => {
    // Reload agents after successful mint
    loadRoleAgents();
    setSelectedAgent(null);
  };

  // Show wallet connection requirement if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">NFT Minting Dashboard</h1>

          <div className="max-w-md mx-auto">
            <ConnectWallet
              required={true}
              title="Wallet Required for NFT Minting"
              description="Connect your MetaMask wallet to view eligible role agents and mint achievement NFTs"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              🔒 NFT minting requires a connected wallet to ensure secure blockchain transactions
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NFT Minting Dashboard</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Connected:</span>
            <Badge variant="outline" className="font-mono">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Badge>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">❌ {error}</p>
            <Button
              onClick={loadRoleAgents}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              🔄 Retry
            </Button>
          </div>
        )}

        {!isLoaded ? (
          <div className="text-center py-8">
            <div className="text-gray-600">Loading role agents...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Role Agents List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Available Role Agents ({filteredAgents.length})</CardTitle>
                  <Button onClick={loadRoleAgents} variant="outline" size="sm">
                    🔄 Refresh
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="eligibleOnly"
                    checked={showOnlyEligible}
                    onChange={(e) => setShowOnlyEligible(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="eligibleOnly" className="text-sm text-gray-600 cursor-pointer">
                    Show only eligible agents
                  </label>
                </div>
              </CardHeader>
              <CardContent>
                {filteredAgents.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    {showOnlyEligible ? 'No eligible agents available' : 'No role agents found'}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedAgent?.id === agent.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => setSelectedAgent(agent)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{agent.name}</h3>
                            <p className="text-sm text-gray-600">{agent.assignedToDid}</p>
                            {agent.roleTemplate && (
                              <p className="text-xs text-gray-500 mt-1">
                                {agent.roleTemplate.title} • {agent.roleTemplate.category}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <Badge variant={agent.isEligibleForMint && !agent.nftMinted ? "default" : "secondary"}>
                              {agent.nftMinted ? '✅ NFT Minted' :
                                agent.isEligibleForMint ? '🎯 Eligible' : '⏳ Not Eligible'}
                            </Badge>
                            {agent.trustScore && (
                              <span className="text-xs text-gray-500">
                                Trust: {agent.trustScore}/1000
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* NFT Minting Interface */}
            <Card>
              <CardHeader>
                <CardTitle>NFT Minting Interface</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedAgent ? (
                  <NFTMinting
                    selectedAgent={selectedAgent}
                    onMintSuccess={handleMintSuccess}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>👆 Select a role agent to begin minting</p>
                    <p className="text-sm mt-2">
                      Choose an eligible agent from the list to mint an achievement NFT
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 