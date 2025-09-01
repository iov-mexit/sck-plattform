'use client';

import { useState } from 'react';
import { Shield, Users, Lock, Building, Lightbulb, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AgentCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  status: 'active' | 'coming-soon';
}

export default function AgentsPage() {
  const router = useRouter();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agentCategories: AgentCategory[] = [
    {
      id: 'compliance',
      name: 'Compliance Agent',
      description: 'Regulatory frameworks, policy generation, and audit preparation',
      icon: <Shield className="h-8 w-8" />,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      features: [
        'ISO 27001, GDPR, NIS2 frameworks',
        'Policy generation and validation',
        'Audit preparation and reporting',
        'Compliance monitoring and alerts'
      ],
      status: 'active'
    },
    {
      id: 'mentoring',
      name: 'Mentoring Agent',
      description: 'Role-specific guidance, best practices, and skill development',
      icon: <Users className="h-8 w-8" />,
      color: 'bg-green-50 border-green-200 text-green-800',
      features: [
        'Role-based learning paths',
        'Best practices and implementation',
        'Skill development tracking',
        'Peer learning and collaboration'
      ],
      status: 'active'
    },
    {
      id: 'security',
      name: 'Security Agent',
      description: 'Threat modeling, risk assessment, and incident response',
      icon: <Lock className="h-8 w-8" />,
      color: 'bg-red-50 border-red-200 text-red-800',
      features: [
        'Threat modeling and risk assessment',
        'Security controls and monitoring',
        'Incident response and forensics',
        'Vulnerability management'
      ],
      status: 'coming-soon'
    },
    {
      id: 'governance',
      name: 'Governance Agent',
      description: 'Organizational policies, decision-making, and stakeholder management',
      icon: <Building className="h-8 w-8" />,
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      features: [
        'Organizational policies and procedures',
        'Decision-making frameworks',
        'Stakeholder management',
        'Risk governance and oversight'
      ],
      status: 'coming-soon'
    },
    {
      id: 'innovation',
      name: 'Innovation Agent',
      description: 'Emerging technologies, strategic planning, and competitive analysis',
      icon: <Lightbulb className="h-8 w-8" />,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      features: [
        'Emerging technologies and trends',
        'Strategic planning and roadmaps',
        'Competitive analysis',
        'Innovation pipeline management'
      ],
      status: 'coming-soon'
    }
  ];

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
    
    // Navigate to appropriate page based on agent
    if (agentId === 'compliance') {
      router.push('/policy-search');
    } else if (agentId === 'mentoring') {
      router.push('/mentoring');
    } else {
      // For coming soon agents, show a modal or message
      console.log(`${agentId} agent coming soon!`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center bg-black">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">SCK Agents</span>
            </div>
            <div className="text-sm text-gray-600">
              Choose Your AI Agent
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            Choose Your AI Agent
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each agent specializes in different aspects of compliance, security, and organizational management. 
            Select the agent that best matches your current needs.
          </p>
        </div>

        {/* Agent Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {agentCategories.map((agent) => (
            <div
              key={agent.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedAgent === agent.id 
                  ? 'border-black bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${agent.status === 'coming-soon' ? 'opacity-60' : ''}`}
              onClick={() => agent.status === 'active' && handleAgentSelect(agent.id)}
            >
              {/* Agent Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${agent.color}`}>
                  {agent.icon}
                </div>
                {agent.status === 'coming-soon' && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                )}
                {agent.status === 'active' && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>

              {/* Agent Info */}
              <h3 className="text-xl font-semibold text-black mb-2">
                {agent.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {agent.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                {agent.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center text-xs text-gray-500">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
                {agent.features.length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{agent.features.length - 3} more features
                  </div>
                )}
              </div>

              {/* Action Button */}
              {agent.status === 'active' && (
                <button
                  className="w-full mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Select Agent</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/policy-search')}
              className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-black transition-colors"
            >
              <h4 className="font-medium text-black mb-2">Search Policies</h4>
              <p className="text-sm text-gray-600">Find regulatory requirements and compliance guidance</p>
            </button>
            
            <button
              onClick={() => router.push('/mentoring')}
              className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-black transition-colors"
            >
              <h4 className="font-medium text-black mb-2">Get Mentoring</h4>
              <p className="text-sm text-gray-600">Role-specific guidance and best practices</p>
            </button>
            
            <button
              className="text-left p-4 bg-white rounded-lg border border-gray-200 opacity-50 cursor-not-allowed"
            >
              <h4 className="font-medium text-gray-500 mb-2">Security Assessment</h4>
              <p className="text-sm text-gray-500">Coming soon - Threat modeling and risk assessment</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
