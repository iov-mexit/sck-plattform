'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Shield,
  TrendingUp,
  Zap,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Network,
  Coins,
  Bot,
  Activity,
  Home,
  Settings,
  Lock
} from 'lucide-react';
import { ServiceCarousel } from '@/components/dashboard/service-carousel';
// import { QuickActions } from '@/components/dashboard/quick-actions';
// import { ActivityFeed } from '@/components/dashboard/activity-feed';

interface DashboardStats {
  totalAgents: number;
  eligibleAgents: number;
  totalOrganizations: number;
  totalTemplates: number;
  totalPolicies: number;
  pendingApprovals: number;
  activeMCPs: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAgents: 0,
    eligibleAgents: 0,
    totalOrganizations: 0,
    totalTemplates: 0,
    totalPolicies: 0,
    pendingApprovals: 0,
    activeMCPs: 0
  });
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'new' | 'active' | 'advanced'>('active');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load organizations
      const orgsResponse = await fetch('/api/v1/organizations');
      const orgsData = await orgsResponse.json();

      // Load role agents
      const agentsResponse = await fetch('/api/v1/role-agents?limit=100');
      const agentsData = await agentsResponse.json();

      // Load role templates
      const templatesResponse = await fetch('/api/v1/role-templates');
      const templatesData = await templatesResponse.json();

      // Load LoA policies
      const loaResponse = await fetch('/api/v1/loa/policies');
      const loaData = await loaResponse.json();

      // Load MCP policies
      const mcpResponse = await fetch('/api/v1/mcp/policies');
      const mcpData = await mcpResponse.json();

      // Load pending approvals (we'll need to create this endpoint)
      let pendingApprovals = 0;
      try {
        const approvalsResponse = await fetch('/api/v1/approvals?status=pending');
        const approvalsData = await approvalsResponse.json();
        if (approvalsData.success) {
          pendingApprovals = approvalsData.data.length;
        }
      } catch (error) {
        console.log('Approvals endpoint not yet implemented');
      }

      if (orgsData.success && agentsData.success && templatesData.success) {
        const eligibleCount = agentsData.data.filter((agent: any) =>
          agent.isEligibleForMint && !agent.nftMinted
        ).length;

        setStats({
          totalAgents: agentsData.data.length,
          eligibleAgents: eligibleCount,
          totalOrganizations: orgsData.data.length,
          totalTemplates: templatesData.data.length,
          totalPolicies: loaData.success ? loaData.data.length : 0,
          pendingApprovals,
          activeMCPs: mcpData.success ? mcpData.data.filter((mcp: any) => mcp.status === 'active').length : 0
        });

        // Determine user type based on activity
        if (agentsData.data.length === 0) {
          setUserType('new');
        } else if (eligibleCount > 0 || agentsData.data.length > 5) {
          setUserType('advanced');
        } else {
          setUserType('active');
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const painPoints = [
    {
      icon: AlertCircle,
      title: "Manual Role Tracking",
      problem: "Spending hours in status meetings and spreadsheets",
      solution: "Automated role monitoring with real-time updates",
      color: "red"
    },
    {
      icon: Clock,
      title: "Trust Verification Delays",
      problem: "Waiting days for trust score verification",
      solution: "Instant trust evaluation with external signals",
      color: "yellow"
    },
    {
      icon: Shield,
      title: "Access Control Complexity",
      problem: "Complex role-based access control management",
      solution: "Simplified PAM with trust-gated MCPs",
      color: "blue"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your PAM + Trust-Gated MCP platform</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAgents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Policies</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPolicies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Trust Score</p>
                <p className="text-2xl font-bold text-gray-900">L{userType === 'new' ? '1' : userType === 'active' ? '3' : '5'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">NFT Eligible</p>
                <p className="text-2xl font-bold text-gray-900">{stats.eligibleAgents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Carousel */}
      <div className="mb-12">
        <ServiceCarousel userType={userType} stats={stats} />
      </div>

      {/* Simplified Content */}
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Services</h2>
        <p className="text-gray-600 mb-6">Access your PAM and MCP services directly</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">PAM Services</h3>
              <p className="text-gray-600 mb-4">Level of Assurance policies and approval workflows</p>
              <a href="/services/pam" className="text-blue-600 hover:text-blue-800 font-medium">Go to PAM →</a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Lock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">MCP Services</h3>
              <p className="text-gray-600 mb-4">Management Control Plane policies with OPA/Rego</p>
              <a href="/services/mcp" className="text-purple-600 hover:text-purple-800 font-medium">Go to MCP →</a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 mb-4">Trust evaluation and performance insights</p>
              <a href="/analytics" className="text-green-600 hover:text-green-800 font-medium">Go to Analytics →</a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pain Points */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">How We Solve Your Problems</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {painPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <Card key={index} className="border-l-4 border-l-red-500">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-8 w-8 text-${point.color}-600 mt-1`} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{point.title}</h3>
                      <p className="text-gray-600 mb-3">{point.problem}</p>
                      <p className="text-green-600 font-medium">{point.solution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
