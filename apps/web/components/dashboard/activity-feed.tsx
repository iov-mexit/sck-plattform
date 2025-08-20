'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Users, 
  Coins, 
  Shield, 
  Zap, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Network,
  Bot,
  ArrowRight
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'agent_created' | 'nft_minted' | 'signal_received' | 'ans_registered' | 'trust_updated' | 'service_deployed';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error' | 'info';
  icon: any;
  color: string;
  metadata?: {
    agentName?: string;
    trustScore?: number;
    signalSource?: string;
    nftTokenId?: string;
    ansIdentifier?: string;
  };
}

interface ActivityFeedProps {
  limit?: number;
}

export function ActivityFeed({ limit = 8 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivityData();
  }, []);

  const loadActivityData = async () => {
    try {
      // Simulate loading activity data
      // In production, this would fetch from /api/v1/activity or similar
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'agent_created',
          title: 'New Role Agent Created',
          description: 'Security Engineer role agent has been deployed',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
          status: 'success',
          icon: Users,
          color: 'blue',
          metadata: {
            agentName: 'L3 Security Engineer'
          }
        },
        {
          id: '2',
          type: 'signal_received',
          title: 'External Trust Signal',
          description: 'Received trust score from SCW API',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
          status: 'success',
          icon: Zap,
          color: 'green',
          metadata: {
            signalSource: 'SCW TrustScore API',
            trustScore: 850
          }
        },
        {
          id: '3',
          type: 'trust_updated',
          title: 'Trust Score Updated',
          description: 'DevOps Architect trust level increased',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          status: 'success',
          icon: TrendingUp,
          color: 'purple',
          metadata: {
            agentName: 'L4 DevOps Architect',
            trustScore: 875
          }
        },
        {
          id: '4',
          type: 'nft_minted',
          title: 'Achievement NFT Minted',
          description: 'Security Engineer achievement credential created',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
          status: 'success',
          icon: Coins,
          color: 'yellow',
          metadata: {
            agentName: 'L3 Security Engineer',
            nftTokenId: '#1234'
          }
        },
        {
          id: '5',
          type: 'ans_registered',
          title: 'ANS Registration Pending',
          description: 'Security Engineer queued for public registry',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
          status: 'pending',
          icon: Shield,
          color: 'red',
          metadata: {
            agentName: 'L3 Security Engineer',
            ansIdentifier: 'L3-Security-Engineer.securecorp.knaight'
          }
        },
        {
          id: '6',
          type: 'service_deployed',
          title: 'AI Service Deployed',
          description: 'Code review automation service activated',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
          status: 'success',
          icon: Bot,
          color: 'indigo',
          metadata: {
            agentName: 'L4 DevOps Architect'
          }
        },
        {
          id: '7',
          type: 'signal_received',
          title: 'GitHub Security Signal',
          description: 'Repository security analysis completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
          status: 'success',
          icon: Zap,
          color: 'green',
          metadata: {
            signalSource: 'GitHub Security',
            trustScore: 920
          }
        },
        {
          id: '8',
          type: 'trust_updated',
          title: 'Constellation Updated',
          description: 'Trust network visualization refreshed',
          timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
          status: 'info',
          icon: Network,
          color: 'orange'
        }
      ];

      setActivities(mockActivities.slice(0, limit));
    } catch (error) {
      console.error('Error loading activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'pending': return Clock;
      case 'error': return AlertCircle;
      case 'info': return Activity;
      default: return Clock;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now.getTime() - activityTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return activityTime.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'agent_created': return Users;
      case 'nft_minted': return Coins;
      case 'signal_received': return Zap;
      case 'ans_registered': return Shield;
      case 'trust_updated': return TrendingUp;
      case 'service_deployed': return Bot;
      default: return Activity;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <Button variant="outline" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const StatusIcon = getStatusIcon(activity.status);
            
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                {/* Activity Icon */}
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg bg-${activity.color}-100`}>
                    <Icon className={`h-4 w-4 text-${activity.color}-600`} />
                  </div>
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </h4>
                    <Badge className={getStatusColor(activity.status)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {activity.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.description}
                  </p>

                  {/* Metadata */}
                  {activity.metadata && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {activity.metadata.agentName && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.metadata.agentName}
                        </Badge>
                      )}
                      {activity.metadata.trustScore && (
                        <Badge variant="secondary" className="text-xs">
                          Trust: {activity.metadata.trustScore}
                        </Badge>
                      )}
                      {activity.metadata.signalSource && (
                        <Badge variant="secondary" className="text-xs">
                          {activity.metadata.signalSource}
                        </Badge>
                      )}
                      {activity.metadata.nftTokenId && (
                        <Badge variant="secondary" className="text-xs">
                          NFT: {activity.metadata.nftTokenId}
                        </Badge>
                      )}
                      {activity.metadata.ansIdentifier && (
                        <Badge variant="secondary" className="text-xs">
                          ANS: {activity.metadata.ansIdentifier}
                        </Badge>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400">Actions and updates will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 