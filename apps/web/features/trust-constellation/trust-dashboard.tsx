'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DigitalTwin {
  id: string;
  name: string;
  assignedToDid: string;
  assignedTo?: string;
  trustScore?: number;
  isEligibleForMint: boolean;
  status: string;
  roleTemplate: {
    title: string;
    category: string;
  };
  lastTrustCheck?: string;
}

interface RoleTrustThreshold {
  id: string;
  roleTitle: string;
  minTrustScore: number;
  isActive: boolean;
}

interface TrustDashboardProps {
  organizationId: string;
}

export function TrustDashboard({ organizationId }: TrustDashboardProps) {
  const [digitalTwins, setDigitalTwins] = useState<DigitalTwin[]>([]);
  const [thresholds, setThresholds] = useState<RoleTrustThreshold[]>([]);
  const [loading, setLoading] = useState(true);
  const [importForm, setImportForm] = useState({
    did: '',
    assignedTo: '',
    trustScore: '',
    roleTitle: '',
    roleTemplateId: '',
  });

  // Fetch digital twins
  const fetchDigitalTwins = useCallback(async () => {
    try {
      const response = await fetch(`/api/v1/digital-twins?organizationId=${organizationId}`);
      const data = await response.json();
      if (data.success) {
        setDigitalTwins(data.data);
      }
    } catch (error) {
      console.error('Error fetching digital twins:', error);
    }
  }, [organizationId]);

  // Fetch trust thresholds
  const fetchThresholds = useCallback(async () => {
    try {
      const response = await fetch(`/api/v1/role-trust-thresholds?organizationId=${organizationId}`);
      const data = await response.json();
      if (data.success) {
        setThresholds(data.data);
      }
    } catch (error) {
      console.error('Error fetching thresholds:', error);
    }
  }, [organizationId]);

  // Import digital twin
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/v1/twin-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
          ...importForm,
          trustScore: parseFloat(importForm.trustScore),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Digital twin imported successfully!');
        setImportForm({
          did: '',
          assignedTo: '',
          trustScore: '',
          roleTitle: '',
          roleTemplateId: '',
        });
        fetchDigitalTwins();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error importing digital twin:', error);
      alert('Failed to import digital twin');
    }
  };

  // Update trust threshold
  const handleUpdateThreshold = async (roleTitle: string, minTrustScore: number) => {
    try {
      const response = await fetch('/api/v1/role-trust-thresholds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
          roleTitle,
          minTrustScore,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchThresholds();
        fetchDigitalTwins(); // Re-evaluate eligibility
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating threshold:', error);
      alert('Failed to update threshold');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDigitalTwins(), fetchThresholds()]);
      setLoading(false);
    };
    loadData();
  }, [organizationId, fetchDigitalTwins, fetchThresholds]);

  const getTrustStatus = (twin: DigitalTwin) => {
    const threshold = thresholds.find(t => t.roleTitle === twin.roleTemplate.title);
    const minScore = threshold?.minTrustScore || 0;
    const score = twin.trustScore || 0;

    if (score >= minScore) {
      return { status: 'eligible', text: `✅ ${score}/${minScore}`, color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'ineligible', text: `❌ ${score}/${minScore}`, color: 'bg-red-100 text-red-800' };
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading trust dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Trust Dashboard</h2>
        <Badge variant="outline">
          {digitalTwins.length} Digital Twins
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="import">Import Twins</TabsTrigger>
          <TabsTrigger value="thresholds">Trust Thresholds</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {digitalTwins.map((twin) => {
              const trustStatus = getTrustStatus(twin);
              return (
                <Card key={twin.id} className="relative">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{twin.name}</span>
                      <Badge
                        className={trustStatus.color}
                        variant="secondary"
                      >
                        {trustStatus.text}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>DID:</strong> {twin.assignedToDid.slice(0, 20)}...
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Role:</strong> {twin.roleTemplate.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Status:</strong> {twin.status}
                    </div>
                    {twin.assignedTo && (
                      <div className="text-sm text-gray-600">
                        <strong>Assigned To:</strong> {twin.assignedTo}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        size="sm"
                        disabled={!twin.isEligibleForMint}
                        className="flex-1"
                      >
                        {twin.isEligibleForMint ? 'Mint NFT' : 'Not Eligible'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fetchDigitalTwins()}
                      >
                        Re-check
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Digital Twin</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImport} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="did">DID</Label>
                    <Input
                      id="did"
                      value={importForm.did}
                      onChange={(e) => setImportForm({ ...importForm, did: e.target.value })}
                      placeholder="did:ethr:0x..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
                    <Input
                      id="assignedTo"
                      value={importForm.assignedTo}
                      onChange={(e) => setImportForm({ ...importForm, assignedTo: e.target.value })}
                      placeholder="Email, HR ID, or wallet"
                    />
                  </div>
                  <div>
                    <Label htmlFor="trustScore">Trust Score</Label>
                    <Input
                      id="trustScore"
                      type="number"
                      min="0"
                      max="100"
                      value={importForm.trustScore}
                      onChange={(e) => setImportForm({ ...importForm, trustScore: e.target.value })}
                      placeholder="0-100"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="roleTitle">Role Title</Label>
                    <Input
                      id="roleTitle"
                      value={importForm.roleTitle}
                      onChange={(e) => setImportForm({ ...importForm, roleTitle: e.target.value })}
                      placeholder="Developer, Analyst, etc."
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Import Digital Twin
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Trust Thresholds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {thresholds.map((threshold) => (
                  <div key={threshold.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{threshold.roleTitle}</h3>
                      <p className="text-sm text-gray-600">Minimum trust score required</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={threshold.minTrustScore}
                        onChange={(e) => {
                          const newThresholds = thresholds.map(t =>
                            t.id === threshold.id
                              ? { ...t, minTrustScore: parseFloat(e.target.value) }
                              : t
                          );
                          setThresholds(newThresholds);
                        }}
                        className="w-20"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateThreshold(threshold.roleTitle, threshold.minTrustScore)}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 