'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Users,
  Zap,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle,
  User,
  Building,
  Award,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export function OnboardingDashboard() {
  const { user, logout } = useAuth();

  const platformFeatures = [
    {
      icon: Users,
      title: 'Digital Twin Management',
      description: 'Create and manage digital representations of your team',
      status: 'Available',
      href: '/dashboard/digital-twins'
    },
    {
      icon: Activity,
      title: 'Signal Collection',
      description: 'Collect and analyze real-time signals from your systems',
      status: 'Available',
      href: '/dashboard/signals'
    },
    {
      icon: BarChart3,
      title: 'Trust Dashboard',
      description: 'Monitor trust scores and reputation metrics',
      status: 'Available',
      href: '/dashboard/trust'
    },
    {
      icon: Award,
      title: 'NFT Achievements',
      description: 'Mint and manage blockchain-based achievements',
      status: 'Available',
      href: '/dashboard/nfts'
    },
    {
      icon: Building,
      title: 'Organization Setup',
      description: 'Configure your organization and team structure',
      status: 'Setup Required',
      href: '/dashboard/organization'
    },
    {
      icon: Settings,
      title: 'Platform Settings',
      description: 'Customize your platform preferences and security',
      status: 'Available',
      href: '/dashboard/settings'
    }
  ];

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
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">{user?.email}</span>
              </div>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Secure Code KnAIght!
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Your account has been successfully authenticated. You now have access to all platform features.
              </p>
            </div>

            {/* User Info */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Logged in as:</span>
                  </div>
                  <Badge variant="secondary">{user?.email}</Badge>
                  {user?.walletAddress && (
                    <>
                      <span className="text-gray-400">|</span>
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">Wallet Connected</span>
                        <Badge variant="outline" className="text-xs">
                          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Platform Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <Badge
                      variant={feature.status === 'Setup Required' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={feature.href}>
                    <Button className="w-full" variant="outline">
                      <span>Access Feature</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Actions
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Setup Organization</h4>
              <p className="text-sm text-gray-600 mb-4">
                Configure your organization structure and team members
              </p>
              <Link href="/dashboard/organization">
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Create Digital Twin</h4>
              <p className="text-sm text-gray-600 mb-4">
                Create your first digital twin representation
              </p>
              <Link href="/dashboard/digital-twins">
                <Button size="sm" className="w-full">
                  Create Twin
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">View Signals</h4>
              <p className="text-sm text-gray-600 mb-4">
                Monitor real-time signals and analytics
              </p>
              <Link href="/dashboard/signals">
                <Button size="sm" className="w-full">
                  View Signals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 