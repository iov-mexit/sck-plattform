'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import NFTMinting from '@/components/nft-minting';

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

export default function NFTMintingPage() {
  const [roleAgents, setRoleAgents] = useState<RoleAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<RoleAgent | null>(null);
  const [showOnlyEligible, setShowOnlyEligible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoleAgents();
  }, []);

  const fetchRoleAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/role-agents');
      const data = await response.json();

      if (data.success) {
        setRoleAgents(data.data || []);
      } else {
        setError(data.error || 'Failed to fetch role agents');
      }
    } catch (err) {
      setError('Failed to fetch role agents');
      console.error('Error fetching role agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEligibilityIcon = (agent: RoleAgent) => {
    if (agent.nftMinted) {
      return '✅'; // Already minted
    } else if (agent.isEligibleForMint) {
      return '🟢'; // Eligible
    } else if (agent.trustScore && agent.trustScore > 0) {
      return '🟡'; // Has score but not eligible
    } else {
      return '⚪'; // No score
    }
  };

  const getEligibilityText = (agent: RoleAgent) => {
    if (agent.nftMinted) {
      return 'NFT Minted';
    } else if (agent.isEligibleForMint) {
      return 'Eligible for Minting';
    } else if (agent.trustScore && agent.trustScore > 0) {
      return `Score: ${agent.trustScore}/1000 (needs ≥750)`;
    } else {
      return 'No Trust Score';
    }
  };

  const getEligibilityBadgeVariant = (agent: RoleAgent) => {
    if (agent.nftMinted) {
      return 'default' as const;
    } else if (agent.isEligibleForMint) {
      return 'default' as const;
    } else if (agent.trustScore && agent.trustScore > 0) {
      return 'secondary' as const;
    } else {
      return 'outline' as const;
    }
  };

  const filteredAgents = showOnlyEligible
    ? roleAgents.filter(agent => agent.isEligibleForMint && !agent.nftMinted)
    : roleAgents;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NFT Minting Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Select a role agent and mint achievement NFTs using your MetaMask wallet
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Digital Twins List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Role Agents</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showOnlyEligible"
                      checked={showOnlyEligible}
                      onChange={(e) => setShowOnlyEligible(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="showOnlyEligible" className="text-sm">
                      Show only eligible twins
                    </Label>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="text-red-600 text-sm mb-4">{error}</div>
                )}

                {filteredAgents.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500">
                      {showOnlyEligible
                        ? 'No eligible role agents found. Create agents with trust score ≥ 750.'
                        : 'No role agents found. Create some role agents first.'
                      }
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedAgent?.id === agent.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                        onClick={() => setSelectedAgent(agent)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{getEligibilityIcon(agent)}</span>
                            <div>
                              <div className="font-medium">{agent.name}</div>
                              <div className="text-sm text-gray-600 font-mono">
                                {agent.assignedDid}
                              </div>
                              <div className="text-sm text-gray-500">
                                {agent.roleTemplate?.title || 'Unknown Role'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={getEligibilityBadgeVariant(agent)}>
                              {getEligibilityText(agent)}
                            </Badge>
                            {agent.trustScore && (
                              <div className="text-xs text-gray-500 mt-1">
                                Score: {agent.trustScore}/1000
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* NFT Minting Panel */}
        <div className="lg:col-span-1">
          {selectedAgent ? (
            <NFTMinting
              roleAgent={selectedAgent}
              organizationId="test-org-1" // This should come from context
              onMintSuccess={(tokenId, transactionHash) => {
                // Refresh the twins list after successful minting
                fetchRoleAgents();
                setSelectedAgent(null);
              }}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>NFT Minting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    Select a role agent from the list to mint an achievement NFT
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>NFT Already Minted</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🟢</span>
                <span>Eligible for Minting (Score ≥ 750)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🟡</span>
                <span>Has Score (needs ≥ 750)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚪</span>
                <span>No Trust Score</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 