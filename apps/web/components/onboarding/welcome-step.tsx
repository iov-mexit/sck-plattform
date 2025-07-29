'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Shield, Users, Lock } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  const { user } = useAuth();

  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">Security First</span>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <Users className="h-5 w-5" />
            <span className="text-sm font-medium">Team Management</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-600">
            <Lock className="h-5 w-5" />
            <span className="text-sm font-medium">Role Agents</span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-2">Your Organization</h4>
          <div className="space-y-2 text-sm">
            <p className="text-blue-800">
              <span className="font-medium">Name:</span> {user?.organization?.name || 'Not configured'}
            </p>
            <p className="text-blue-800">
              <span className="font-medium">Domain:</span> {user?.organization?.domain || 'Not configured'}
            </p>
            <p className="text-blue-800">
              <span className="font-medium">Status:</span>
              <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {user?.organization?.onboardingComplete ? 'Onboarding Complete' : 'Setup Required'}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            We'll help you set up your organization for secure role agent management.
            This includes configuring security settings, role templates, and creating your first role agents.
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
} 