'use client';

import React from 'react';
import { NavBar } from '@/components/navigation';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
} 