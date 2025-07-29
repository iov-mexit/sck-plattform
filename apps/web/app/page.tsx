'use client';

import { AuthProvider, useAuth } from '@/lib/auth/auth-context';
import { MagicLinkLogin, OptionalWalletConnection } from '@/components/auth/magic-link-login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { Shield, Zap, Users, Lock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

function HomeContent() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Show splash for 3 seconds, then fade to main content
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Check onboarding state and route accordingly
  useEffect(() => {
    if (isAuthenticated && user && !loading && !showSplash) {
      // If user has an organization and onboarding is complete, go to dashboard
      if (user.organization && user.organization.onboardingComplete) {
        router.push('/dashboard');
      }
      // If user has an organization but onboarding is not complete, go to onboarding
      else if (user.organization && !user.organization.onboardingComplete) {
        router.push('/onboarding');
      }
      // If user has a wallet address (indicating they've used the platform before), go to dashboard
      else if (user.walletAddress) {
        router.push('/dashboard');
      }
      // For new users without organization or wallet, go to onboarding
      else {
        router.push('/onboarding');
      }
    }
  }, [isAuthenticated, user, loading, router, showSplash]);

  // Splash screen with animated steps
  useEffect(() => {
    if (showSplash) {
      const stepTimer = setInterval(() => {
        setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 800);

      return () => clearInterval(stepTimer);
    }
  }, [showSplash]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Secure Code KnAIght...</p>
        </div>
      </div>
    );
  }

  // Show loading state while checking onboarding and routing
  if (isAuthenticated && user && !showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Welcome back! Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show splash screen
  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          {/* Logo and Brand */}
          <div className="mb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Secure Code KnAIght</h1>
            <p className="text-xl text-blue-200">Enterprise Role Agent Platform</p>
          </div>

          {/* Loading Steps */}
          <div className="space-y-4 mb-8">
            <div className={`flex items-center justify-center space-x-3 transition-opacity duration-500 ${currentStep >= 0 ? 'opacity-100' : 'opacity-50'}`}>
              <CheckCircle className={`h-5 w-5 ${currentStep >= 0 ? 'text-green-400' : 'text-gray-400'}`} />
              <span>Initializing secure environment</span>
            </div>
            <div className={`flex items-center justify-center space-x-3 transition-opacity duration-500 ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}>
              <CheckCircle className={`h-5 w-5 ${currentStep >= 1 ? 'text-green-400' : 'text-gray-400'}`} />
              <span>Loading role agent protocols</span>
            </div>
            <div className={`flex items-center justify-center space-x-3 transition-opacity duration-500 ${currentStep >= 2 ? 'opacity-100' : 'opacity-50'}`}>
              <CheckCircle className={`h-5 w-5 ${currentStep >= 2 ? 'text-green-400' : 'text-gray-400'}`} />
              <span>Establishing trust constellation</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show main landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Secure Code KnAIght</h1>
                <p className="text-sm text-gray-600">Role Agent Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Team Collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Secure Code KnAIght
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your enterprise-grade platform for role agent management, secure authentication,
              and blockchain-powered identity verification.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Authentication</h3>
              <p className="text-gray-600">
                Passwordless login with Magic Link and optional wallet connection for blockchain features.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Role Agent Management</h3>
              <p className="text-gray-600">
                Create and manage digital representations of your team members and organizations.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Blockchain Integration</h3>
              <p className="text-gray-600">
                NFT-based achievements and verifiable credentials on the blockchain.
              </p>
            </div>
          </div>

          {/* Authentication Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h3>
              <p className="text-gray-600">
                Choose your preferred authentication method to access the platform
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <MagicLinkLogin />
              <OptionalWalletConnection />
            </div>

            {/* Platform Features Preview */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Platform Features
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Signal Collection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Trust Dashboard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>NFT Minting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2024 Secure Code KnAIght. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <HomeContent />
      <ToastContainer />
    </AuthProvider>
  );
}
