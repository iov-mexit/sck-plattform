import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Building, Target } from 'lucide-react';

interface DashboardMetrics {
  totalRoleTemplates: number;
  totalRoleAgents: number;
  totalOrganizations: number;
  uniqueRoleCategories: number;
}

export function DashboardOverview() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);

        // Fetch real data from database
        const [roleTemplatesRes, digitalTwinsRes, organizationsRes] = await Promise.all([
          fetch('/api/v1/role-templates'),
          fetch('/api/v1/role-agents'),
          fetch('/api/v1/organizations')
        ]);

        const roleTemplates = await roleTemplatesRes.json();
        const roleAgents = await digitalTwinsRes.json();
        const organizations = await organizationsRes.json();

        // Calculate real metrics from actual data
        const uniqueCategories = new Set(roleTemplates.data?.map((template: any) => template.category) || []);

        setMetrics({
          totalRoleTemplates: roleTemplates.data?.length || 0,
          totalRoleAgents: roleAgents.data?.length || 0,
          totalOrganizations: organizations.data?.length || 0,
          uniqueRoleCategories: uniqueCategories.size
        });
      } catch (err) {
        setError('Failed to load dashboard metrics');
        console.error('Dashboard metrics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const metricCards = [
    {
      title: 'Organizations',
      value: metrics.totalOrganizations,
      icon: Building,
      description: 'Registered organizations',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Role Templates',
      value: metrics.totalRoleTemplates,
      icon: Users,
      description: 'Available security roles',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Role Agents',
      value: metrics.totalRoleAgents,
      icon: Shield,
      description: 'Active digital identities',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Role Categories',
      value: metrics.uniqueRoleCategories,
      icon: Target,
      description: 'Different role types',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">
          Current data from your SCK platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 