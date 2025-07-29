'use client';

import React, { useState, useEffect } from 'react';
import { Users, Shield } from 'lucide-react';
import { Carousel } from '../common/carousel';
import { TagInput } from '../common/tag-input';
import { RoleTemplate, SecurityContribution } from '../../lib/types/role-templates';

interface SelectedTemplate {
  template: RoleTemplate;
  tags: string[];
}

interface RoleTemplatesStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function RoleTemplatesStep({ onNext, onBack }: RoleTemplatesStepProps) {
  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTemplates, setSelectedTemplates] = useState<SelectedTemplate[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([
    'Security Team', 'DevOps Team', 'Engineering Team', 'Management Team',
    'Compliance Team', 'QA Team', 'Frontend Team', 'Backend Team',
    'Infrastructure Team', 'Product Team', 'Design Team', 'Support Team',
    'Architecture Team', 'Solution Design Team', 'Security Architecture Team'
  ]);

  useEffect(() => {
    const fetchRoleTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/role-templates');
        if (response.ok) {
          const data = await response.json();
          setRoleTemplates(data.data || []);
        } else {
          throw new Error('Failed to fetch role templates');
        }
      } catch (error) {
        console.error('Failed to fetch role templates:', error);
        setError('Failed to load role templates. Using default templates.');
        setRoleTemplates([
          {
            id: 'security-analyst',
            title: 'Security Analyst',
            focus: 'Threat Detection & Response',
            category: 'Product',
            responsibilities: [
              'Monitor security alerts and investigate incidents',
              'Analyze threat intelligence and security events',
              'Respond to security incidents and coordinate remediation'
            ],
            securityContributions: [
              {
                title: 'Incident Response',
                bullets: [
                  'Responded to 50+ security incidents with 100% resolution rate',
                  'Reduced mean time to detection from 4 hours to 30 minutes',
                  'Implemented automated threat hunting capabilities'
                ]
              },
              {
                title: 'Threat Intelligence',
                bullets: [
                  'Analyzed 200+ threat indicators daily',
                  'Created threat intelligence reports for executive leadership',
                  'Integrated threat feeds into SIEM platform'
                ]
              }
            ],
            selectable: true,
          },
          {
            id: 'compliance-officer',
            title: 'Compliance Officer',
            focus: 'Regulatory Compliance',
            category: 'QA',
            responsibilities: [
              'Ensure compliance with security regulations and standards',
              'Develop and maintain security policies and procedures',
              'Conduct compliance audits and assessments'
            ],
            securityContributions: [
              {
                title: 'Compliance Management',
                bullets: [
                  'Achieved SOC 2 Type II compliance in 6 months',
                  'Developed 25+ security policies and procedures',
                  'Conducted 50+ vendor security assessments'
                ]
              },
              {
                title: 'Risk Management',
                bullets: [
                  'Reduced compliance audit findings by 80%',
                  'Implemented GRC platform for automated compliance',
                  'Established security awareness training program'
                ]
              }
            ],
            selectable: true,
          },
          {
            id: 'security-engineer',
            title: 'Security Engineer',
            focus: 'Security Architecture',
            category: 'Architecture',
            responsibilities: [
              'Design security architecture',
              'Implement security controls',
              'Develop security tools',
              'Conduct security testing'
            ],
            securityContributions: [
              {
                title: 'Security Architecture',
                bullets: [
                  'Designed zero-trust architecture for 10+ organizations',
                  'Reduced attack surface by 75% through architectural controls',
                  'Created security reference architectures'
                ]
              },
              {
                title: 'Security Tool Development',
                bullets: [
                  'Built automated security scanning pipeline',
                  'Created custom SAST rules for company standards',
                  'Developed security training modules'
                ]
              }
            ],
            selectable: true,
          },
          {
            id: 'security-manager',
            title: 'Security Manager',
            focus: 'Security Strategy',
            category: 'Solution Design',
            responsibilities: [
              'Develop security strategy',
              'Manage security team',
              'Oversee security operations',
              'Coordinate with stakeholders'
            ],
            securityContributions: [
              {
                title: 'Team Leadership',
                bullets: [
                  'Managed 12-person security team across multiple projects',
                  'Reduced security incident response time by 60%',
                  'Implemented 24/7 security monitoring program'
                ]
              },
              {
                title: 'Strategic Planning',
                bullets: [
                  'Developed comprehensive security roadmaps',
                  'Created security metrics dashboard for executive reporting',
                  'Established security operations center procedures'
                ]
              }
            ],
            selectable: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleTemplates();
  }, []);

  const handleTemplateToggle = (template: RoleTemplate) => {
    const isSelected = selectedTemplates.some(st => st.template.id === template.id);

    if (isSelected) {
      setSelectedTemplates(prev => prev.filter(st => st.template.id !== template.id));
    } else {
      setSelectedTemplates(prev => [...prev, { template, tags: [] }]);
    }
  };

  const handleTagsChange = (templateId: string, tags: string[]) => {
    setSelectedTemplates(prev =>
      prev.map(st =>
        st.template.id === templateId
          ? { ...st, tags }
          : st
      )
    );

    // Add new tags to available tags
    const newTags = tags.filter(tag => !availableTags.includes(tag));
    if (newTags.length > 0) {
      setAvailableTags(prev => [...prev, ...newTags]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save selected role templates with tags to backend
    onNext();
  };

  const renderTemplateCard = (template: RoleTemplate) => {
    const isSelected = selectedTemplates.some(st => st.template.id === template.id);
    const selectedTemplate = selectedTemplates.find(st => st.template.id === template.id);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h5 className="text-xl font-semibold text-gray-900 mb-1">{template.title}</h5>
            <p className="text-sm text-gray-600 mb-1">{template.focus}</p>
            <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
              {template.category}
            </p>
          </div>
          <button
            onClick={() => handleTemplateToggle(template)}
            className={`px-4 py-2 rounded-lg transition-colors ${isSelected
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {isSelected ? 'Selected' : 'Select'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h6 className="text-sm font-medium text-gray-700 flex items-center mb-3">
              <Users className="h-4 w-4 mr-2" />
              Responsibilities
            </h6>
            <ul className="text-sm text-gray-600 space-y-2">
              {template.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  {resp}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="text-sm font-medium text-gray-700 flex items-center mb-3">
              <Shield className="h-4 w-4 mr-2" />
              Security Contributions
            </h6>
            <div className="space-y-3">
              {template.securityContributions.map((contrib, index) => (
                <div key={index} className="text-sm">
                  <div className="font-medium text-gray-700 mb-1">{contrib.title}</div>
                  <ul className="text-gray-600 space-y-1">
                    {contrib.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags Section */}
        {isSelected && selectedTemplate && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h6 className="text-sm font-medium text-gray-700 mb-3">
              Team Tags
            </h6>
            <TagInput
              tags={selectedTemplate.tags}
              onTagsChange={(tags) => handleTagsChange(template.id, tags)}
              availableTags={availableTags}
              placeholder="Add team tag..."
              maxTags={5}
            />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Loading Role Templates
          </h4>
          <p className="text-gray-600">
            Fetching available role templates from the database...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">
          Select Role Templates
        </h4>
        <p className="text-gray-600">
          Browse and select security-aware role templates for your team members. Add tags to organize team members by groups or teams.
        </p>
        {error && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            {error}
          </div>
        )}
      </div>

      {/* Carousel */}
      <Carousel
        items={roleTemplates.map(template => renderTemplateCard(template))}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
        showDots={true}
        showArrows={true}
        className="mb-6"
      />

      {/* Selected Templates Summary */}
      {selectedTemplates.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h6 className="font-medium text-green-800 mb-2">
            Selected Templates ({selectedTemplates.length})
          </h6>
          <div className="space-y-2">
            {selectedTemplates.map((selected) => (
              <div key={selected.template.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-green-800">
                    {selected.template.title}
                  </span>
                  {selected.tags.length > 0 && (
                    <div className="flex space-x-1">
                      {selected.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-1 py-0.5 text-xs bg-green-200 text-green-700 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleTemplateToggle(selected.template)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
          onClick={handleSubmit}
          disabled={selectedTemplates.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
} 