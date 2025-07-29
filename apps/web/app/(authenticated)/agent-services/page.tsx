'use client';

import React from 'react';
import { Bot, Shield, Store, Users, TrendingUp, Activity } from 'lucide-react';

export default function AgentServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agent Services</h1>
        <p className="text-gray-600 mt-2">
          AI-powered mentor, verifier, and marketplace agents
        </p>
      </div>

      {/* Service Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Mentor Agents */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bot className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Mentor Agents</h3>
          </div>
          <p className="text-gray-600 mb-4">
            AI-powered agents that provide guidance and tips for building trust scores and achieving milestones.
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
              <span>Score optimization tips</span>
            </div>
            <div className="flex items-center text-sm">
              <Activity className="h-4 w-4 text-blue-500 mr-2" />
              <span>Goal setting assistance</span>
            </div>
            <div className="flex items-center text-sm">
              <Shield className="h-4 w-4 text-purple-500 mr-2" />
              <span>Trust building strategies</span>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Activate Mentor
          </button>
        </div>

        {/* Verifier Agents */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Verifier Agents</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Proof validators that verify external attestations and certifications for enhanced trust scores.
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <Shield className="h-4 w-4 text-green-500 mr-2" />
              <span>Certification verification</span>
            </div>
            <div className="flex items-center text-sm">
              <Activity className="h-4 w-4 text-blue-500 mr-2" />
              <span>External attestation validation</span>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
              <span>Score enhancement</span>
            </div>
          </div>
          <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            Activate Verifier
          </button>
        </div>

        {/* Marketplace Agents */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Store className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-3">Marketplace Agents</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Connect with external organizations offering achievements, certifications, and opportunities.
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm">
              <Store className="h-4 w-4 text-green-500 mr-2" />
              <span>External opportunities</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 text-blue-500 mr-2" />
              <span>Network connections</span>
            </div>
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-purple-500 mr-2" />
              <span>Career advancement</span>
            </div>
          </div>
          <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            Browse Marketplace
          </button>
        </div>
      </div>

      {/* Active Services */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Services</h3>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500 py-8">
            <Bot className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium">No active services</p>
            <p className="text-sm">Activate a service to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
} 