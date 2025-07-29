'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { organizationService } from '@/lib/services/organization-service';
import React from 'react';
import { WelcomeStep } from '@/components/onboarding/welcome-step';
import { OrganizationSetupStep } from '@/components/onboarding/organization-setup-step';
import { RoleTemplatesStep } from '@/components/onboarding/role-templates-step';
import { RoleAgentCreationStep } from '@/components/onboarding/digital-twin-creation-step';

export default function OnboardingPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome',
      description: 'Get started with Secure Code KnAIght',
      icon: Shield,
      component: WelcomeStep,
    },
    {
      title: 'Organization Setup',
      description: 'Configure your organization settings',
      icon: CheckCircle,
      component: OrganizationSetupStep,
    },
    {
      title: 'Role Templates',
      description: 'Select role templates for your team',
      icon: CheckCircle,
      component: RoleTemplatesStep,
    },
    {
      title: 'Role Agent Creation',
      description: 'Create your first role agents',
      icon: CheckCircle,
      component: RoleAgentCreationStep,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      if (user?.organization?.domain) {
        await organizationService.updateOnboarding(user.organization.domain, true);
      }
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const handleSkipOnboarding = () => {
    router.push('/dashboard');
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Onboarding</h1>
            <p className="text-gray-600">Complete your setup to get started</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mx-auto mb-4">
              {React.createElement(steps[currentStep].icon, { className: "h-8 w-8 text-blue-600" })}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>

          <CurrentStepComponent
            onNext={handleNext}
            onBack={handlePrevious}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handleSkipOnboarding}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Skip Onboarding
          </button>
          <div className="flex space-x-4">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
