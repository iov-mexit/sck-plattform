'use client';

import { AuthProvider, useAuth } from '@/lib/auth/auth-context';
import { MagicLinkLogin } from '@/components/auth/magic-link-login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { Shield, Zap, Users, Lock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

function HomeContent() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);

  // Redirect authenticated users to dashboard once client is ready
  useEffect(() => {
    console.log('🔍 Root Page - Auth State:', { isAuthenticated, user: !!user, loading, showSplash });
    if (isAuthenticated && user && !loading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, loading, router, showSplash]);

  // Always render landing page for unauthenticated users (no blocking spinner)
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Welcome back! Taking you to your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show main landing page for unauthenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                <p className="text-sm text-gray-600">Enterprise Role Agent Platform</p>
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
        <div className="w-full max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Transform Your Team with
              <span className="text-blue-600"> AI-Powered Role Agents</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Stop managing chaos. Start orchestrating success. Our enterprise platform turns your team roles into intelligent, trust-verified agents that deliver measurable results.
            </p>

            {/* Key Value Props */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mb-4 mx-auto">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Trust-Verified Roles</h3>
                <p className="text-gray-600">
                  Replace manual oversight with AI-driven trust scoring and blockchain-verified achievements.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 mb-4 mx-auto">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero-Friction Coordination</h3>
                <p className="text-gray-600">
                  Eliminate status meetings and manual tracking. Your roles self-organize and report automatically.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 mb-4 mx-auto">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Measurable Performance</h3>
                <p className="text-gray-600">
                  Get real-time insights into role performance, trust levels, and team dynamics with zero overhead.
                </p>
              </div>
            </div>
          </div>

          {/* Authentication Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h3>
              <p className="text-gray-600">
                Enter your email to access the platform and discover how role agents can transform your team.
              </p>
            </div>

            <MagicLinkLogin />

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                No passwords required. Secure, passwordless authentication via magic link.
              </p>
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
    <>
      <HomeContent />
      <ToastContainer />
    </>
  );
}
