'use client';

import React from 'react';
import { Plus, Users, Shield, Activity } from 'lucide-react';
import Link from 'next/link';

export default function RoleAgentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Role Agents</h1>
        <p className="text-gray-600 mt-2">
          Manage your digital twins and role assignments
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Create Role Agent</h3>
              <p className="text-gray-600 text-sm mt-1">Add a new digital twin</p>
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
              <h3 className="text-lg font-semibold text-gray-900">Bulk Upload</h3>
              <p className="text-gray-600 text-sm mt-1">Import multiple agents</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
          <button className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Upload CSV
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Role Templates</h3>
              <p className="text-gray-600 text-sm mt-1">Manage role definitions</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
          <button className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            View Templates
          </button>
        </div>
      </div>

      {/* Agent List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Role Agents</h2>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium">No role agents yet</p>
            <p className="text-sm">Create your first role agent to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
} 