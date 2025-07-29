import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface RoleTemplate {
  id: string;
  title: string;
  category: string;
  focus: string;
}

interface DigitalTwin {
  id: string;
  name: string;
  assignedDid: string;
  trustScore?: number;
  isEligibleForMint: boolean;
  nftMinted: boolean;
  nftTokenId?: string;
  nftContractAddress?: string;
  roleTemplateId: string;
  organizationId: string;
  status: "active" | "inactive";
  createdAt: string;
  roleTemplate?: {
    title: string;
    category: string;
  };
  organization?: {
    name: string;
  };
}

interface DigitalTwinCreatorProps {
  organizationId: string;
  onTwinCreated?: (twin: DigitalTwin) => void;
}

export function DigitalTwinCreator({ organizationId, onTwinCreated }: DigitalTwinCreatorProps) {
  const [formData, setFormData] = useState({
    name: '',
    assignedDid: '',
    roleTemplateId: '',
    description: '',
    trustScore: '',
  });

  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdTwin, setCreatedTwin] = useState<DigitalTwin | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<{
    message: string;
    existingDigitalTwin: any;
  } | null>(null);

  // NFT Minting Options
  const [nftOptions, setNftOptions] = useState({
    autoMintIfEligible: false,
    addToReviewQueue: false,
  });

  useEffect(() => {
    fetchRoleTemplates();
  }, []);

  const fetchRoleTemplates = async () => {
    try {
      const response = await fetch('/api/v1/role-templates');
      const data = await response.json();

      if (data.success) {
        setRoleTemplates(data.data);
      } else {
        console.error('Failed to fetch role templates:', data.error);
      }
    } catch (err) {
      console.error('Error fetching role templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.assignedDid || !formData.roleTemplateId) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      setDuplicateWarning(null);

      // Parse trust score if provided
      const trustScore = formData.trustScore ? parseInt(formData.trustScore) : undefined;

      const response = await fetch('/api/v1/digital-twins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
          roleTemplateId: formData.roleTemplateId,
          assignedToDid: formData.assignedDid,
          name: formData.name,
          description: formData.description,
          trustScore, // From Secure Code Warrior (or test input)
          nftOptions: {
            autoMintIfEligible: nftOptions.autoMintIfEligible,
            addToReviewQueue: nftOptions.addToReviewQueue,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCreatedTwin(data.data);
        onTwinCreated?.(data.data);

        // Reset form
        setFormData({
          name: '',
          assignedDid: '',
          roleTemplateId: '',
          description: '',
          trustScore: '',
        });
        setNftOptions({
          autoMintIfEligible: false,
          addToReviewQueue: false,
        });
      } else if (data.error === 'DUPLICATE_DID') {
        // Show duplicate warning instead of error
        setDuplicateWarning({
          message: data.message,
          existingDigitalTwin: data.existingDigitalTwin,
        });
      } else {
        setError(data.error || 'Failed to create digital twin');
      }
    } catch (err) {
      setError('Failed to create digital twin');
      console.error('Digital twin creation error:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDidChange = (did: string) => {
    setFormData({ ...formData, assignedDid: did });
    // Clear duplicate warning when DID changes
    setDuplicateWarning(null);
  };

  const handleMintSuccess = (tokenId: string, transactionHash: string) => {
    if (createdTwin) {
      setCreatedTwin({
        ...createdTwin,
        nftMinted: true,
        nftTokenId: tokenId,
        nftContractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Digital Twin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Create Digital Twin</span>
            <Badge variant="secondary">DID-Based Identity</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Digital Twin Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Security Engineer Digital Twin"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="did">DID (Decentralized Identifier)</Label>
                <Input
                  id="did"
                  type="text"
                  placeholder="did:ethr:0x..."
                  value={formData.assignedDid}
                  onChange={(e) => handleDidChange(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  DID represents the human identity (no personal data stored)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role Template</Label>
              <Select value={formData.roleTemplateId} onValueChange={(value) => setFormData({ ...formData, roleTemplateId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role template" />
                </SelectTrigger>
                <SelectContent>
                  {roleTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <span>{template.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this digital twin's purpose..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trustScore">Trust Score (0-1000)</Label>
              <Input
                id="trustScore"
                type="number"
                min="0"
                max="1000"
                placeholder="e.g., 850"
                value={formData.trustScore}
                onChange={(e) => setFormData({ ...formData, trustScore: e.target.value })}
              />
              <p className="text-xs text-gray-500">
                Trust score from Secure Code Warrior or other sources (≥750 enables NFT minting)
              </p>
            </div>

            {/* NFT Minting Options */}
            <div className="space-y-3 border-t pt-4">
              <Label className="text-base font-medium">NFT Minting Options</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoMint"
                    checked={nftOptions.autoMintIfEligible}
                    onChange={(e) =>
                      setNftOptions({ ...nftOptions, autoMintIfEligible: (e.target as HTMLInputElement).checked })
                    }
                  />
                  <Label htmlFor="autoMint" className="text-sm font-normal">
                    Mint NFT immediately if trust score ≥ 750
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reviewQueue"
                    checked={nftOptions.addToReviewQueue}
                    onChange={(e) =>
                      setNftOptions({ ...nftOptions, addToReviewQueue: (e.target as HTMLInputElement).checked })
                    }
                  />
                  <Label htmlFor="reviewQueue" className="text-sm font-normal">
                    Add to "Eligible for Minting" review queue
                  </Label>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Leave both unchecked to create twin only (no NFT minting)
              </p>
            </div>

            {duplicateWarning && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      DID Already Exists
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>{duplicateWarning.message}</p>
                      <p className="mt-1">
                        Existing twin: <strong>{duplicateWarning.existingDigitalTwin.name}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <Button
              type="submit"
              disabled={creating}
              className="w-full"
            >
              {creating ? 'Creating Digital Twin...' : 'Create Digital Twin'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {createdTwin && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Digital Twin Created Successfully</span>
                <Badge variant="default">✅</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Name:</span>
                  <span className="text-sm text-gray-600">{createdTwin.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">DID:</span>
                  <span className="text-sm text-gray-600 font-mono">{createdTwin.assignedDid}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Role:</span>
                  <span className="text-sm text-gray-600">{createdTwin.roleTemplate?.title || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trust Score:</span>
                  <span className="text-sm text-gray-600">{createdTwin.trustScore || 'N/A'}/1000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">NFT Eligibility:</span>
                  <Badge variant={createdTwin.isEligibleForMint ? "default" : "secondary"}>
                    {createdTwin.isEligibleForMint ? "Eligible" : "Not Eligible"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 