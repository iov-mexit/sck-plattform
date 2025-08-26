'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/navigation';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('🔍 Authenticated Layout - Auth State:', { isAuthenticated, loading });

    // Redirect unauthenticated users to login
    if (!loading && !isAuthenticated) {
      console.log('🔍 Redirecting unauthenticated user to login page');
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render authenticated layout
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2024 Secure Code KnAIght. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <a href="/SCK_PLATFORM_SITEMAP.md" target="_blank" className="text-blue-600 hover:underline">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 