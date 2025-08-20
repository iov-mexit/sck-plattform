'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RoleTemplate {
  id: string;
  title: string;
  category: string;
  focus: string;
}

interface Organization {
  id: string;
  name: string;
  domain: string;
}

interface FormData {
  name: string;
  description: string;
  assignedToDid: string;
  roleTemplateId: string;
  organizationId: string;
  trustScore: string;
}

export function RoleAgentCreator() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    assignedToDid: '',
    roleTemplateId: '',
    organizationId: '',
    trustScore: '500'
  });

  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesRes, orgsRes] = await Promise.all([
          fetch('/api/v1/role-templates'),
          fetch('/api/v1/organizations')
        ]);

        if (templatesRes.ok) {
          const templatesData = await templatesRes.json();
          setRoleTemplates(templatesData.templates || []);
        }

        if (orgsRes.ok) {
          const orgsData = await orgsRes.json();
          setOrganizations(orgsData.organizations || []);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load required data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        trustScore: parseInt(formData.trustScore, 10)
      };

      const response = await fetch('/api/v1/role-agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          description: '',
          assignedToDid: '',
          roleTemplateId: '',
          organizationId: '',
          trustScore: '500'
        });
      } else {
        setError(data.error || 'Failed to create role agent');
      }
    } catch (err) {
      setError('Failed to create role agent');
      console.error('Role agent creation error:', err);
    } finally {
      setCreating(false);
    }
  };

  const generateDid = () => {
    const randomHex = Math.random().toString(16).substr(2, 40);
    setFormData(prev => ({
      ...prev,
      assignedToDid: `did:ethr:0x${randomHex}`
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Create Role Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Create Role Agent</span>
          {success && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Created Successfully
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Role Agent Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Security Engineer Agent"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this role agent's purpose..."
                rows={3}
              />
            </div>
          </div>

          {/* Identity Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Identity Assignment</h3>

            <div className="space-y-2">
              <Label htmlFor="assignedToDid">Assigned DID</Label>
              <div className="flex gap-2">
                <Input
                  id="assignedToDid"
                  value={formData.assignedToDid}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedToDid: e.target.value }))}
                  placeholder="did:ethr:0x..."
                  required
                />
                <Button type="button" variant="outline" onClick={generateDid}>
                  Generate
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Decentralized Identifier for privacy-preserving assignment
              </p>
            </div>
          </div>

          {/* Role Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Role Configuration</h3>

            <div className="space-y-2">
              <Label htmlFor="organizationId">Organization</Label>
              <Select
                value={formData.organizationId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, organizationId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name} ({org.domain})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleTemplateId">Role Template</Label>
              <Select
                value={formData.roleTemplateId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, roleTemplateId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role template" />
                </SelectTrigger>
                <SelectContent>
                  {roleTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex flex-col items-start">
                        <span>{template.title}</span>
                        <span className="text-xs text-gray-500">{template.category}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trustScore">Initial Trust Score</Label>
              <Input
                id="trustScore"
                type="number"
                min="0"
                max="1000"
                value={formData.trustScore}
                onChange={(e) => setFormData(prev => ({ ...prev, trustScore: e.target.value }))}
                required
              />
              <p className="text-xs text-gray-500">
                Score from 0-1000. Scores ≥750 are eligible for NFT minting.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <Button
              type="submit"
              disabled={creating || !formData.name || !formData.assignedToDid || !formData.roleTemplateId || !formData.organizationId}
              className="w-full"
            >
              {creating ? 'Creating Role Agent...' : 'Create Role Agent'}
            </Button>
          </div>
        </form>

        {success && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-4 h-4" />
              <span>Role Agent Created Successfully</span>
            </div>
            <p className="text-green-600 text-sm mt-1">
              The role agent has been created and is ready for signal collection.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 