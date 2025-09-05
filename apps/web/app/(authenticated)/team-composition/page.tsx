'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Plus, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

interface TeamComposition {
  id: string;
  projectPhase: string;
  requirements: {
    skills: string[];
    trustMinLevel: number;
    teamSize: number;
  };
  suggestedTeam: Array<{
    id: string;
    name: string;
    role: string;
    trustScore: number;
    skillMatchScore: number;
    skills: string[];
    certifications: number;
    signals: number;
  }>;
  gaps: { missingSkills: string[] } | null;
  createdAt: string;
}

interface ProjectPhase {
  id: string;
  projectId: string;
  phaseName: string;
  startDate: string | null;
  endDate: string | null;
  requiredSkills: string[];
  createdAt: string;
}

const SDLC_PHASES = [
  'Ideation',
  'Planning', 
  'Design',
  'Implementation',
  'Testing',
  'Deployment',
  'Maintenance',
  'Threat Modeling',
  'Security Review',
  'Compliance Audit'
];

const COMMON_SKILLS = [
  'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
  'AWS', 'Docker', 'Kubernetes', 'Terraform',
  'ISO27001', 'SOC2', 'GDPR', 'NIST', 'OWASP',
  'Threat Modeling', 'Risk Assessment', 'Security Architecture',
  'DevOps', 'CI/CD', 'Git', 'Agile', 'Scrum',
  'Machine Learning', 'AI/ML', 'Data Science',
  'Blockchain', 'Web3', 'Smart Contracts',
  'Penetration Testing', 'Vulnerability Assessment',
  'Incident Response', 'Forensics', 'Compliance'
];

