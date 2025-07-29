'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  Users,
  Coins,
  BarChart3,
  TrendingUp,
  Bot,
  Network,
  Settings,
  Bell,
  Menu,
  X,
  Wallet,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useAccount, useDisconnect } from 'wagmi';

export function NavBar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
    },
    {
      href: '/role-agents',
      label: 'Role Agents',
      icon: Users,
    },
    {
      href: '/nft-minting',
      label: 'NFT Minting',
      icon: Coins,
    },
    {
      href: '/analytics',
      label: 'Analytics',
      icon: TrendingUp,
    },
    {
      href: '/agent-services',
      label: 'Agent Services',
      icon: Bot,
    },
    {
      href: '/constellation',
      label: 'Trust Constellation',
      icon: Network,
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected';

  return (
    <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SCK</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 ml-8">
              {navItems.slice(0, 6).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Notifications, Profile, Mobile menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile/Wallet Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              >
                <Wallet className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">{displayAddress}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">Connected Wallet</div>
                    <div className="text-xs text-gray-500">{address}</div>
                  </div>
                  <button
                    onClick={() => {
                      disconnect();
                      setIsProfileDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 