'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  Home,
  Grid3X3,
  Settings,
  Bell,
  Menu,
  ChevronDown,
  Users,
  Search,
  FileCheck
} from 'lucide-react';
// Wallet connection UI removed for backend-only blockchain operations

const simplifiedNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Role Agents', href: '/role-agents', icon: Users },
  { name: 'Services', href: '/services', icon: Grid3X3 },
  { name: 'Team Composition', href: '/team-composition', icon: Users },
  { name: 'RAG Search', href: '/rag/search', icon: Search },
  { name: 'Policy Approval', href: '/rag/approval-dashboard', icon: FileCheck },
  { name: 'LoA Management', href: '/loa-management', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center bg-black">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-black">SCK</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 text-sm text-gray-600">
            {simplifiedNavigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 hover:text-black transition-colors ${isActive ? 'text-black font-medium' : ''
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-black transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* Wallet Connection removed */}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-black transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}