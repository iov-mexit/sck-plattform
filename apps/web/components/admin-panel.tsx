'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function AdminPanel() {
  const [stats, setStats] = useState({
    organizations: 0,
    roleAgents: 0,
    roleTemplates: 0,
    signals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Simulate API calls or fetch real stats
        setStats({
          organizations: 1,
          roleAgents: 2,
          roleTemplates: 35,
          signals: 5
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.organizations}</div>
            <div className="text-sm text-muted-foreground">Organizations</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.roleAgents}</div>
            <div className="text-sm text-muted-foreground">Role Agents</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.roleTemplates}</div>
            <div className="text-sm text-muted-foreground">Role Templates</div>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{stats.signals}</div>
            <div className="text-sm text-muted-foreground">Trust Signals</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">View All Organizations</Button>
            <Button variant="outline" size="sm">Manage Role Templates</Button>
            <Button variant="outline" size="sm">System Health Check</Button>
            <Button variant="outline" size="sm">Export Data</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 