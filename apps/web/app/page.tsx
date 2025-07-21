'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DigitalTwinFlow } from '@/components/digital-twin-flow';
import { AdminPanel } from '@/components/admin-panel';
import { TrustDashboard } from '@/components/trust-dashboard';
import { WalletProvider } from '@/components/wallet-provider';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Secure Code KnAIght</h1>
          <p className="text-lg text-gray-600">Trust-Based Digital Twin Management Platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="digital-twin">Digital Twin</TabsTrigger>
            <TabsTrigger value="trust-dashboard">Trust Dashboard</TabsTrigger>
            <TabsTrigger value="nft">NFT System</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <CardHeader className="flex flex-col space-y-1.5 p-6">
                  <CardTitle className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                    <Badge variant="secondary">Trust-Based</Badge>
                    Digital Twin Creation
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Create digital twins with trust score validation and role-based NFTs
                  </p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">1</div>
                      <span className="text-sm">Import DID with trust score</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">2</div>
                      <span className="text-sm">Validate against role thresholds</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">3</div>
                      <span className="text-sm">Mint eligible Digital Twin NFT</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold">4</div>
                      <span className="text-sm">Track achievements and certifications</span>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => setActiveTab('digital-twin')}
                  >
                    Start Digital Twin Creation →
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <CardHeader className="flex flex-col space-y-1.5 p-6">
                  <CardTitle className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
                    <Badge variant="secondary">Trust Dashboard</Badge>
                    Role-Based Credentialing
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manage trust thresholds and validate digital twin eligibility
                  </p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">Trust Score Validation</h4>
                      <p className="text-sm text-blue-700">Set minimum thresholds per role</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Eligibility Tracking</h4>
                      <p className="text-sm text-green-700">Monitor who can mint NFTs</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900">Role Management</h4>
                      <p className="text-sm text-purple-700">Configure trust requirements</p>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => setActiveTab('trust-dashboard')}
                  >
                    Open Trust Dashboard →
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <CardHeader className="flex flex-col space-y-1.5 p-6">
                <CardTitle className="text-2xl font-semibold leading-none tracking-tight">Wallet Connection Status</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Check your MetaMask connection status for blockchain features
                </p>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-2">Connection Debug Info</h3>
                  <div className="space-y-1 text-sm">
                    <div>Status: <Badge variant="secondary">Disconnected</Badge></div>
                    <div>Address: <span className="font-mono">None</span></div>
                    <div>MetaMask Available: <Badge variant="secondary">No</Badge></div>
                    <div>Connector Name: <span className="font-mono">MetaMask</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="digital-twin" className="space-y-6">
            <DigitalTwinFlow />
          </TabsContent>

          <TabsContent value="trust-dashboard" className="space-y-6">
            <TrustDashboard organizationId="cmd8mf9uu000088ddcsr5e2p7" />
          </TabsContent>

          <TabsContent value="nft" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>NFT System</CardTitle>
              </CardHeader>
              <CardContent>
                <p>NFT management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organization" className="space-y-6">
            <AdminPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
