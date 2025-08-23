'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  FileText,
  Signal,
  Globe,
  Plus,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Copy,
  Users,
  Workflow,
  BarChart3,
  Eye,
  History
} from 'lucide-react';

interface LoAPolicy {
  id: string;
  organizationId: string;
  artifactType: 'RoleAgent' | 'MCP' | 'ANS' | 'Signal';
  level: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  minReviewers: number;
  requiredFacets: string[];
  externalRequired: boolean;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ApprovalTask {
  id: string;
  artifactId: string;
  artifactType: 'RoleAgent' | 'MCP' | 'ANS' | 'Signal';
  loaLevel: 'L1' | 'L2' | 'L3' | 'L4' | 'L5';
  facet: string;
  reviewerId?: string;
  decision: 'approve' | 'reject' | 'pending';
  comment?: string | null;
  reviewedAt?: Date | null;
  createdAt: Date;
}

interface ReviewerRole {
  id: string;
  name: string;
  category: 'Security' | 'Compliance' | 'Policy' | 'Risk' | 'External';
  canApproveLevels: ('L1' | 'L2' | 'L3' | 'L4' | 'L5')[];
  isActive: boolean;
}

export default function LoAManagementPage() {
  const [loaPolicies, setLoAPolicies] = useState<LoAPolicy[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalTask[]>([]);
  const [reviewerRoles, setReviewerRoles] = useState<ReviewerRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('policies');
  const [selectedPolicy, setSelectedPolicy] = useState<LoAPolicy | null>(null);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  useEffect(() => {
    fetchLoAPolicies();
    fetchPendingApprovals();
    fetchReviewerRoles();
  }, []);

  const fetchLoAPolicies = async () => {
    try {
      // TODO: Get organization ID from auth context
      const orgId = 'cmemudyrn0000rqsyyr787rpy'; // From seeding
      const response = await fetch(`/api/v1/loa/policies?organizationId=${orgId}`);
      const data = await response.json();

      if (data.success) {
        setLoAPolicies(data.data);
      }
    } catch (error) {
      console.error('Error fetching LoA policies:', error);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      // TODO: Get organization ID from auth context
      const orgId = 'cmemudyrn0000rqsyyr787rpy'; // From seeding
      const response = await fetch(`/api/v1/approvals?organizationId=${orgId}&status=pending`);
      const data = await response.json();

      if (data.success) {
        setPendingApprovals(data.data);
      }
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewerRoles = async () => {
    try {
      // TODO: Get organization ID from auth context
      const orgId = 'cmemudyrn0000rqsyyr787rpy'; // From seeding
      const response = await fetch(`/api/v1/loa/reviewer-roles?organizationId=${orgId}`);
      const data = await response.json();

      if (data.success) {
        setReviewerRoles(data.data);
      }
    } catch (error) {
      console.error('Error fetching reviewer roles:', error);
      // Fallback to mock data if API fails
      const mockRoles: ReviewerRole[] = [
        {
          id: '1',
          name: 'Security Officer',
          category: 'Security',
          canApproveLevels: ['L1', 'L2', 'L3', 'L4', 'L5'],
          isActive: true
        },
        {
          id: '2',
          name: 'Compliance Manager',
          category: 'Compliance',
          canApproveLevels: ['L2', 'L3', 'L4', 'L5'],
          isActive: true
        },
        {
          id: '3',
          name: 'Policy Advisor',
          category: 'Policy',
          canApproveLevels: ['L3', 'L4', 'L5'],
          isActive: true
        },
        {
          id: '4',
          name: 'Risk Analyst',
          category: 'Risk',
          canApproveLevels: ['L4', 'L5'],
          isActive: true
        },
        {
          id: '5',
          name: 'External Auditor',
          category: 'External',
          canApproveLevels: ['L4', 'L5'],
          isActive: true
        }
      ];
      setReviewerRoles(mockRoles);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'L1': return 'bg-green-100 text-green-800';
      case 'L2': return 'bg-blue-100 text-blue-800';
      case 'L3': return 'bg-yellow-100 text-yellow-800';
      case 'L4': return 'bg-orange-100 text-orange-800';
      case 'L5': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'RoleAgent': return <Shield className="h-4 w-4" />;
      case 'MCP': return <FileText className="h-4 w-4" />;
      case 'Signal': return <Signal className="h-4 w-4" />;
      case 'ANS': return <Globe className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'approve': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'reject': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getFacetColor = (facet: string) => {
    switch (facet) {
      case 'security': return 'bg-red-100 text-red-800';
      case 'compliance': return 'bg-blue-100 text-blue-800';
      case 'policy': return 'bg-green-100 text-green-800';
      case 'risk': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalWorkflow = (policy: LoAPolicy) => {
    const workflow = [];

    // Add required facets with reviewer roles
    policy.requiredFacets.forEach((facet, index) => {
      const role = reviewerRoles.find(r => r.category.toLowerCase() === facet);
      if (role) {
        workflow.push({
          step: index + 1,
          facet,
          role: role.name,
          canApprove: role.canApproveLevels.includes(policy.level)
        });
      }
    });

    // Add external validation if required
    if (policy.externalRequired) {
      const externalRole = reviewerRoles.find(r => r.category === 'External');
      if (externalRole) {
        workflow.push({
          step: workflow.length + 1,
          facet: 'external',
          role: externalRole.name,
          canApprove: externalRole.canApproveLevels.includes(policy.level)
        });
      }
    }

    return workflow;
  };

  const getPolicyUsageStats = (policy: LoAPolicy) => {
    // TODO: Implement real usage statistics
    const mockStats = {
      totalApprovals: Math.floor(Math.random() * 50) + 5,
      lastApproved: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      avgApprovalTime: Math.floor(Math.random() * 48) + 2,
      successRate: Math.floor(Math.random() * 20) + 80
    };
    return mockStats;
  };

  const handleEditPolicy = (policy: LoAPolicy) => {
    setSelectedPolicy(policy);
    setShowPolicyModal(true);
  };

  const handleClonePolicy = (policy: LoAPolicy) => {
    // TODO: Implement policy cloning
    console.log('Clone policy:', policy);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading LoA Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Level of Assurance (LoA) Management</h1>
          <p className="text-gray-600 mt-2">
            Manage governance policies and approval workflows across all artifact types
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New LoA Policy
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="policies">LoA Policies</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="roles">Reviewer Roles</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-6">
          <div className="grid gap-6">
            {['RoleAgent', 'MCP', 'Signal', 'ANS'].map((artifactType) => (
              <Card key={artifactType}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getArtifactIcon(artifactType)}
                    {artifactType} LoA Policies
                  </CardTitle>
                  <CardDescription>
                    Governance policies for {artifactType.toLowerCase()} artifacts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {loaPolicies
                      .filter(policy => policy.artifactType === artifactType)
                      .sort((a, b) => a.level.localeCompare(b.level))
                      .map((policy) => {
                        const workflow = getApprovalWorkflow(policy);
                        const stats = getPolicyUsageStats(policy);

                        return (
                          <div
                            key={policy.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Badge className={getLevelColor(policy.level)}>
                                  {policy.level}
                                </Badge>
                                <span className="font-medium">
                                  {policy.minReviewers} reviewer{policy.minReviewers > 1 ? 's' : ''} required
                                </span>
                                {policy.externalRequired && (
                                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                                    External Required
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={policy.isActive ? "default" : "secondary"}>
                                  {policy.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditPolicy(policy)}
                                  className="h-8 px-2"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleClonePolicy(policy)}
                                  className="h-8 px-2"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-3">
                              {policy.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {policy.requiredFacets.map((facet) => (
                                <Badge key={facet} className={getFacetColor(facet)}>
                                  {facet}
                                </Badge>
                              ))}
                            </div>

                            {/* Approval Workflow Visualization */}
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Workflow className="h-4 w-4" />
                                Approval Workflow
                              </h4>
                              <div className="flex items-center gap-2 text-sm">
                                {workflow.map((step, index) => (
                                  <div key={step.step} className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${step.canApprove ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                      }`}>
                                      {step.step}
                                    </div>
                                    <span className="text-gray-600">{step.role}</span>
                                    {index < workflow.length - 1 && (
                                      <span className="text-gray-400">→</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Usage Statistics */}
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <BarChart3 className="h-3 w-3" />
                                  {stats.totalApprovals} approvals
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {stats.avgApprovalTime}h avg
                                </span>
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  {stats.successRate}% success
                                </span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <History className="h-3 w-3 mr-1" />
                                View History
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approval Tasks</CardTitle>
              <CardDescription>
                {pendingApprovals.length} tasks awaiting review decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No pending approvals! All tasks are up to date.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div
                      key={approval.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getArtifactIcon(approval.artifactType)}
                          <span className="font-medium">{approval.artifactType}</span>
                          <Badge className={getLevelColor(approval.loaLevel)}>
                            {approval.loaLevel}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {getDecisionIcon(approval.decision)}
                          <span className="text-sm text-gray-600">
                            {approval.decision.charAt(0).toUpperCase() + approval.decision.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getFacetColor(approval.facet)}>
                            {approval.facet} review
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Artifact ID: {approval.artifactId.slice(0, 8)}...
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="text-green-600 border-green-300">
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-300">
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reviewer Roles & Permissions</CardTitle>
              <CardDescription>
                Manage who can approve at each LoA level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {reviewerRoles.map((role) => (
                  <div
                    key={role.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={getFacetColor(role.category.toLowerCase())}>
                          {role.category}
                        </Badge>
                        <span className="font-medium">{role.name}</span>
                      </div>
                      <Badge variant={role.isActive ? "default" : "secondary"}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Can approve:</span>
                      {role.canApproveLevels.map((level) => (
                        <Badge key={level} className={getLevelColor(level)}>
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total LoA Policies</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loaPolicies.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active governance policies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingApprovals.length}</div>
                <p className="text-xs text-muted-foreground">
                  Tasks awaiting review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loaPolicies.filter(p => p.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently enforced
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coverage</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4/4</div>
                <p className="text-xs text-muted-foreground">
                  Artifact types covered
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>LoA Level Distribution</CardTitle>
              <CardDescription>
                How many policies exist at each assurance level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {['L1', 'L2', 'L3', 'L4', 'L5'].map((level) => {
                  const count = loaPolicies.filter(p => p.level === level).length;
                  return (
                    <div key={level} className="text-center">
                      <div className={`text-2xl font-bold ${getLevelColor(level).split(' ')[1]}`}>
                        {count}
                      </div>
                      <div className="text-sm text-gray-600">{level}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
