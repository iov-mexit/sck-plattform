'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Shield, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface RoleTemplate {
  id: string;
  title: string;
  focus: string;
  category: string;
  selectable: boolean;
  responsibilities: string[];
  securityContributions: Array<{
    title: string;
    bullets: string[];
  }>;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function RoleTemplatesPage() {
  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<RoleTemplate | null>(null);

  const fetchRoleTemplates = async () => {
    try {
      setError(null);
      const response = await fetch('/api/v1/role-templates');
      const data = await response.json();

      if (data.success) {
        setRoleTemplates(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch role templates');
      }
    } catch (err) {
      console.error('Error fetching role templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch role templates');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRoleTemplates();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRoleTemplates();
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this role template? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/role-templates/${templateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchRoleTemplates();
        alert('Role template deleted successfully');
      } else {
        throw new Error('Failed to delete role template');
      }
    } catch (err) {
      console.error('Error deleting role template:', err);
      alert('Failed to delete role template');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Security':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'Design':
        return <Eye className="h-4 w-4 text-purple-500" />;
      case 'Product':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'Architecture':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'QA':
        return <CheckCircle className="h-4 w-4 text-yellow-500" />;
      case 'DevOps':
        return <RefreshCw className="h-4 w-4 text-orange-500" />;
      case 'Solution Design':
        return <Shield className="h-4 w-4 text-indigo-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Security':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Design':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Product':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Architecture':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'QA':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DevOps':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Solution Design':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter templates based on search and category
  const filteredTemplates = roleTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.focus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(roleTemplates.map(t => t.category)))];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Role Templates</h1>
          <p className="text-gray-600 mt-2">
            Manage role templates and their security contributions
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading role templates...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role Templates</h1>
            <p className="text-gray-600 mt-2">
              Manage role templates and their security contributions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading role templates</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(template.category)}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit template"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete template"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{template.focus}</p>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Responsibilities</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {template.responsibilities.slice(0, 3).map((resp, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {resp}
                      </li>
                    ))}
                    {template.responsibilities.length > 3 && (
                      <li className="text-gray-500 italic">
                        +{template.responsibilities.length - 3} more...
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Security Contributions</h4>
                  <div className="space-y-2">
                    {template.securityContributions.slice(0, 2).map((contribution, index) => (
                      <div key={index}>
                        <p className="text-xs font-medium text-gray-800">{contribution.title}</p>
                        <ul className="text-xs text-gray-600 mt-1 space-y-1">
                          {contribution.bullets.slice(0, 2).map((bullet, bulletIndex) => (
                            <li key={bulletIndex} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created {formatDate(template.createdAt)}</span>
                  <span className={`px-2 py-1 rounded ${template.selectable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {template.selectable ? 'Selectable' : 'System'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && !loading && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No templates found' : 'No role templates yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first role template to get started'
            }
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Template
            </button>
          )}
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{roleTemplates.length}</div>
            <div className="text-sm text-gray-600">Total Templates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{filteredTemplates.length}</div>
            <div className="text-sm text-gray-600">Filtered Results</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {roleTemplates.filter(t => t.selectable).length}
            </div>
            <div className="text-sm text-gray-600">Selectable</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Array.from(new Set(roleTemplates.map(t => t.category))).length}
            </div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
} 