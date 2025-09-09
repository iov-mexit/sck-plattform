'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth/auth-context';
import { MagicLinkLogin, OptionalWalletConnection } from '@/components/auth/magic-link-login';

export default function MagicLinkPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-black">Sign in with Email</h1>
            <p className="text-gray-600">We use Magic Link for passwordless authentication.</p>
          </div>
          <MagicLinkLogin />
          <OptionalWalletConnection />
        </div>
      </div>
    </AuthProvider>
  );
}


