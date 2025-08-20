'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Lock,
  FileText,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Play,
  Code,
  Shield
} from 'lucide-react';

interface MCPPolicy {
  id: string;
  name: string;
  version: number;
  status: 'draft' | 'active' | 'archived';
  regoModule: string;
  sha256: string;
  isDefault: boolean;
  scope: any;
  createdBy: string;
  createdAt: string;
  organizationId: string;
}

export default function MCPServicePage() {
  const [policies, setPolicies] = useState<MCPPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePolicy, setShowCreatePolicy] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    regoModule: '',
    scope: { resources: ['*'], actions: ['*'] },
    isDefault: false
  });

  useEffect(() => {
    loadMCPData();
  }, []);

  const loadMCPData = async () => {
    try {
      const response = await fetch('/api/v1/mcp/policies');
      const data = await response.json();

      if (data.success) {
        setPolicies(data.data);
      }
    } catch (error) {
      console.error('Error loading MCP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPolicy = async () => {
    try {
      const response = await fetch('/api/v1/mcp/policies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPolicy,
          organizationId: 'default-org', // This should come from auth context
          createdBy: 'current-user', // This should come from auth context
          sha256: 'placeholder-sha256', // In production, this would be computed
        }),
      });

      if (response.ok) {
        setShowCreatePolicy(false);
        setNewPolicy({
          name: '',
          regoModule: '',
          scope: { resources: ['*'], actions: ['*'] },
          isDefault: false
        });
        loadMCPData();
      }
    } catch (error) {
      console.error('Error creating MCP policy:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'draft': return Clock;
      case 'archived': return AlertCircle;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading MCP services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Management Control Plane</h1>
        <p className="text-gray-600">OPA/Rego policies for trust-gated access control and enforcement</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Lock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Policies</p>
                <p className="text-2xl font-bold text-gray-900">{policies.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {policies.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Code className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Default Policy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {policies.filter(p => p.isDefault).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MCP Policies Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">MCP Policies</h2>
          <Button onClick={() => setShowCreatePolicy(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Policy
          </Button>
        </div>

        {policies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No MCP Policies</h3>
              <p className="text-gray-600 mb-4">Create your first Management Control Plane policy to get started</p>
              <Button onClick={() => setShowCreatePolicy(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Policy
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => {
              const StatusIcon = getStatusIcon(policy.status);
              return (
                <Card key={policy.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{policy.name}</CardTitle>
                      <div className="flex space-x-2">
                        {policy.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        <Badge className={getStatusColor(policy.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {policy.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">v{policy.version}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Rego Module</Label>
                        <div className="mt-1 p-2 bg-gray-50 rounded text-xs font-mono text-gray-700 truncate">
                          {policy.regoModule.substring(0, 50)}...
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">Scope</Label>
                        <div className="mt-1 text-xs text-gray-600">
                          Resources: {Array.isArray(policy.scope.resources) ? policy.scope.resources.join(', ') : 'All'}
                        </div>
                        <div className="text-xs text-gray-600">
                          Actions: {Array.isArray(policy.scope.actions) ? policy.scope.actions.join(', ') : 'All'}
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
                          <Button variant="ghost" size="sm">
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Policy Modal */}
      {showCreatePolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create MCP Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="policyName">Policy Name</Label>
                <Input
                  id="policyName"
                  placeholder="e.g., Production Access Control"
                  value={newPolicy.name}
                  onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="regoModule">Rego Module</Label>
                <Textarea
                  id="regoModule"
                  placeholder="package mcp.access

default allow = false

allow {
  input.user.trust_level >= 750
  input.resource.environment == 'production'
}"
                  value={newPolicy.regoModule}
                  onChange={(e) => setNewPolicy({ ...newPolicy, regoModule: e.target.value })}
                  rows={8}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Write your Open Policy Agent (OPA) Rego policy here
                </p>
              </div>

              <div>
                <Label>Scope Configuration</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm">Resources</Label>
                    <Input
                      placeholder="*, api/*, database/*"
                      value={Array.isArray(newPolicy.scope.resources) ? newPolicy.scope.resources.join(', ') : ''}
                      onChange={(e) => setNewPolicy({
                        ...newPolicy,
                        scope: { ...newPolicy.scope, resources: e.target.value.split(',').map(s => s.trim()) }
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Actions</Label>
                    <Input
                      placeholder="*, read, write, delete"
                      value={Array.isArray(newPolicy.scope.actions) ? newPolicy.scope.actions.join(', ') : ''}
                      onChange={(e) => setNewPolicy({
                        ...newPolicy,
                        scope: { ...newPolicy.scope, actions: e.target.value.split(',').map(s => s.trim()) }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newPolicy.isDefault}
                  onChange={(e) => setNewPolicy({ ...newPolicy, isDefault: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isDefault">Set as default policy</Label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={createPolicy} className="flex-1" disabled={!newPolicy.name || !newPolicy.regoModule}>
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
