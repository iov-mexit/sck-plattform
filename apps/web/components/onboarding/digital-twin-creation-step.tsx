'use client';

import { useState, useEffect } from 'react';
import { User, Shield, Zap, CheckCircle, Key } from 'lucide-react';

interface RoleAgentCreationStepProps {
  onNext: () => void;
  onBack: () => void;
}

interface RoleTemplate {
  id: string;
  title: string;
  focus: string;
  category: string;
  selectable: boolean;
}

interface TeamMember {
  id: string;
  did: string;
  roleTemplateId: string;
  roleTitle: string;
  roleAgentCreated: boolean;
}

export function RoleAgentCreationStep({ onNext, onBack }: RoleAgentCreationStepProps) {
  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      did: 'did:ethr:0x1234567890123456789012345678901234567890',
      roleTemplateId: 'security-analyst',
      roleTitle: 'Security Analyst',
      roleAgentCreated: false,
    },
    {
      id: '2',
      did: 'did:ethr:0x2345678901234567890123456789012345678901',
      roleTemplateId: 'compliance-officer',
      roleTitle: 'Compliance Officer',
      roleAgentCreated: false,
    },
  ]);

  const [newMember, setNewMember] = useState({
    did: '',
    roleTemplateId: '',
  });

  // Fetch role templates from the database
  useEffect(() => {
    const fetchRoleTemplates = async () => {
      try {
        const response = await fetch('/api/v1/role-templates');
        if (response.ok) {
          const data = await response.json();
          setRoleTemplates(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch role templates:', error);
        // Fallback to default templates if API fails
        setRoleTemplates([
          { id: 'security-analyst', title: 'Security Analyst', focus: 'Threat Detection & Response', category: 'Security', selectable: true },
          { id: 'compliance-officer', title: 'Compliance Officer', focus: 'Regulatory Compliance', category: 'Governance', selectable: true },
          { id: 'security-engineer', title: 'Security Engineer', focus: 'Security Architecture', category: 'Engineering', selectable: true },
          { id: 'security-manager', title: 'Security Manager', focus: 'Security Strategy', category: 'Management', selectable: true },
        ]);
      }
    };

    fetchRoleTemplates();
  }, []);

  const handleAddMember = () => {
    if (newMember.did && newMember.roleTemplateId) {
      const selectedTemplate = roleTemplates.find(t => t.id === newMember.roleTemplateId);
      if (selectedTemplate) {
        setTeamMembers(prev => [...prev, {
          id: Date.now().toString(),
          did: newMember.did,
          roleTemplateId: newMember.roleTemplateId,
          roleTitle: selectedTemplate.title,
          roleAgentCreated: false,
        }]);
        setNewMember({ did: '', roleTemplateId: '' });
      }
    }
  };

  const handleCreateRoleAgent = (memberId: string) => {
    setTeamMembers(prev =>
      prev.map(member =>
        member.id === memberId
          ? { ...member, roleAgentCreated: true }
          : member
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save role agents to backend using DIDs and role template IDs
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          Create Role Agents
        </h4>
        <p className="text-gray-600">
          Set up role agents for your team members using DIDs. Role agents will collect signals and track security contributions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Add New Team Member */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-medium text-gray-900 mb-3">Add Team Member</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DID (Decentralized Identifier)
              </label>
              <input
                type="text"
                placeholder="did:ethr:0x..."
                value={newMember.did}
                onChange={(e) => setNewMember({ ...newMember, did: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the DID of the team member (no PII required)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Template
              </label>
              <select
                value={newMember.roleTemplateId}
                onChange={(e) => setNewMember({ ...newMember, roleTemplateId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a role template</option>
                {roleTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title} - {template.focus}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddMember}
            disabled={!newMember.did || !newMember.roleTemplateId}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Member
          </button>
        </div>

        {/* Team Members List */}
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900">Team Members</h5>
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className={`border rounded-lg p-4 ${member.roleAgentCreated ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Key className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900">{member.roleTitle}</h6>
                    <p className="text-sm text-gray-600 font-mono">{member.did}</p>
                    <p className="text-xs text-gray-500">Role Template ID: {member.roleTemplateId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {member.roleAgentCreated ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Role Agent Created</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleCreateRoleAgent(member.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Create Role Agent
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Digital Twin Features */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-3">Role Agent Features</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">Signal Collection</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">Trust Scoring</span>
            </div>
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">DID-based Identity</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">Achievement Tracking</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Back
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Complete Setup
          </button>
        </div>
      </form>
    </div>
  );
} 