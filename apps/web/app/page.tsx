'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Users, Activity, TrendingUp, CheckCircle, AlertTriangle, Plus, UserCheck, Building2, Target } from 'lucide-react';
import { MOCK_CUSTOMER, getRandomDid, getAllRoleTemplates, getRoleTemplateById } from '@/lib/mock-customer';

interface RoleTemplate {
  id: string;
  title: string;
  category: string;
  focus: string;
}

interface DigitalTwin {
  id: string;
  roleIdentifier: string;
  description?: string;
  status: string;
  level: number;
  assignedToDid: string;
  roleTemplate: {
    title: string;
    category: string;
  };
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('create');
  const [isCreating, setIsCreating] = useState(false);
  const [digitalTwins, setDigitalTwins] = useState<DigitalTwin[]>([]);
  const [formData, setFormData] = useState({
    roleIdentifier: '',
    description: '',
    organizationId: MOCK_CUSTOMER.organization.id,
    roleTemplateId: '',
    assignedToDid: '',
  });

  // Use real role templates from mock customer
  const roleTemplates: RoleTemplate[] = getAllRoleTemplates();

  const handleCreateDigitalTwin = async () => {
    if (!formData.roleIdentifier || !formData.roleTemplateId || !formData.assignedToDid) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/v1/digital-twins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        const newTwin = result.data;
        setDigitalTwins(prev => [newTwin, ...prev]);

        // Reset form
        setFormData({
          roleIdentifier: '',
          description: '',
          organizationId: MOCK_CUSTOMER.organization.id,
          roleTemplateId: '',
          assignedToDid: '',
        });

        setActiveTab('dashboard');
        alert('Digital Twin created successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating digital twin:', error);
      alert('Failed to create digital twin');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Secure Code KnAIght
              </h1>
            </div>
            <Badge variant="secondary" className="ml-2">
              v0.1.0 - Core Flow
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {MOCK_CUSTOMER.organization.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {MOCK_CUSTOMER.organization.description}
              </p>
            </div>
            <Badge variant="outline" className="ml-auto">
              SaaS Customer
            </Badge>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Digital Twin Management with Privacy-Preserving DID Assignment
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="create">Create Twin</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="demo">Demo Twins</TabsTrigger>
            <TabsTrigger value="status">System Status</TabsTrigger>
          </TabsList>

          {/* Create Digital Twin Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Create New Digital Twin</span>
                </CardTitle>
                <CardDescription>
                  Create a digital twin and assign it to a DID (Decentralized Identifier)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roleIdentifier">Role Identifier *</Label>
                    <Input
                      id="roleIdentifier"
                      value={formData.roleIdentifier}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, roleIdentifier: e.target.value }))}
                      placeholder="e.g., Security Engineer #001"
                    />
                    <p className="text-xs text-muted-foreground">
                      Role-based identifier (no personal names)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roleTemplate">Role Template *</Label>
                    <Select
                      value={formData.roleTemplateId}
                      onValueChange={(value: string) => setFormData(prev => ({ ...prev, roleTemplateId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role template" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.title} ({template.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedToDid">DID Assignment *</Label>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    <Input
                      id="assignedToDid"
                      value={formData.assignedToDid}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, assignedToDid: e.target.value }))}
                      placeholder="did:example:123456789abcdef"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, assignedToDid: getRandomDid() }))}
                    >
                      Generate DID
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter or generate a DID (Decentralized Identifier) for privacy-preserving assignment
                  </p>
                </div>

                <Button
                  onClick={handleCreateDigitalTwin}
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? 'Creating...' : 'Create Digital Twin'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Twins</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{digitalTwins.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Digital twins created
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Twins</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {digitalTwins.filter(twin => twin.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">95%</div>
                  <p className="text-xs text-muted-foreground">
                    Platform security
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">DID Coverage</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {digitalTwins.filter(twin => twin.assignedToDid).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Privacy-enabled twins
                  </p>
                </CardContent>
              </Card>
            </div>

            {digitalTwins.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Digital Twins</CardTitle>
                  <CardDescription>
                    Your created digital twins with DID assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {digitalTwins.map((twin) => (
                      <div key={twin.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{twin.roleIdentifier || `${twin.roleTemplate.title} #${twin.id}`}</h3>
                          <p className="text-sm text-muted-foreground">
                            {twin.roleTemplate.title} • {twin.roleTemplate.category}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            DID: {twin.assignedToDid}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={twin.status === 'active' ? 'default' : 'secondary'}>
                            {twin.status}
                          </Badge>
                          <Badge variant="outline">Level {twin.level}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Digital Twins Yet</CardTitle>
                  <CardDescription>
                    Create your first digital twin to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setActiveTab('create')}>
                    Create Your First Twin
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Demo Twins Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Demo Digital Twins</span>
                </CardTitle>
                <CardDescription>
                  Pre-created digital twins for SecureCorp demonstrating the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_CUSTOMER.sampleDigitalTwins.map((twin, index) => {
                    const roleTemplate = getRoleTemplateById(twin.roleTemplateId);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{twin.roleIdentifier}</h3>
                          <p className="text-sm text-muted-foreground">
                            {roleTemplate?.title} • {roleTemplate?.category} • Level {twin.level}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            DID: {twin.assignedToDid}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {twin.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="default">
                            {twin.status}
                          </Badge>
                          <Badge variant="outline">
                            {roleTemplate?.focus}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Status Tab */}
          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Current platform health and performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Frontend: Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">API: Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">TypeScript: Clean</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Database: Ready to Connect</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Smart Contracts: Pending</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
