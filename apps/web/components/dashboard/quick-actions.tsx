'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Plus, 
  Users, 
  Network, 
  Coins, 
  TrendingUp, 
  Bot,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  priority: 'high' | 'medium' | 'low';
  status: 'available' | 'pending' | 'completed';
  shortcut?: string;
}

interface QuickActionsProps {
  userType: 'new' | 'active' | 'advanced';
  stats: {
    totalAgents: number;
    eligibleAgents: number;
    totalOrganizations: number;
    totalTemplates: number;
  };
}

export function QuickActions({ userType, stats }: QuickActionsProps) {
  const getQuickActions = (): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        id: 'create-agent',
        title: 'Create Role Agent',
        description: 'Set up a new AI-powered role agent',
        icon: Plus,
        route: '/role-agents/create',
        priority: 'high',
        status: 'available',
        shortcut: '⌘+N'
      },
      {
        id: 'view-constellation',
        title: 'View Trust Network',
        description: 'Explore your team\'s trust relationships',
        icon: Network,
        route: '/constellation',
        priority: 'medium',
        status: 'available',
        shortcut: '⌘+T'
      },
      {
        id: 'mint-nft',
        title: 'Mint Achievement NFT',
        description: 'Create blockchain-verified credentials',
        icon: Coins,
        route: '/nft-minting',
        priority: stats.eligibleAgents > 0 ? 'high' : 'low',
        status: stats.eligibleAgents > 0 ? 'available' : 'pending',
        shortcut: '⌘+M'
      },
      {
        id: 'view-analytics',
        title: 'View Analytics',
        description: 'Check performance and trust metrics',
        icon: TrendingUp,
        route: '/analytics',
        priority: 'medium',
        status: 'available',
        shortcut: '⌘+A'
      },
      {
        id: 'connect-signals',
        title: 'Connect Signals',
        description: 'Link external trust data sources',
        icon: Zap,
        route: '/signals/connect',
        priority: 'medium',
        status: 'available',
        shortcut: '⌘+S'
      },
      {
        id: 'register-ans',
        title: 'Register to ANS',
        description: 'Publish agent to public registry',
        icon: Shield,
        route: '/ans/register',
        priority: 'low',
        status: 'pending',
        shortcut: '⌘+R'
      }
    ];

    // Filter based on user type
    switch (userType) {
      case 'new':
        return baseActions.filter(action => 
          ['create-agent', 'view-constellation'].includes(action.id)
        );
      case 'active':
        return baseActions.filter(action => 
          !['register-ans'].includes(action.id)
        );
      case 'advanced':
        return baseActions;
      default:
        return baseActions;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return CheckCircle;
      case 'pending': return Clock;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'completed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quick Actions
        </h2>
        <p className="text-gray-600">
          Get things done faster with these common tasks
        </p>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const StatusIcon = getStatusIcon(action.status);
          
          return (
            <Card 
              key={action.id} 
              className={`hover:shadow-lg transition-all duration-200 cursor-pointer group ${getPriorityColor(action.priority)}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="p-3 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
                      <Icon className="h-6 w-6 text-gray-700" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <StatusIcon className={`h-4 w-4 ${getStatusColor(action.status)}`} />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {action.description}
                    </p>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
                        asChild
                      >
                        <Link href={action.route}>
                          {action.status === 'available' ? 'Take Action' : 'View Details'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>

                      {/* Shortcut */}
                      {action.shortcut && (
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                          {action.shortcut}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Card className="text-center">
          <CardContent className="p-4">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.totalAgents}</p>
            <p className="text-sm text-gray-600">Active Agents</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Coins className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.eligibleAgents}</p>
            <p className="text-sm text-gray-600">NFT Eligible</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrganizations}</p>
            <p className="text-sm text-gray-600">Organizations</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Bot className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{stats.totalTemplates}</p>
            <p className="text-sm text-gray-600">Templates</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 