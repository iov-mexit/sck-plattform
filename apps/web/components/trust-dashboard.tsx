'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TrustDashboardProps {
  organizationId: string;
}

export function TrustDashboard({ organizationId }: TrustDashboardProps) {
  const [activeView, setActiveView] = useState('overview');

  // Mock data
  const trustData = {
    totalTwins: 45,
    averageTrustScore: 87,
    eligibleForNFT: 32,
    pendingValidation: 8,
    trustThreshold: 75
  };

  const recentTwins = [
    { id: '1', name: 'Alice Johnson', trustScore: 92, role: 'Senior Developer', status: 'eligible' },
    { id: '2', name: 'Bob Smith', trustScore: 78, role: 'Junior Developer', status: 'pending' },
    { id: '3', name: 'Carol Davis', trustScore: 95, role: 'Team Lead', status: 'eligible' },
  ];

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
              <div className="space-y-3">
                {recentTwins.map((twin) => (
                  <div key={twin.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{twin.name}</div>
                      <div className="text-sm text-muted-foreground">{twin.role}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={twin.status === 'eligible' ? 'default' : 'secondary'}>
                        {twin.trustScore}%
                      </Badge>
                      <Badge variant={twin.status === 'eligible' ? 'default' : 'outline'}>
                        {twin.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
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