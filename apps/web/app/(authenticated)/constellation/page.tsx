'use client';

import React from 'react';
import { Network, Users, Shield, Activity, TrendingUp } from 'lucide-react';

export default function ConstellationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trust Constellation</h1>
        <p className="text-gray-600 mt-2">
          Visual graph of agent-score-signal network and trust relationships
        </p>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Connected Agents</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Trust Connections</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Signals</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Network Strength</p>
              <p className="text-2xl font-bold text-gray-900">8.4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Constellation Graph */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Trust Network Visualization</h3>
        <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Network className="h-16 w-16 mx-auto mb-4" />
            <p className="text-lg font-medium">Trust Constellation Graph</p>
            <p className="text-sm">Interactive network visualization coming soon</p>
          </div>
        </div>
      </div>

      {/* Network Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Connected Agents */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Connected Agents</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Cybersecured Vibing</p>
                    <p className="text-sm text-gray-500">Trust Score: 8.7</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">3 connections</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Security Expert</p>
                    <p className="text-sm text-gray-500">Trust Score: 8.4</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">5 connections</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Code Guardian</p>
                    <p className="text-sm text-gray-500">Trust Score: 7.9</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">2 connections</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Trust Signals</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="p-1 bg-green-100 rounded">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Certification Verified</p>
                  <p className="text-xs text-gray-500">Cybersecured Vibing → Security+</p>
                </div>
                <span className="text-xs text-gray-500">2h ago</span>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="p-1 bg-blue-100 rounded">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Score Increased</p>
                  <p className="text-xs text-gray-500">Security Expert +0.3</p>
                </div>
                <span className="text-xs text-gray-500">4h ago</span>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="p-1 bg-purple-100 rounded">
                  <Network className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New Connection</p>
                  <p className="text-xs text-gray-500">Code Guardian ↔ Security Expert</p>
                </div>
                <span className="text-xs text-gray-500">6h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 