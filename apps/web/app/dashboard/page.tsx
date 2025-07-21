import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignalCollection } from '@/components/signal-collection';
import { SignalAnalytics } from '@/components/signal-analytics';

// Mock data for demonstration
const mockOrganization = {
  id: 'org-1',
  name: 'CyberLab AD',
  description: 'Advanced cybersecurity research and development organization',
  domain: 'cyberlab-ad.com',
  digitalTwins: [
    {
      id: 'dt-1',
      name: 'Alice Frontend Developer Twin',
      description: 'Digital twin for Alice as Frontend Developer',
      status: 'active',
      level: 1,
      roleTemplate: {
        title: 'Frontend Developer',
        category: 'Architecture',
      },
      assignedTo: {
        name: 'Alice Johnson',
        email: 'alice@cyberlab-ad.com',
      },
      signals: [
        {
          id: 'sig-1',
          type: 'certification',
          title: 'React Security Certification',
          value: 100,
          verified: true,
        },
        {
          id: 'sig-2',
          type: 'activity',
          title: 'Security Code Review',
          value: 50,
          verified: true,
        },
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'OWASP Frontend Security',
          issuer: 'OWASP Foundation',
          verified: true,
        },
      ],
    },
  ],
  roleTemplates: [
    {
      id: 'frontend-developer',
      title: 'Frontend Developer',
      category: 'Architecture',
      focus: 'Building user-facing interfaces with accessibility and performance in mind.',
    },
    {
      id: 'backend-developer',
      title: 'Backend Developer',
      category: 'Architecture',
      focus: 'Secure and scalable APIs and logic layer implementation.',
    },
    {
      id: 'devsecops-engineer',
      title: 'DevSecOps Engineer',
      category: 'Architecture',
      focus: 'Secure CI/CD and infrastructure as code.',
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      category: 'Product',
      focus: 'Own product vision, roadmap, and outcomes.',
    },
  ],
};

function OrganizationOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{mockOrganization.name}</h1>
        <p className="text-muted-foreground">{mockOrganization.description}</p>
        <Badge variant="secondary" className="mt-2">
          {mockOrganization.domain}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digital Twins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrganization.digitalTwins.length}</div>
            <p className="text-xs text-muted-foreground">Active twins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockOrganization.roleTemplates.length}</div>
            <p className="text-xs text-muted-foreground">Available roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockOrganization.digitalTwins.reduce((sum, twin) => sum + twin.signals.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Collected signals</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DigitalTwinsList() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Digital Twins</h2>
      <div className="grid gap-4">
        {mockOrganization.digitalTwins.map((twin) => (
          <Card key={twin.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{twin.name}</CardTitle>
                  <CardDescription>{twin.description}</CardDescription>
                </div>
                <Badge variant={twin.status === 'active' ? 'default' : 'secondary'}>
                  {twin.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{twin.roleTemplate.category}</Badge>
                  <Badge variant="outline">Level {twin.level}</Badge>
                </div>

                <div>
                  <p className="text-sm font-medium">Assigned to:</p>
                  <p className="text-sm text-muted-foreground">
                    {twin.assignedTo.name} ({twin.assignedTo.email})
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Signals ({twin.signals.length})</p>
                    <div className="space-y-1">
                      {twin.signals.map((signal) => (
                        <div key={signal.id} className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {signal.type}
                          </Badge>
                          <span className="text-xs">{signal.title}</span>
                          {signal.verified && (
                            <Badge variant="secondary" className="text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Certifications ({twin.certifications.length})</p>
                    <div className="space-y-1">
                      {twin.certifications.map((cert) => (
                        <div key={cert.id} className="flex items-center space-x-2">
                          <span className="text-xs">{cert.name}</span>
                          {cert.verified && (
                            <Badge variant="secondary" className="text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function RoleTemplatesList() {
  const productRoles = mockOrganization.roleTemplates.filter(
    (role) => role.category === 'Product'
  );
  const architectureRoles = mockOrganization.roleTemplates.filter(
    (role) => role.category === 'Architecture'
  );
  const qaRoles = mockOrganization.roleTemplates.filter(
    (role) => role.category === 'QA'
  );
  const solutionDesignRoles = mockOrganization.roleTemplates.filter(
    (role) => role.category === 'Solution Design'
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Role Templates</h2>

      <Tabs defaultValue="product" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="product">Product ({productRoles.length})</TabsTrigger>
          <TabsTrigger value="architecture">Architecture ({architectureRoles.length})</TabsTrigger>
          <TabsTrigger value="qa">QA ({qaRoles.length})</TabsTrigger>
          <TabsTrigger value="solution-design">Solution Design ({solutionDesignRoles.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="product" className="space-y-4">
          <div className="grid gap-4">
            {productRoles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <Badge variant="outline">{role.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{role.focus}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <div className="grid gap-4">
            {architectureRoles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <Badge variant="outline">{role.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{role.focus}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="qa" className="space-y-4">
          <div className="grid gap-4">
            {qaRoles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <Badge variant="outline">{role.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{role.focus}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="solution-design" className="space-y-4">
          <div className="grid gap-4">
            {solutionDesignRoles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.title}</CardTitle>
                    <Badge variant="outline">{role.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{role.focus}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="role-templates">Role Templates</TabsTrigger>
          <TabsTrigger value="signals">Signal Collection</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <OrganizationOverview />
          </Suspense>
          <Suspense fallback={<LoadingSpinner />}>
            <DigitalTwinsList />
          </Suspense>
        </TabsContent>

        <TabsContent value="role-templates" className="space-y-6">
          <Suspense fallback={<LoadingSpinner />}>
            <RoleTemplatesList />
          </Suspense>
        </TabsContent>

        <TabsContent value="signals" className="space-y-6">
          <SignalCollection digitalTwinId="dt-1" />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <SignalAnalytics digitalTwinId="dt-1" />
        </TabsContent>
      </Tabs>
    </div>
  );
} 