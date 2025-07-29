import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card';
import { Badge } from '@/components/common/badge';
import { DigitalTwinCreator } from '@/components/digital-twin-creator';
import { TrustDashboard } from '@/components/trust-dashboard';

interface DigitalTwin {
  id: string;
  name: string;
  roleTemplateId: string;
  assignedDid: string;
  organizationId: string;
  description?: string;
  status: 'active' | 'inactive';
  trustScore?: number;
  isEligibleForMint: boolean;
  nftMinted: boolean;
  nftTokenId?: string;
  nftContractAddress?: string;
  roleTemplate?: {
    title: string;
    category: string;
  };
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  description: string;
  domain: string;
  isActive: boolean;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export function OrganizationDashboard() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [digitalTwins, setDigitalTwins] = useState<DigitalTwin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch organizations and digital twins
        const [orgsRes, twinsRes] = await Promise.all([
          fetch('/api/v1/organizations'),
          fetch('/api/v1/digital-twins')
        ]);

        if (orgsRes.ok && twinsRes.ok) {
          const orgsData = await orgsRes.json();
          const twinsData = await twinsRes.json();

          // Use first organization or show empty state
          const firstOrg = orgsData.data?.[0] || null;
          setOrganization(firstOrg);
          setDigitalTwins(twinsData.data || []);
        } else {
          throw new Error('Failed to fetch organization data');
        }
      } catch (err) {
        setError('Failed to load organization data');
        console.error('Organization dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTwinCreated = (newTwin: DigitalTwin) => {
    setDigitalTwins(prev => [newTwin, ...prev]);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-red-600">
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">No organization found</div>
              <div className="text-gray-400 text-xs mt-1">Please create an organization first</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Organization Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary">Organization</Badge>
            {organization.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Domain</div>
              <div className="text-sm">{organization.domain}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Status</div>
              <Badge variant={organization.isActive ? 'default' : 'secondary'}>
                {organization.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Digital Twins</div>
              <div className="text-sm">{digitalTwins.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Dashboard */}
      <TrustDashboard organizationId={organization.id} />

      {/* Digital Twin Creation */}
      <DigitalTwinCreator 
        organizationId={organization.id}
        onTwinCreated={handleTwinCreated}
      />

      {/* Digital Twins List */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Twins</CardTitle>
        </CardHeader>
        <CardContent>
          {digitalTwins.length > 0 ? (
            <div className="space-y-3">
              {digitalTwins.map((twin) => (
                <div key={twin.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{twin.name}</div>
                    <div className="text-sm text-gray-500">
                      {twin.roleTemplate?.title || 'Unknown Role'} • {twin.assignedDid}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={twin.trustScore ? 'default' : 'secondary'}>
                      {twin.trustScore || 'N/A'}%
                    </Badge>
                    <Badge variant={twin.isEligibleForMint ? 'default' : 'outline'}>
                      {twin.isEligibleForMint ? 'Eligible' : 'Pending'}
                    </Badge>
                    {twin.nftMinted && (
                      <Badge variant="default">NFT Minted</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">No digital twins found</div>
              <div className="text-gray-400 text-xs mt-1">Create your first digital twin above</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 