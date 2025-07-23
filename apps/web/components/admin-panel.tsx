'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('organizations');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Create Organization</h3>
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" placeholder="Enter organization name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgType">Organization Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="nonprofit">Non-Profit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Create Organization</Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Trust Thresholds</h3>
              <div className="space-y-2">
                <Label htmlFor="minTrust">Minimum Trust Score</Label>
                <Input id="minTrust" type="number" placeholder="75" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleTrust">Role-Specific Threshold</Label>
                <Input id="roleTrust" type="number" placeholder="85" />
              </div>
              <Button variant="outline">Update Thresholds</Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Organization Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Total Organizations</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm text-muted-foreground">Digital Twins</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">89%</div>
                  <div className="text-sm text-muted-foreground">Average Trust Score</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 