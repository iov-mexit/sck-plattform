'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Shield,
  Activity,
  BarChart3,
  RefreshCw,
  AlertCircle,
  Calendar,
  Filter
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface AnalyticsMetrics {
  totalRoleAgents: number;
  averageTrustScore: number;
  activeSignals: number;
  mintedNFTs: number;
  eligibleForMinting: number;
  activeAgents: number;
  totalOrganizations: number;
}

interface TrustScoreData {
  date: string;
  averageTrust: number;
  agentCount: number;
}

interface ActivityData {
  date: string;
  agentsCreated: number;
  trustUpdates: number;
  nftsMinted: number;
}

interface CategoryData {
  category: string;
  count: number;
  fill: string;
}

interface RoleAgent {
  id: string;
  name: string;
  trustScore?: number;
  status: string;
  isEligibleForMint: boolean;
  soulboundTokenId?: string;
  lastTrustCheck?: string;
  createdAt: string;
}

interface RecentActivity {
  id: string;
  type: 'agent_created' | 'nft_minted' | 'trust_updated' | 'signal_received';
  title: string;
  description: string;
  timestamp: string;
  agentName?: string;
}

const CATEGORY_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
];

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [trustTrendData, setTrustTrendData] = useState<TrustScoreData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('7d');

  const fetchAnalyticsData = async () => {
    try {
      setError(null);

      // Fetch all required data in parallel
      const [roleAgentsRes, roleTemplatesRes, organizationsRes] = await Promise.all([
        fetch('/api/v1/role-agents?limit=100'),
        fetch('/api/v1/role-templates'),
        fetch('/api/v1/organizations')
      ]);

      const roleAgentsData = await roleAgentsRes.json();
      const roleTemplatesData = await roleTemplatesRes.json();
      const organizationsData = await organizationsRes.json();

      if (!roleAgentsData.success || !roleTemplatesData.success || !organizationsData.success) {
        throw new Error('Failed to fetch analytics data');
      }

      const roleAgents = roleAgentsData.data || [];
      const roleTemplates = roleTemplatesData.data || [];
      const organizations = organizationsData.data || [];

      // Calculate metrics
      const totalRoleAgents = roleAgents.length;
      const agentsWithTrustScores = roleAgents.filter((agent: RoleAgent) => agent.trustScore && agent.trustScore > 0);
      const averageTrustScore = agentsWithTrustScores.length > 0
        ? Math.round((agentsWithTrustScores.reduce((sum: number, agent: RoleAgent) => sum + (agent.trustScore || 0), 0) / agentsWithTrustScores.length) / 100 * 10) / 10
        : 0;
      const mintedNFTs = roleAgents.filter((agent: RoleAgent) => agent.soulboundTokenId).length;
      const eligibleForMinting = roleAgents.filter((agent: RoleAgent) => agent.isEligibleForMint).length;
      const activeAgents = roleAgents.filter((agent: RoleAgent) => agent.status === 'active').length;
      const activeSignals = totalRoleAgents * 2; // Estimate

      setMetrics({
        totalRoleAgents,
        averageTrustScore,
        activeSignals,
        mintedNFTs,
        eligibleForMinting,
        activeAgents,
        totalOrganizations: organizations.length
      });

      // Generate trust trend data (simulated time series based on current data)
      const days = dateRange === '30d' ? 30 : dateRange === '7d' ? 7 : 1;
      const trendData: TrustScoreData[] = [];
      const now = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Simulate trust score evolution (slightly lower in the past)
        const variation = (Math.random() - 0.5) * 0.5;
        const baseScore = averageTrustScore * (0.9 + (days - i) / days * 0.1);

        trendData.push({
          date: date.toISOString().split('T')[0],
          averageTrust: Math.max(0, Math.min(10, baseScore + variation)),
          agentCount: Math.floor(totalRoleAgents * (0.7 + (days - i) / days * 0.3))
        });
      }
      setTrustTrendData(trendData);

      // Generate activity data
      const activityTrend: ActivityData[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        activityTrend.push({
          date: date.toISOString().split('T')[0],
          agentsCreated: Math.floor(Math.random() * 5),
          trustUpdates: Math.floor(Math.random() * 8),
          nftsMinted: Math.floor(Math.random() * 3)
        });
      }
      setActivityData(activityTrend);

      // Generate category distribution data
      const templatesByCategory = roleTemplates.reduce((acc: Record<string, number>, template: any) => {
        const category = template.category || 'Other';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const categoryChartData: CategoryData[] = Object.entries(templatesByCategory)
        .map(([category, count], index) => ({
          category,
          count: count as number,
          fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
        }));
      setCategoryData(categoryChartData);

      // Generate recent activity from real data
      const recentActivityData: RecentActivity[] = [];

      // Add recent role agents
      const recentAgents = roleAgents
        .sort((a: RoleAgent, b: RoleAgent) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);

      recentAgents.forEach((agent: RoleAgent) => {
        recentActivityData.push({
          id: `agent-${agent.id}`,
          type: 'agent_created',
          title: 'New role agent created',
          description: `"${agent.name}" role agent added to system`,
          timestamp: agent.createdAt,
          agentName: agent.name
        });
      });

      // Add agents with recent trust score updates
      const agentsWithRecentTrustUpdates = roleAgents
        .filter((agent: RoleAgent) => agent.lastTrustCheck && agent.trustScore)
        .sort((a: RoleAgent, b: RoleAgent) => new Date(b.lastTrustCheck || '').getTime() - new Date(a.lastTrustCheck || '').getTime())
        .slice(0, 2);

      agentsWithRecentTrustUpdates.forEach((agent: RoleAgent) => {
        recentActivityData.push({
          id: `trust-${agent.id}`,
          type: 'trust_updated',
          title: 'Trust score updated',
          description: `Role agent "${agent.name}" score: ${agent.trustScore}/1000`,
          timestamp: agent.lastTrustCheck || '',
          agentName: agent.name
        });
      });

      // Sort activity by timestamp
      const sortedActivity = recentActivityData
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

      setRecentActivity(sortedActivity);

    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalyticsData();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'agent_created':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'nft_minted':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'trust_updated':
        return <Shield className="h-4 w-4 text-purple-600" />;
      case 'signal_received':
        return <Activity className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'agent_created':
        return 'bg-blue-100';
      case 'nft_minted':
        return 'bg-green-100';
      case 'trust_updated':
        return 'bg-purple-100';
      case 'signal_received':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">
            Trust metrics, activity charts, and performance insights
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading analytics data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">
              Trust metrics, activity charts, and performance insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading analytics data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Role Agents</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalRoleAgents}</p>
                <p className="text-xs text-gray-500">{metrics.activeAgents} active</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Trust Score</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.averageTrustScore}</p>
                <p className="text-xs text-gray-500">/10 scale</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Signals</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeSignals}</p>
                <p className="text-xs text-gray-500">estimated</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Minted NFTs</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.mintedNFTs}</p>
                <p className="text-xs text-gray-500">{metrics.eligibleForMinting} eligible</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Trust Score Trends */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust Score Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trustTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number, name: string) => [
                    name === 'averageTrust' ? `${value.toFixed(1)}/10` : value,
                    name === 'averageTrust' ? 'Average Trust' : 'Agent Count'
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="averageTrust"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Average Trust Score"
                />
                <Line
                  type="monotone"
                  dataKey="agentCount"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Agent Count"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="agentsCreated"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  name="Agents Created"
                />
                <Area
                  type="monotone"
                  dataKey="trustUpdates"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  name="Trust Updates"
                />
                <Area
                  type="monotone"
                  dataKey="nftsMinted"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  name="NFTs Minted"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Role Category Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Role Category Distribution */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Template Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} (${((percent || 0) * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${getActivityBgColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 