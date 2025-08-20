'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface TrustDashboardProps {
  organizationId: string;
}

interface RoleAgent {
  id: string;
  name: string;
  assignedToDid: string;
  trustScore: number;
  roleTemplate: {
    title: string;
    category: string;
  };
  organization: {
    name: string;
  };
  createdAt: string;
}

interface DashboardStats {
  totalRoleAgents: number;
  averageTrustScore: number;
  eligibleForMint: number;
  recentRoleAgents: RoleAgent[];
}

export function TrustDashboard({ organizationId }: TrustDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch role agents for this organization
        const response = await fetch(`/api/v1/role-agents?organizationId=${organizationId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch role agents: ${response.status}`);
        }

        const data = await response.json();
        const roleAgents = data.roleAgents || [];

        // Calculate statistics
        const totalRoleAgents = roleAgents.length;
        const averageTrustScore = totalRoleAgents > 0
          ? roleAgents.reduce((sum: number, agent: RoleAgent) => sum + (agent.trustScore || 0), 0) / totalRoleAgents
          : 0;
        const eligibleForMint = roleAgents.filter((agent: RoleAgent) => (agent.trustScore || 0) >= 750).length;
        const recentRoleAgents = roleAgents
          .sort((a: RoleAgent, b: RoleAgent) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setStats({
          totalRoleAgents,
          averageTrustScore: Math.round(averageTrustScore),
          eligibleForMint,
          recentRoleAgents
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    if (organizationId) {
      fetchDashboardData();
    }
  }, [organizationId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️ Error Loading Dashboard</div>
            <div className="text-sm text-gray-600">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            No dashboard data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Role Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalRoleAgents}
            </div>
            <div className="text-sm text-muted-foreground">Total Role Agents</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Trust Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.averageTrustScore}
            </div>
            <div className="text-sm text-muted-foreground">Average Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              NFT Eligible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.eligibleForMint}
            </div>
            <div className="text-sm text-muted-foreground">Ready for Minting</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Role Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Role Agents</CardTitle>
          <CardDescription>
            Latest role agent assignments in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentRoleAgents.length > 0 ? (
            <div className="space-y-4">
              {stats.recentRoleAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {agent.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {agent.roleTemplate.title} • {agent.roleTemplate.category}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      DID: {agent.assignedToDid.substring(0, 20)}...
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${(agent.trustScore || 0) >= 750
                        ? 'text-green-600'
                        : (agent.trustScore || 0) >= 500
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                      Trust Score: {agent.trustScore || 0}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm">No role agents found</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 