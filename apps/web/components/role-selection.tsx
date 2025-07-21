'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface RoleTemplate {
  id: string;
  title: string;
  focus: string;
  category: string;
  selectable: boolean;
  responsibilities: string[];
  securityContributions: {
    title: string;
    bullets: string[];
  }[];
}

interface RoleSelectionProps {
  onRoleSelect: (role: RoleTemplate) => void;
  selectedRole?: RoleTemplate;
}

export function RoleSelection({ onRoleSelect, selectedRole }: RoleSelectionProps) {
  const [roles, setRoles] = useState<RoleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch role templates
  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/v1/role-templates');
      const data = await response.json();
      if (data.success) {
        setRoles(data.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Filter roles based on search and category
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.focus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || role.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(roles.map(role => role.category)))];

  const getSecurityLevel = (role: RoleTemplate) => {
    const highSecurityRoles = ['Backend Developer', 'Full Stack Developer', 'Blockchain Developer', 'Security Test Engineer'];
    const mediumHighRoles = ['Mobile Developer', 'Web Developer (Frontend)', 'QA Analyst', 'Release QA Engineer'];
    const mediumRoles = ['Test Automation Engineer', 'Performance Test Engineer', 'Product Designer'];

    if (highSecurityRoles.includes(role.title)) return { level: 'High', color: 'bg-red-100 text-red-800', score: '85-90' };
    if (mediumHighRoles.includes(role.title)) return { level: 'Medium-High', color: 'bg-orange-100 text-orange-800', score: '75-80' };
    if (mediumRoles.includes(role.title)) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800', score: '65-70' };
    return { level: 'Lower', color: 'bg-green-100 text-green-800', score: '55-60' };
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading roles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Select Role Template</h2>
        <Badge variant="outline">
          {filteredRoles.length} of {roles.length} roles
        </Badge>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Search Roles</Label>
          <Input
            id="search"
            placeholder="Search by role title, focus, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => {
          const securityLevel = getSecurityLevel(role);
          const isSelected = selectedRole?.id === role.id;

          return (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
              onClick={() => onRoleSelect(role)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{role.title}</CardTitle>
                    <p className="text-sm text-gray-600 mb-2">{role.focus}</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{role.category}</Badge>
                      <Badge className={securityLevel.color}>
                        {securityLevel.level} ({securityLevel.score})
                      </Badge>
                    </div>
                  </div>
                  {isSelected && (
                    <Badge className="bg-blue-500 text-white">Selected</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Responsibilities:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {role.responsibilities.slice(0, 3).map((resp, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                      {role.responsibilities.length > 3 && (
                        <li className="text-blue-600 text-xs">+{role.responsibilities.length - 3} more...</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-1">Security Contributions:</h4>
                    <div className="space-y-2">
                      {role.securityContributions.slice(0, 2).map((contribution, index) => (
                        <div key={index} className="text-xs">
                          <div className="font-medium text-gray-700">{contribution.title}</div>
                          <ul className="text-gray-600 mt-1 space-y-1">
                            {contribution.bullets.slice(0, 2).map((bullet, bulletIndex) => (
                              <li key={bulletIndex} className="flex items-start gap-1">
                                <span className="text-green-500 mt-1">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                            {contribution.bullets.length > 2 && (
                              <li className="text-green-600 text-xs">+{contribution.bullets.length - 2} more...</li>
                            )}
                          </ul>
                        </div>
                      ))}
                      {role.securityContributions.length > 2 && (
                        <div className="text-blue-600 text-xs">+{role.securityContributions.length - 2} more security areas...</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No roles found matching your search criteria.
        </div>
      )}

      {/* Security Level Legend */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Security Level Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800">High (85-90)</Badge>
                <span>Backend, Full Stack, Blockchain, Security Test Engineer</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800">Medium-High (75-80)</Badge>
                <span>Mobile, Web Frontend, QA Analyst, Release QA</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-800">Medium (65-70)</Badge>
                <span>Test Automation, Performance Test, Product Designer</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Lower (55-60)</Badge>
                <span>UI/UX Design, QA Tester, UAT Tester</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 