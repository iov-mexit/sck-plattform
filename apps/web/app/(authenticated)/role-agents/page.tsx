'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Users, Shield, Activity, RefreshCw, AlertCircle, CheckCircle, Clock, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

interface RoleAgent {
  id: string;
  name: string;
  description?: string;
  assignedToDid: string;
  trustScore?: number;
  isEligibleForMint: boolean;
  status: string;
  level: number;
  createdAt: string;
  updatedAt: string;
  // ANS Integration fields
  ansIdentifier?: string;
  ansRegistrationStatus?: 'pending' | 'registered' | 'failed' | 'not_registered';
  ansRegistrationError?: string;
  ansVerificationUrl?: string;
  roleTemplate: {
    id: string;
    title: string;
    focus: string;
    category: string;
  };
  organization: {
    id: string;
    name: string;
    domain: string;
  };
}

export default function RoleAgentsPage() {
  const [roleAgents, setRoleAgents] = useState<RoleAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [updatingTerminology, setUpdatingTerminology] = useState(false);

  const fetchRoleAgents = async () => {
    try {
      setError(null);
      const response = await fetch('/api/v1/role-agents');
      const data = await response.json();

      if (data.success) {
        setRoleAgents(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to fetch role agents');
      }
    } catch (err) {
      console.error('Error fetching role agents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch role agents');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRoleAgents();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRoleAgents();
  };

  const handleUpdateTerminology = async () => {
    try {
      setUpdatingTerminology(true);
      setError(null);

      const response = await fetch('/api/v1/role-agents/update-terminology', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the role agents list after updating terminology
        await fetchRoleAgents();
        alert(`Successfully updated terminology for ${data.updatedCount} role agents!`);
      } else {
        throw new Error(data.error || 'Terminology update failed');
      }
    } catch (err) {
      console.error('Error updating terminology:', err);
      setError(err instanceof Error ? err.message : 'Failed to update terminology');
    } finally {
      setUpdatingTerminology(false);
    }
  };

  const handleMigrateTemplates = async () => {
    try {
      setMigrating(true);
      setError(null);

      const response = await fetch('/api/v1/role-agents/migrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        await fetchRoleAgents();
        alert(`Successfully migrated ${data.migratedCount} role templates to agents!`);
      } else {
        throw new Error(data.error || 'Migration failed');
      }
    } catch (err) {
      console.error('Error migrating templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to migrate templates');
    } finally {
      setMigrating(false);
    }
  };

  const handleANSRegistration = async (agentId: string) => {
    try {
      setError(null);

      const response = await fetch(`/api/v1/role-agents/${agentId}/register-ans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        await fetchRoleAgents(); // Refresh to show updated ANS status
        alert(`ANS registration ${data.data.status === 'registered' ? 'successful' : 'initiated'}!`);
      } else {
        throw new Error(data.error || 'ANS registration failed');
      }
    } catch (err) {
      console.error('Error registering to ANS:', err);
      setError(err instanceof Error ? err.message : 'Failed to register to ANS');
    }
  };

  const getANSStatusBadge = (agent: RoleAgent) => {
    if (!agent.ansRegistrationStatus || agent.ansRegistrationStatus === 'not_registered') {
      return (
        <button
          onClick={() => handleANSRegistration(agent.id)}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          <LinkIcon className="h-3 w-3 mr-1" />
          Register to ANS
        </button>
      );
    }

    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      registered: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      failed: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
    };

    const config = statusConfig[agent.ansRegistrationStatus];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {agent.ansRegistrationStatus === 'registered' ? 'ANS Registered' :
          agent.ansRegistrationStatus === 'pending' ? 'ANS Pending' : 'ANS Failed'}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'suspended':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'suspended':
        return 'Suspended';
      default:
        return 'Unknown';
    }
  };

  const getEligibilityBadge = (agent: RoleAgent) => {
    if (agent.isEligibleForMint) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Eligible for NFT
        </span>
      );
    } else if (agent.trustScore && agent.trustScore > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3 mr-1" />
          Building Trust
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Activity className="h-3 w-3 mr-1" />
          No Trust Score
        </span>
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Role Agents</h1>
          <p className="text-gray-600 mt-2">
            Manage your role agents and assignments
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading role agents...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Role Agents</h1>
            <p className="text-gray-600 mt-2">
              Manage your role agents and assignments
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Create Role Agent</h3>
              <p className="text-gray-600 text-sm mt-1">Add a new role agent</p>
            </div>
            <Plus className="h-8 w-8 text-blue-600" />
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Create New Agent
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Update Terminology</h3>
              <p className="text-gray-600 text-sm mt-1">Fix existing database records</p>
            </div>
            <RefreshCw className="h-8 w-8 text-red-600" />
          </div>
          <button
            onClick={handleUpdateTerminology}
            disabled={updatingTerminology}
            className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updatingTerminology ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                Updating...
              </>
            ) : (
              'Fix Database Records'
            )}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Migrate Templates</h3>
              <p className="text-gray-600 text-sm mt-1">Convert all role templates to agents</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
          <button
            onClick={handleMigrateTemplates}
            disabled={migrating}
            className="mt-4 w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {migrating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                Migrating...
              </>
            ) : (
              'Migrate All Templates'
            )}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bulk Upload</h3>
              <p className="text-gray-600 text-sm mt-1">Import multiple agents</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <button className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Upload CSV
          </button>
        </div>

        <Link href="/role-templates" className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Role Templates</h3>
              <p className="text-gray-600 text-sm mt-1">Manage role definitions</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-center">
            View Templates
          </div>
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading role agents</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Agent List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Role Agents ({roleAgents.length})
            </h2>
            <div className="text-sm text-gray-500">
              {roleAgents.filter(agent => agent.status === 'active').length} active
            </div>
          </div>
        </div>

        <div className="p-6">
          {roleAgents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium">No role agents yet</p>
              <p className="text-sm">Create your first role agent to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {roleAgents.map((agent) => (
                <div key={agent.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(agent.status)}
                        <span className="text-sm text-gray-500">{getStatusText(agent.status)}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-600">{agent.roleTemplate.title}</p>
                        <p className="text-xs text-gray-500 font-mono">{agent.assignedToDid}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="mb-2">
                        {getEligibilityBadge(agent)}
                      </div>
                      <div className="mb-2">
                        {getANSStatusBadge(agent)}
                      </div>
                      {agent.trustScore && (
                        <div className="text-sm text-gray-600">
                          Trust Score: <span className="font-medium">{agent.trustScore}/1000</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Level {agent.level} • Created {formatDate(agent.createdAt)}
                      </div>
                      {agent.ansIdentifier && (
                        <div className="text-xs text-gray-500 mt-1 font-mono">
                          ANS: {agent.ansIdentifier}
                        </div>
                      )}
                    </div>
                  </div>

                  {agent.description && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600">{agent.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 