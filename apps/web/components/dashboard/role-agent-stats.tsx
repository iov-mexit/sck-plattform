import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RoleAgent {
  id: string;
  name: string;
  roleTemplateId: string;
  assignedToDid: string;
  description?: string;
  createdAt: string;
}

interface RoleTemplate {
  id: string;
  title: string;
  category: string;
}

export function RoleAgentStats() {
  const [roleAgents, setRoleAgents] = useState<RoleAgent[]>([]);
  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [twinsRes, rolesRes] = await Promise.all([
          fetch('/api/v1/role-agents'),
          fetch('/api/v1/role-templates')
        ]);

        if (twinsRes.ok && rolesRes.ok) {
          const twinsData = await twinsRes.json();
          const rolesData = await rolesRes.json();

          setRoleAgents(twinsData.data || []);
          setRoleTemplates(rolesData.data || []);
        } else {
          throw new Error('Failed to fetch role agent data');
        }
      } catch (err) {
        setError('Failed to load role agent statistics');
        console.error('Role agent stats error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRoleCategoryStats = () => {
    const roleMap = new Map(roleTemplates.map(role => [role.id, role]));

    const categoryCount = roleAgents.reduce((acc, agent) => {
      const role = roleMap.get(agent.roleTemplateId);
      if (role) {
        acc[role.category] = (acc[role.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / roleAgents.length) * 100)
    }));
  };

  const getRecentAgents = () => {
    return roleAgents
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const categoryStats = getRoleCategoryStats();
  const recentAgents = getRecentAgents();
  const totalAgents = roleAgents.length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Agent Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
            <div className="h-24 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Role Agent Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Agent Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{totalAgents}</div>
              <div className="text-sm text-indigo-600">Total Agents</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{categoryStats.length}</div>
              <div className="text-sm text-emerald-600">Role Categories</div>
            </div>
          </div>

          {/* Category Distribution Chart */}
          {categoryStats.length > 0 ? (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Role Category Distribution</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-sm">No role agents found</div>
            </div>
          )}

          {/* Recent Role Agents */}
          {recentAgents.length > 0 ? (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Role Agents</h4>
              <div className="space-y-2">
                {recentAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-sm">{agent.name}</div>
                      <div className="text-xs text-gray-500">{agent.assignedToDid}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-400 text-sm">No role agents found</div>
              <div className="text-gray-400 text-xs mt-1">Create role agents to see statistics</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 