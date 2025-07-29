'use client';

import React from 'react';
import {
  Plus,
  Coins,
  Network,
  Users,
  Shield,
  TrendingUp,
  Activity,
  BarChart3,
  ArrowRight,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, Agent Commander</h1>
        <p className="text-gray-600 mt-2">
          Your command center for managing role agents and trust-based credentialing
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link href="/role-agents" className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Role Agent</h3>
          <p className="text-gray-600 text-sm">Add a new digital twin to your network</p>
        </Link>

        <Link href="/nft-minting" className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Coins className="h-6 w-6 text-green-600" />
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mint NFT</h3>
          <p className="text-gray-600 text-sm">Create achievement tokens for your agents</p>
        </Link>

        <Link href="/constellation" className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Network className="h-6 w-6 text-purple-600" />
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Signals</h3>
          <p className="text-gray-600 text-sm">Monitor trust constellation network</p>
        </Link>

        <Link href="/analytics" className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">View Analytics</h3>
          <p className="text-gray-600 text-sm">Track performance and metrics</p>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Role Agents</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Coins className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Minted NFTs</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Trust Average</p>
              <p className="text-2xl font-bold text-gray-900">8.4</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Signals</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Feed */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New role agent created</p>
                  <p className="text-sm text-gray-500">"Cybersecured Vibing" added to system</p>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Coins className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">NFT minted successfully</p>
                  <p className="text-sm text-gray-500">Achievement token for "Security Expert"</p>
                </div>
                <span className="text-sm text-gray-500">4 hours ago</span>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Trust score updated</p>
                  <p className="text-sm text-gray-500">Agent "Code Guardian" score increased to 8.2</p>
                </div>
                <span className="text-sm text-gray-500">6 hours ago</span>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Signal received</p>
                  <p className="text-sm text-gray-500">New security certification signal processed</p>
                </div>
                <span className="text-sm text-gray-500">8 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility Highlights */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Eligibility Highlights</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-green-900">Ready for NFT Minting</h4>
                  <Star className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-sm text-green-700 mb-2">Agents close to achievement threshold</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">Cybersecured Vibing</span>
                    <span className="font-medium text-green-900">8.7/9.0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-700">Security Expert</span>
                    <span className="font-medium text-green-900">8.4/9.0</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900">Trust Score Milestones</h4>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-sm text-blue-700 mb-2">Agents making significant progress</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">Code Guardian</span>
                    <span className="font-medium text-blue-900">+0.3 this week</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-700">Network Defender</span>
                    <span className="font-medium text-blue-900">+0.2 this week</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-900">Signal Map Preview</h4>
                  <Network className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-sm text-purple-700">Events flowing into system</p>
                <div className="mt-2 text-xs text-purple-600">
                  47 active signals • 12 pending verification • 3 new connections
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