export default function TeamCompositionPage() {
  const [compositions, setCompositions] = useState<TeamComposition[]>([]);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggesting, setSuggesting] = useState(false);
  
  // Form state
  const [selectedPhase, setSelectedPhase] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [trustMinLevel, setTrustMinLevel] = useState(3);
  const [teamSize, setTeamSize] = useState(5);

  useEffect(() => {
    fetchCompositions();
    fetchPhases();
  }, []);

  const fetchCompositions = async () => {
    try {
      const response = await fetch('/api/v1/team-composition?organizationId=default-org');
      const data = await response.json();
      setCompositions(data.compositions || []);
    } catch (error) {
      console.error('Error fetching compositions:', error);
    }
  };

  const fetchPhases = async () => {
    try {
      const response = await fetch('/api/v1/project-phases?organizationId=default-org');
      const data = await response.json();
      setPhases(data.phases || []);
    } catch (error) {
      console.error('Error fetching phases:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
      setRequiredSkills([...requiredSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const suggestTeam = async () => {
    if (!selectedPhase || requiredSkills.length === 0) {
      alert('Please select a project phase and add required skills');
      return;
    }

    setSuggesting(true);
    try {
      const response = await fetch('/api/v1/team-composition/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: 'default-org',
          projectPhase: selectedPhase,
          requiredSkills,
          trustMinLevel,
          teamSize
        })
      });

      const data = await response.json();
      if (data.composition) {
        setCompositions([data.composition, ...compositions]);
      }
    } catch (error) {
      console.error('Error suggesting team:', error);
      alert('Failed to suggest team composition');
    } finally {
      setSuggesting(false);
    }
  };

  const getTrustLevelColor = (score: number) => {
    if (score >= 900) return 'text-green-600 bg-green-100';
    if (score >= 750) return 'text-blue-600 bg-blue-100';
    if (score >= 500) return 'text-yellow-600 bg-yellow-100';
    if (score >= 250) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getSkillMatchColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 bg-green-100';
    if (score >= 0.6) return 'text-blue-600 bg-blue-100';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Team Composition Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Composition Engine</h1>
          <p className="text-gray-600 mt-2">
            AI-powered team staffing based on skills, trust scores, and project requirements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-blue-600" />
          <span className="text-sm text-gray-500">
            {compositions.length} compositions
          </span>
        </div>
      </div>

      <Tabs defaultValue="suggest" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggest">Suggest Team</TabsTrigger>
          <TabsTrigger value="compositions">Team Compositions</TabsTrigger>
          <TabsTrigger value="phases">Project Phases</TabsTrigger>
        </TabsList>

        <TabsContent value="suggest" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Target className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Suggest Team Composition</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phase">Project Phase</Label>
                  <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {SDLC_PHASES.map(phase => (
                        <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="trustLevel">Minimum Trust Level</Label>
                  <Select value={trustMinLevel.toString()} onValueChange={(v) => setTrustMinLevel(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">L1 - Entry (0-249)</SelectItem>
                      <SelectItem value="2">L2 - Basic (250-499)</SelectItem>
                      <SelectItem value="3">L3 - Intermediate (500-749)</SelectItem>
                      <SelectItem value="4">L4 - Advanced (750-899)</SelectItem>
                      <SelectItem value="5">L5 - Expert (900-1000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min="1"
                    max="20"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value) || 5)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Required Skills</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Add skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button onClick={addSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Common skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {COMMON_SKILLS.slice(0, 10).map(skill => (
                        <Button
                          key={skill}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (!requiredSkills.includes(skill)) {
                              setRequiredSkills([...requiredSkills, skill]);
                            }
                          }}
                          disabled={requiredSkills.includes(skill)}
                        >
                          {skill}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Selected skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {requiredSkills.map(skill => (
                        <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
                          <span>{skill}</span>
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                onClick={suggestTeam} 
                disabled={suggesting || !selectedPhase || requiredSkills.length === 0}
                className="w-full"
              >
                {suggesting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Team Composition...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Suggest Team Composition
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="compositions" className="space-y-6">
          <div className="grid gap-6">
            {compositions.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Compositions Yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first team composition by suggesting a team for a project phase.
                </p>
                <Button onClick={() => document.querySelector('[value="suggest"]')?.click()}>
                  Suggest Team Composition
                </Button>
              </Card>
            ) : (
              compositions.map(composition => (
                <Card key={composition.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {composition.projectPhase} Team
                      </h3>
                      <p className="text-sm text-gray-600">
                        Created {new Date(composition.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {composition.suggestedTeam.length} members
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Suggested Team</h4>
                      <div className="space-y-3">
                        {composition.suggestedTeam.map(member => (
                          <div key={member.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getTrustLevelColor(member.trustScore)}>
                                  Trust: {member.trustScore}
                                </Badge>
                                <Badge className={getSkillMatchColor(member.skillMatchScore)}>
                                  Match: {Math.round(member.skillMatchScore * 100)}%
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3" />
                                <span>{member.certifications}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{member.signals}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Requirements & Gaps</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Required Skills:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {composition.requirements.skills.map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-700">Trust Level:</p>
                          <Badge variant="outline">
                            L{composition.requirements.trustMinLevel}+
                          </Badge>
                        </div>

                        {composition.gaps && composition.gaps.missingSkills.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-red-700 flex items-center">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Skill Gaps:
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {composition.gaps.missingSkills.map(skill => (
                                <Badge key={skill} variant="destructive" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {(!composition.gaps || composition.gaps.missingSkills.length === 0) && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">All skills covered</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="phases" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Project Phases</h2>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Phase
              </Button>
            </div>

            {phases.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Project Phases</h3>
                <p className="text-gray-600">
                  Define project phases to better organize team composition requirements.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {phases.map(phase => (
                  <div key={phase.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{phase.phaseName}</h3>
                        <p className="text-sm text-gray-600">Project: {phase.projectId}</p>
                        {phase.startDate && (
                          <p className="text-sm text-gray-500">
                            {new Date(phase.startDate).toLocaleDateString()} - 
                            {phase.endDate ? new Date(phase.endDate).toLocaleDateString() : 'Ongoing'}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {Array.isArray(phase.requiredSkills) ? phase.requiredSkills.length : 0} skills
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
