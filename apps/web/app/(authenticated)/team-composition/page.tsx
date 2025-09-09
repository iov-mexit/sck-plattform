"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageLayout, PageHeader } from "@/components/page-layout";
import {
  Users,
  Sparkles,
  Shield,
  Target,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap,
  TrendingUp,
  Clock
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  category: string;
  skills: string[];
  certifications: any[];
  trustScore: number;
  skillMatchScore: number;
  availability: 'available' | 'busy' | 'unknown';
}

interface TeamSuggestion {
  suggestions: TeamMember[];
  gaps: string[];
  confidence: number;
  rationale: string;
}

interface PrivilegeRecommendation {
  recommendedLoA: number;
  rationale: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  requiredApprovals: string[];
  suggestedControls: string[];
  complianceRequirements: string[];
}

export default function TeamCompositionPage() {
  const [phaseName, setPhaseName] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [trustMin, setTrustMin] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [teamSuggestion, setTeamSuggestion] = useState<TeamSuggestion | null>(null);
  const [privilegeRecommendation, setPrivilegeRecommendation] = useState<PrivilegeRecommendation | null>(null);
  const [activeTab, setActiveTab] = useState<'team' | 'privileges' | 'gaps'>('team');

  const generateTeam = async () => {
    if (!phaseName || !requiredSkills) {
      alert("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const skills = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);

      const response = await fetch("/api/v1/teams/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirements: {
            phaseName,
            skills,
            trustMin,
            maxTeamSize: 5
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTeamSuggestion(data);

        // Get privilege recommendations
        const privilegeResponse = await fetch("/api/v1/privileges/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teamMembers: data.suggestions,
            projectSensitivity: 'medium'
          }),
        });

        const privilegeData = await privilegeResponse.json();
        if (privilegeData.success) {
          setPrivilegeRecommendation(privilegeData.recommendations);
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error generating team:", error);
      alert("Failed to generate team suggestion");
    } finally {
      setIsGenerating(false);
    }
  };

  const getTrustColor = (score: number) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    if (score >= 2) return "text-orange-600";
    return "text-red-600";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return "bg-green-100 text-green-800";
      case 'medium': return "bg-yellow-100 text-yellow-800";
      case 'high': return "bg-orange-100 text-orange-800";
      case 'critical': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <PageLayout showPattern={true} patternHeight="h-64">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <PageHeader
          category="AI-Powered Team Building"
          title={[
            "Build Trust-Driven",
            "Teams"
          ]}
          description="AI-powered team composition that matches skills, trust scores, and compliance requirements to build the perfect team for your project."
        />

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-blue-600" />
                <span>Project Requirements</span>
              </CardTitle>
              <CardDescription>
                Define your project phase and required skills to generate the optimal team composition.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Phase</label>
                  <input
                    type="text"
                    placeholder="e.g., Design, Implementation, Security Audit"
                    value={phaseName}
                    onChange={(e) => setPhaseName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Trust Score</label>
                  <select
                    value={trustMin}
                    onChange={(e) => setTrustMin(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value={1}>1 - Basic</option>
                    <option value={2}>2 - Developing</option>
                    <option value={3}>3 - Proficient</option>
                    <option value={4}>4 - Advanced</option>
                    <option value={5}>5 - Expert</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., TypeScript, React, Security, Compliance, Project Management"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={generateTeam}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold"
                >
                  {isGenerating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex items-center space-x-2"
                    >
                      <Clock className="h-5 w-5" />
                      <span>Generating Team...</span>
                    </motion.div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Generate Team Composition</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {teamSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Confidence Banner */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">
                        Team Composition Generated
                      </h3>
                      <p className="text-green-600">
                        Confidence: {(teamSuggestion.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-800">
                      {teamSuggestion.suggestions.length}
                    </div>
                    <div className="text-sm text-green-600">Team Members</div>
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md">
                {[
                  { id: 'team', label: 'Team', icon: Users },
                  { id: 'privileges', label: 'Privileges', icon: Shield },
                  { id: 'gaps', label: 'Gaps', icon: AlertTriangle }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all ${activeTab === tab.id
                      ? 'bg-white shadow-sm text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'team' && (
                  <motion.div
                    key="team"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {teamSuggestion.suggestions.map((member, index) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="group"
                      >
                        <Card className="h-full border-2 hover:border-blue-300 transition-all duration-300">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg">{member.name}</CardTitle>
                                <CardDescription>{member.title}</CardDescription>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className={`font-semibold ${getTrustColor(member.trustScore)}`}>
                                  {member.trustScore}/5
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Match</h4>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${member.skillMatchScore * 100}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                />
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {(member.skillMatchScore * 100).toFixed(0)}% match
                              </p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Skills</h4>
                              <div className="flex flex-wrap gap-1">
                                {member.skills.slice(0, 3).map((skill, skillIndex) => (
                                  <Badge key={skillIndex} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {member.skills.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{member.skills.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Availability</span>
                              <Badge
                                variant={member.availability === 'available' ? 'default' : 'secondary'}
                                className={member.availability === 'available' ? 'bg-green-100 text-green-800' : ''}
                              >
                                {member.availability}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'privileges' && privilegeRecommendation && (
                  <motion.div
                    key="privileges"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Shield className="h-6 w-6 text-blue-600" />
                          <span>Privilege Recommendations</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-3xl font-bold text-blue-600">
                              LoA {privilegeRecommendation.recommendedLoA}
                            </div>
                            <div className="text-sm text-blue-600">Recommended Level</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <Badge className={`${getRiskColor(privilegeRecommendation.riskLevel)} text-lg px-4 py-2`}>
                              {privilegeRecommendation.riskLevel.toUpperCase()}
                            </Badge>
                            <div className="text-sm text-orange-600 mt-2">Risk Level</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-3xl font-bold text-green-600">
                              {privilegeRecommendation.requiredApprovals.length}
                            </div>
                            <div className="text-sm text-green-600">Required Approvals</div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Rationale</h4>
                          <p className="text-gray-600">{privilegeRecommendation.rationale}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2">Required Approvals</h4>
                            <div className="space-y-1">
                              {privilegeRecommendation.requiredApprovals.map((approval, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">{approval}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Suggested Controls</h4>
                            <div className="space-y-1">
                              {privilegeRecommendation.suggestedControls.slice(0, 5).map((control, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Shield className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">{control}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === 'gaps' && (
                  <motion.div
                    key="gaps"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <AlertTriangle className="h-6 w-6 text-orange-600" />
                          <span>Skill Gap Analysis</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {teamSuggestion.gaps.length === 0 ? (
                          <div className="text-center py-8">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-green-800 mb-2">
                              All Skills Covered!
                            </h3>
                            <p className="text-green-600">
                              Your team has all the required skills for this project phase.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                              <h4 className="font-semibold text-orange-800 mb-2">
                                Missing Skills ({teamSuggestion.gaps.length})
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {teamSuggestion.gaps.map((gap, index) => (
                                  <Badge key={index} variant="destructive" className="text-sm">
                                    {gap}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
                              <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Consider hiring additional team members with these skills</li>
                                <li>• Provide training for existing team members</li>
                                <li>• Engage external consultants for specialized skills</li>
                                <li>• Adjust project timeline to allow for skill development</li>
                              </ul>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}