'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TrustDashboardProps {
  organizationId: string;
}

interface DigitalTwin {
  id: string;
  name: string;
  assignedDid: string;
  trustScore?: number;
  isEligibleForMint: boolean;
  status: 'active' | 'inactive';
  roleTemplate?: {
    title: string;
    category: string;
  };
  createdAt: string;
}

interface TrustData {
  totalTwins: number;
  averageTrustScore: number;
  eligibleForNFT: number;
  pendingValidation: number;
  trustThreshold: number;
}

export function TrustDashboard({ organizationId }: TrustDashboardProps) {
  const [activeView, setActiveView] = useState('overview');
  const [trustData, setTrustData] = useState<TrustData | null>(null);
  const [recentTwins, setRecentTwins] = useState<DigitalTwin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrustData = async () => {
      try {
        setLoading(true);
        
        // Fetch digital twins for this organization
        const response = await fetch(`/api/v1/digital-twins?organizationId=${organizationId}`);
        
        if (response.ok) {
          const data = await response.json();
          const twins: DigitalTwin[] = data.data || [];
          
          // Calculate trust metrics from real data
          const totalTwins = twins.length;
          const eligibleForNFT = twins.filter(twin => twin.isEligibleForMint).length;
          const pendingValidation = twins.filter(twin => !twin.trustScore).length;
          
          const trustScores = twins
            .map(twin => twin.trustScore)
            .filter(score => score !== undefined && score !== null) as number[];
          
          const averageTrustScore = trustScores.length > 0 
            ? Math.round(trustScores.reduce((sum, score) => sum + score, 0) / trustScores.length)
            : 0;
          
          // Default trust threshold (could be fetched from organization settings)
          const trustThreshold = 75;
          
          setTrustData({
            totalTwins,
            averageTrustScore,
            eligibleForNFT,
            pendingValidation,
            trustThreshold
          });
          
          // Get recent twins (last 5 created)
          const recent = twins
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
          
          setRecentTwins(recent);
        } else {
          throw new Error('Failed to fetch trust data');
        }
      } catch (err) {
        setError('Failed to load trust dashboard data');
        console.error('Trust dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrustData();
  }, [organizationId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Trust Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-100 rounded"></div>
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
            <CardTitle>Trust Dashboard</CardTitle>
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

  if (!trustData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Trust Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">No trust data available</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary">Organization ID: {organizationId}</Badge>
            Trust Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trust Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{trustData.totalTwins}</div>
                <div className="text-sm text-muted-foreground">Total Digital Twins</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{trustData.averageTrustScore}%</div>
                <div className="text-sm text-muted-foreground">Average Trust Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">{trustData.eligibleForNFT}</div>
                <div className="text-sm text-muted-foreground">Eligible for NFT</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">{trustData.pendingValidation}</div>
                <div className="text-sm text-muted-foreground">Pending Validation</div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Threshold */}
          <Card>
            <CardHeader>
              <CardTitle>Trust Threshold Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-2">Current Threshold</div>
                  <div className="text-2xl font-bold">{trustData.trustThreshold}%</div>
                </div>
                <Button variant="outline">Update Threshold</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Digital Twins */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Digital Twins</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTwins.length > 0 ? (
                <div className="space-y-3">
                  {recentTwins.map((twin) => (
                    <div key={twin.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{twin.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {twin.roleTemplate?.title || 'Unknown Role'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={twin.trustScore ? 'default' : 'secondary'}>
                          {twin.trustScore || 'N/A'}%
                        </Badge>
                        <Badge variant={twin.isEligibleForMint ? 'default' : 'outline'}>
                          {twin.isEligibleForMint ? 'Eligible' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-sm">No digital twins found</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button>Export Trust Report</Button>
            <Button variant="outline">View All Twins</Button>
            <Button variant="outline">Configure Alerts</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 