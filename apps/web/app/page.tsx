'use client';

import { AuthProvider, useAuth } from '@/lib/auth/auth-context';
import { useState, useEffect } from 'react';
import { Shield, ArrowUpRight, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

  // Redirect authenticated users to agents page
  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      router.push('/agents');
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
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center bg-black">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">SCK</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8 text-sm text-gray-600">
              <a href="#" className="hover:text-black transition-colors">Home</a>
              <a href="#" className="hover:text-black transition-colors">About</a>
              <a href="#" className="hover:text-black transition-colors">Docs</a>
              <a href="#" className="hover:text-black transition-colors">Blog</a>
              <a href="#" className="hover:text-black transition-colors">Press</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Abstract Dotted Pattern */}
      <div className="relative h-96 bg-white overflow-hidden">
        <div className="absolute inset-0">
          {/* Abstract dotted pattern - simplified version */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="grid grid-cols-20 gap-1">
              {Array.from({ length: 400 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-black rounded-full"
                  style={{
                    opacity: Math.random() * 0.8 + 0.2,
                    transform: `translateY(${Math.sin(i * 0.1) * 20}px)`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 -mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Side */}
            <div>
              <div className="mb-4">
                <span className="text-sm text-gray-500">• Role Agents + Compliance</span>
              </div>
              <h1 className="text-5xl font-bold text-black leading-tight mb-6">
                <span className="block">Agents enabling</span>
                <span className="block">trust-verified</span>
                <span className="block">compliance</span>
              </h1>
            </div>

            {/* Right Side */}
            <div>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                SCK is the infrastructure powering autonomous compliance markets by enabling non-custodial role agents that execute sophisticated regulatory strategies with blockchain-verified trust.
              </p>

              <div className="space-y-4">
                {/* Show connected state if wallet is connected */}
                {walletConnection.isConnected && walletConnection.address ? (
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
                ) : (
                  <button
                    onClick={handleWalletConnect}
                    disabled={walletConnection.isConnecting || loading}
                    className="w-full bg-black text-white px-6 py-4 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {walletConnection.isConnecting || loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="h-5 w-5" />
                        <span>Connect Wallet</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}

                {/* Show error if wallet connection failed */}
                {walletConnection.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">{walletConnection.error}</p>
                  </div>
                )}

                <div className="text-center">
                  <a href="/auth/magic-link" className="text-sm text-gray-600 hover:text-black transition-colors">
                    Or use email authentication
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
