import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface DigitalTwin {
  id: string;
  name: string;
  role: string;
  assignedDid: string;
  organizationId: string;
  achievements: Achievement[];
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Achievement {
  id: string;
  type: 'certification' | 'score' | 'milestone';
  title: string;
  description: string;
  score?: number;
  nftTokenId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  description: string;
  adminAddress: string;
  digitalTwins: DigitalTwin[];
}

export function OrganizationDashboard() {
  const { address, isConnected } = useAccount();
  // Remove the unused variable setSelectedOrganization
  const [selectedOrganization] = useState<Organization | null>(null);
  const [digitalTwins, setDigitalTwins] = useState<DigitalTwin[]>([]);
  const [isCreatingTwin, setIsCreatingTwin] = useState(false);
  const [isMintingAchievement, setIsMintingAchievement] = useState(false);

  // Mock organization data
  const mockOrganizations: Organization[] = [
    {
      id: 'org-1',
      name: 'SecureCorp',
      description: 'Leading cybersecurity consulting firm',
      adminAddress: address || '',
      digitalTwins: []
    }
  ];

  const handleCreateDigitalTwin = async (twinData: {
    name: string;
    role: string;
    assignedDid: string;
    description?: string;
  }) => {
    if (!selectedOrganization) return;

    setIsCreatingTwin(true);

    try {
      // Mock API call to create digital twin
      const newTwin: DigitalTwin = {
        id: `twin-${Date.now()}`,
        name: twinData.name,
        role: twinData.role,
        assignedDid: twinData.assignedDid,
        organizationId: selectedOrganization.id,
        achievements: [],
        status: 'active',
        createdAt: new Date().toISOString()
      };

      setDigitalTwins(prev => [...prev, newTwin]);

      console.log('Digital twin created:', newTwin);
    } catch (error) {
      console.error('Failed to create digital twin:', error);
    } finally {
      setIsCreatingTwin(false);
    }
  };

  const handleMintAchievementNFT = async (twinId: string, achievementData: {
    type: 'certification' | 'score' | 'milestone';
    title: string;
    description: string;
    score?: number;
    metadata: Record<string, unknown>;
  }) => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    setIsMintingAchievement(true);

    try {
      // Mock NFT minting
      const mockTokenId = Math.floor(Math.random() * 10000);

      const newAchievement: Achievement = {
        id: `achievement-${Date.now()}`,
        type: achievementData.type,
        title: achievementData.title,
        description: achievementData.description,
        score: achievementData.score,
        nftTokenId: mockTokenId.toString(),
        metadata: achievementData.metadata,
        createdAt: new Date().toISOString()
      };

      // Update the digital twin with the new achievement
      setDigitalTwins(prev => prev.map(twin =>
        twin.id === twinId
          ? { ...twin, achievements: [...twin.achievements, newAchievement] }
          : twin
      ));

      console.log('Achievement NFT minted:', newAchievement);
    } catch (error) {
      console.error('Failed to mint achievement NFT:', error);
    } finally {
      setIsMintingAchievement(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏢 Organization Management
          </CardTitle>
          <CardDescription>
            Manage digital twins and achievements for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Connect your wallet to manage your organization
              </p>
              <Badge variant="secondary">❌ Wallet Not Connected</Badge>
            </div>
          ) : (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="twins">Digital Twins</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="nfts">NFT Management</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Twins</CardTitle>
                      <Badge variant="outline">{digitalTwins.length}</Badge>
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
                      <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
                      <Badge variant="outline">
                        {digitalTwins.reduce((sum, twin) => sum + twin.achievements.length, 0)}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {digitalTwins.reduce((sum, twin) => sum + twin.achievements.length, 0)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        NFTs minted
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Twins</CardTitle>
                      <Badge variant="outline">
                        {digitalTwins.filter(twin => twin.status === 'active').length}
                      </Badge>
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
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Organization Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Organization:</span>
                        <span>{mockOrganizations[0]?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Admin Address:</span>
                        <span className="font-mono text-sm">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <Badge variant="default">✅ Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="twins" className="space-y-4">
                <DigitalTwinManager
                  digitalTwins={digitalTwins}
                  onCreateTwin={handleCreateDigitalTwin}
                  isCreating={isCreatingTwin}
                />
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <AchievementManager
                  digitalTwins={digitalTwins}
                  onMintAchievement={handleMintAchievementNFT}
                  isMinting={isMintingAchievement}
                />
              </TabsContent>

              <TabsContent value="nfts" className="space-y-4">
                <NFTManager digitalTwins={digitalTwins} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DigitalTwinManager({
  digitalTwins,
  onCreateTwin,
  isCreating
}: {
  digitalTwins: DigitalTwin[];
  onCreateTwin: (data: {
    name: string;
    role: string;
    assignedDid: string;
    description?: string;
  }) => Promise<void>;
  isCreating: boolean;
}) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    assignedDid: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateTwin(formData);
    setFormData({ name: '', role: '', assignedDid: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Digital Twin</CardTitle>
          <CardDescription>
            Create a new digital twin and assign it to a DID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Twin Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Security Engineer #001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Security Engineer"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedDid">Assigned DID *</Label>
              <Input
                id="assignedDid"
                value={formData.assignedDid}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedDid: e.target.value }))}
                placeholder="did:example:123456789abcdef"
                required
              />
              <p className="text-xs text-muted-foreground">
                DID representing the human assigned to this digital twin
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description"
                rows={3}
              />
            </div>

            <Button type="submit" disabled={isCreating} className="w-full">
              {isCreating ? 'Creating...' : 'Create Digital Twin'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Digital Twins</CardTitle>
          <CardDescription>
            Manage your organization&apos;s digital twins
          </CardDescription>
        </CardHeader>
        <CardContent>
          {digitalTwins.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No digital twins created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {digitalTwins.map((twin) => (
                <div key={twin.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{twin.name}</h3>
                      <Badge variant={twin.status === 'active' ? 'default' : 'secondary'}>
                        {twin.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{twin.role}</p>
                    <p className="text-xs text-muted-foreground font-mono">{twin.assignedDid}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{twin.achievements.length} achievements</div>
                    <div className="text-xs text-muted-foreground">
                      Created {new Date(twin.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AchievementManager({
  digitalTwins,
  onMintAchievement,
  isMinting
}: {
  digitalTwins: DigitalTwin[];
  onMintAchievement: (twinId: string, data: {
    type: 'certification' | 'score' | 'milestone';
    title: string;
    description: string;
    score?: number;
    metadata: Record<string, unknown>;
  }) => Promise<void>;
  isMinting: boolean;
}) {
  const [selectedTwin, setSelectedTwin] = useState<string>('');
  const [achievementData, setAchievementData] = useState<{
    type: 'certification' | 'score' | 'milestone';
    title: string;
    description: string;
    score?: number;
    metadata: Record<string, unknown>;
  }>({
    type: 'certification',
    title: '',
    description: '',
    score: undefined,
    metadata: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTwin) return;

    await onMintAchievement(selectedTwin, achievementData);
    setAchievementData({
      type: 'certification',
      title: '',
      description: '',
      score: undefined,
      metadata: {}
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mint Achievement NFT</CardTitle>
          <CardDescription>
            Create and mint an achievement NFT for a digital twin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twin">Select Digital Twin *</Label>
              <Select value={selectedTwin} onValueChange={setSelectedTwin}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a digital twin" />
                </SelectTrigger>
                <SelectContent>
                  {digitalTwins.map((twin) => (
                    <SelectItem key={twin.id} value={twin.id}>
                      {twin.name} ({twin.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Achievement Type *</Label>
                <Select
                  value={achievementData.type}
                  onValueChange={(value: 'certification' | 'score' | 'milestone') =>
                    setAchievementData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="score">Score</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="score">Score (optional)</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="100"
                  value={achievementData.score || ''}
                  onChange={(e) => setAchievementData(prev => ({
                    ...prev,
                    score: e.target.value ? parseInt(e.target.value) : undefined
                  }))}
                  placeholder="85"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Achievement Title *</Label>
              <Input
                id="title"
                value={achievementData.title}
                onChange={(e) => setAchievementData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Security Expert Certification"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={achievementData.description}
                onChange={(e) => setAchievementData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description of the achievement"
                rows={3}
                required
              />
            </div>

            <Button type="submit" disabled={isMinting || !selectedTwin} className="w-full">
              {isMinting ? 'Minting NFT...' : 'Mint Achievement NFT'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Achievements</CardTitle>
          <CardDescription>
            View all achievements across digital twins
          </CardDescription>
        </CardHeader>
        <CardContent>
          {digitalTwins.every(twin => twin.achievements.length === 0) ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No achievements minted yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {digitalTwins.map((twin) =>
                twin.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{achievement.title}</h3>
                        <Badge variant="outline">{achievement.type}</Badge>
                        {achievement.nftTokenId && (
                          <Badge variant="secondary">NFT #{achievement.nftTokenId}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Twin: {twin.name} • {new Date(achievement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {achievement.score && (
                      <div className="text-right">
                        <div className="text-2xl font-bold">{achievement.score}</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function NFTManager({ digitalTwins }: { digitalTwins: DigitalTwin[] }) {
  const allAchievements = digitalTwins.flatMap(twin =>
    twin.achievements.map(achievement => ({ ...achievement, twinName: twin.name }))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>NFT Collection</CardTitle>
          <CardDescription>
            View all minted achievement NFTs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allAchievements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No NFTs minted yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allAchievements.map((achievement) => (
                <Card key={achievement.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{achievement.type}</Badge>
                      {achievement.nftTokenId && (
                        <Badge variant="secondary">#{achievement.nftTokenId}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {achievement.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Twin:</span>
                        <span className="font-medium">{achievement.twinName}</span>
                      </div>
                      {achievement.score && (
                        <div className="flex justify-between text-sm">
                          <span>Score:</span>
                          <span className="font-bold">{achievement.score}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span>Created:</span>
                        <span>{new Date(achievement.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 