'use client';

import { AuthProvider, useAuth } from '@/lib/auth/auth-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';

function HomeContent() {
  const {
    isAuthenticated,
    user,
    loading,
    walletConnection,
    connectWallet,
    disconnectWallet
  } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to appropriate page
  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      // Check if user needs onboarding
      if (user.organization && !user.organization.onboardingComplete) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  const handleWalletConnect = async () => {
    try {
      await connectWallet();
      // The useEffect will handle routing when authentication state changes
    } catch (error) {
      console.error('Wallet connection failed:', error);
      // Fallback to magic link if wallet connection fails
      router.push('/auth/magic-link');
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Welcome back! Taking you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header showAuth={true} />

      {/* Hero Section */}
      <HeroSection
        category="Role Agents + Compliance"
        title={[
          "Agents enabling",
          "trust-verified",
          "compliance"
        ]}
        description="SCK is the infrastructure powering autonomous compliance markets by enabling non-custodial role agents that execute sophisticated regulatory strategies with blockchain-verified trust."
        primaryAction={{
          text: "Deploy an Agent",
          href: "/auth/magic-link",
          onClick: handleWalletConnect
        }}
        secondaryAction={{
          text: "Learn more",
          href: "/about"
        }}
      />

      {/* Wallet Connection Status */}
      {walletConnection.isConnected && walletConnection.address && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Wallet Connected</p>
                <p className="text-xs text-green-600">
                  {walletConnection.address.slice(0, 6)}...{walletConnection.address.slice(-4)}
                </p>
              </div>
              <button
                onClick={disconnectWallet}
                className="text-xs text-green-600 hover:text-green-800"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {walletConnection.error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{walletConnection.error}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2024 SCK Platform. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-black transition-colors">Privacy</a>
              <a href="#" className="hover:text-black transition-colors">Terms</a>
              <a href="#" className="hover:text-black transition-colors">Support</a>
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
    </AuthProvider>
  );
}
