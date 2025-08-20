'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Shield,
  Users,
  FileText,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface LoAPolicy {
  id: string;
  artifactType: 'RoleAgent' | 'MCP';
  minReviewers: number;
  requiredFacets: string[];
  createdAt: string;
  organizationId: string;
}

interface Approval {
  id: string;
  artifactId: string;
  artifactType: 'RoleAgent' | 'MCP';
  reviewerId: string;
  facet: string;
  decision: 'approve' | 'reject';
  comment?: string;
  createdAt: string;
}

export default function PAMServicePage() {
  const [policies, setPolicies] = useState<LoAPolicy[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePolicy, setShowCreatePolicy] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    artifactType: 'RoleAgent' as 'RoleAgent' | 'MCP',
    minReviewers: 2,
    requiredFacets: ['security', 'compliance']
  });

  useEffect(() => {
    loadPAMData();
  }, []);

  const loadPAMData = async () => {
    try {
      // Load LoA policies
      const policiesResponse = await fetch('/api/v1/loa/policies');
      const policiesData = await policiesResponse.json();

      // Load approvals
      const approvalsResponse = await fetch('/api/v1/approvals');
      const approvalsData = await approvalsResponse.json();

      if (policiesData.success) {
        setPolicies(policiesData.data);
      }
      if (approvalsData.success) {
        setApprovals(approvalsData.data);
      }
    } catch (error) {
      console.error('Error loading PAM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPolicy = async () => {
    try {
      const response = await fetch('/api/v1/loa/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPolicy), // Remove hardcoded organizationId
      });

      if (response.ok) {
        setShowCreatePolicy(false);
        setNewPolicy({
          artifactType: 'RoleAgent',
          minReviewers: 2,
          requiredFacets: ['security', 'compliance']
        });
        loadPAMData();
      } else {
        const errorData = await response.json();
        console.error('Failed to create policy:', errorData);
        // You could add toast notification here
      }
    } catch (error) {
      console.error('Error creating policy:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PAM services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privileged Access Management</h1>
        <p className="text-gray-600">Level of Assurance policies and approval workflows for secure access control</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Policies</p>
                <p className="text-2xl font-bold text-gray-900">{policies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{approvals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Artifacts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {approvals.reduce((acc, approval) => {
                    if (!acc.includes(approval.artifactId)) acc.push(approval.artifactId);
                    return acc;
                  }, [] as string[]).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LoA Policies Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Level of Assurance Policies</h2>
          <Button onClick={() => setShowCreatePolicy(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Policy
          </Button>
        </div>

        {policies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No LoA Policies</h3>
              <p className="text-gray-600 mb-4">Create your first Level of Assurance policy to get started</p>
              <Button onClick={() => setShowCreatePolicy(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Policy
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{policy.artifactType} Policy</CardTitle>
                    <Badge variant="secondary">{policy.minReviewers} Reviewers</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Required Facets</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {policy.requiredFacets.map((facet) => (
                          <Badge key={facet} variant="outline" className="text-xs">
                            {facet}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Created {new Date(policy.createdAt).toLocaleDateString()}</span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Approvals Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Approval Workflows</h2>

        {approvals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
              <p className="text-gray-600">All artifacts are currently approved or no approval workflows are active</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <Card key={approval.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{approval.artifactType}</Badge>
                        <Badge className={getStatusColor(approval.decision)}>
                          {approval.decision === 'approve' ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {approval.decision}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Reviewer:</span> {approval.reviewerId}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Facet:</span> {approval.facet}
                      </p>
                      {approval.comment && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Comment:</span> {approval.comment}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {new Date(approval.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Policy Modal */}
      {showCreatePolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create LoA Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="artifactType">Artifact Type</Label>
                <select
                  id="artifactType"
                  value={newPolicy.artifactType}
                  onChange={(e) => setNewPolicy({ ...newPolicy, artifactType: e.target.value as 'RoleAgent' | 'MCP' })}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="RoleAgent">Role Agent</option>
                  <option value="MCP">MCP</option>
                </select>
              </div>

              <div>
                <Label htmlFor="minReviewers">Minimum Reviewers</Label>
                <Input
                  id="minReviewers"
                  type="number"
                  min="1"
                  value={newPolicy.minReviewers}
                  onChange={(e) => setNewPolicy({ ...newPolicy, minReviewers: parseInt(e.target.value) })}
                />
              </div>

              <div>
                <Label>Required Facets</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['security', 'compliance', 'policy', 'risk'].map((facet) => (
                    <Button
                      key={facet}
                      variant={newPolicy.requiredFacets.includes(facet) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const facets = newPolicy.requiredFacets.includes(facet)
                          ? newPolicy.requiredFacets.filter(f => f !== facet)
                          : [...newPolicy.requiredFacets, facet];
                        setNewPolicy({ ...newPolicy, requiredFacets: facets });
                      }}
                    >
                      {facet}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={createPolicy} className="flex-1">
                  Create Policy
                </Button>
                <Button variant="outline" onClick={() => setShowCreatePolicy(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


