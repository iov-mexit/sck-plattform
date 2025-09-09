'use client';

import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

interface HeaderProps {
  showAuth?: boolean;
  className?: string;
}

export function Header({ showAuth = false, className = '' }: HeaderProps) {
  return (
    <header className={`bg-white border-b border-gray-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center bg-black">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">SCK</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-black transition-colors">
              About
            </Link>
            <Link href="/docs" className="hover:text-black transition-colors">
              Docs
            </Link>
            <Link href="/blog" className="hover:text-black transition-colors">
              Blog
            </Link>
            <Link href="/press" className="hover:text-black transition-colors">
              Press
            </Link>
          </nav>

          {/* Auth Section */}
          {showAuth && (
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/magic-link"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                Sign in
              </Link>
              <Link 
                href="/auth/magic-link"
                className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
