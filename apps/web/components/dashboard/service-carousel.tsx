'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Shield,
  TrendingUp,
  Network,
  Bot,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Settings,
  Lock,
  Key,
  Activity
} from 'lucide-react';

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  actions: string[];
  route: string;
  status: 'active' | 'pending' | 'completed' | 'locked' | 'warning';
  stats?: string;
  progress?: number;
  category: 'pam' | 'mcp' | 'trust' | 'governance' | 'analytics';
}

interface ServiceCarouselProps {
  userType: 'new' | 'active' | 'advanced';
  stats: {
    totalAgents: number;
    eligibleAgents: number;
    totalOrganizations: number;
    totalTemplates: number;
    totalPolicies: number;
    pendingApprovals: number;
    activeMCPs: number;
  };
}

export function ServiceCarousel({ userType, stats }: ServiceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Enhanced service cards based on PAM + Trust-Gated MCP use cases
  const getServiceCards = (): ServiceCard[] => {
    const baseServices: ServiceCard[] = [
      {
        id: 'role-agents',
        title: 'Role Agents',
        description: 'Create and manage AI-powered role agents with trust-based access control',
        icon: Users,
        color: 'blue',
        actions: ['Create Agent', 'View All', 'Manage Access'],
        route: '/role-agents',
        status: 'active',
        stats: `${stats.totalAgents} Active Agents`,
        category: 'pam'
      },
      {
        id: 'loa-governance',
        title: 'LoA Governance',
        description: 'Level of Assurance policies and multi-faceted approval workflows',
        icon: Shield,
        color: 'green',
        actions: ['Create Policy', 'Review Approvals', 'Manage Workflows'],
        route: '/services/pam',
        status: stats.totalPolicies > 0 ? 'active' : 'pending',
        stats: `${stats.totalPolicies} Active Policies`,
        category: 'governance'
      },
      {
        id: 'mcp-policies',
        title: 'MCP Policies',
        description: 'Management Control Plane policies with OPA/Rego enforcement',
        icon: Lock,
        color: 'purple',
        actions: ['Create Policy', 'Test Rules', 'Deploy'],
        route: '/services/mcp',
        status: stats.activeMCPs > 0 ? 'active' : 'pending',
        stats: `${stats.activeMCPs} Active MCPs`,
        category: 'mcp'
      },
      {
        id: 'trust-evaluation',
        title: 'Trust Evaluation',
        description: 'Real-time trust scoring and external signal processing',
        icon: TrendingUp,
        color: 'orange',
        actions: ['View Scores', 'Process Signals', 'Analytics'],
        route: '/analytics',
        status: 'active',
        stats: 'Real-time Trust Data',
        category: 'trust'
      },
      {
        id: 'mcp-gateway',
        title: 'MCP Gateway',
        description: 'Trust-gated access control for privileged endpoints',
        icon: Key,
        color: 'red',
        actions: ['Configure', 'Monitor', 'Audit'],
        route: '/services/gateway',
        status: 'pending',
        stats: 'Access Control Engine',
        category: 'mcp'
      },
      {
        id: 'audit-compliance',
        title: 'Audit & Compliance',
        description: 'Comprehensive audit logs and compliance reporting',
        icon: FileText,
        color: 'indigo',
        actions: ['View Logs', 'Generate Reports', 'Export'],
        route: '/services/audit',
        status: 'active',
        stats: 'Full Audit Trail',
        category: 'governance'
      },
      {
        id: 'nft-credentials',
        title: 'NFT Credentials',
        description: 'Blockchain-verified achievements and trust credentials',
        icon: Zap,
        color: 'emerald',
        actions: ['Mint NFT', 'View Transactions', 'Verify'],
        route: '/nft-minting',
        status: stats.eligibleAgents > 0 ? 'active' : 'pending',
        stats: `${stats.eligibleAgents} Eligible for Minting`,
        category: 'trust'
      },
      {
        id: 'ans-registry',
        title: 'ANS Registry',
        description: 'Public Agent Name Service for global discoverability',
        icon: Network,
        color: 'cyan',
        actions: ['Register Agent', 'View Public', 'Verify'],
        route: '/services/ans',
        status: 'pending',
        stats: 'Global Discovery',
        category: 'trust'
      }
    ];

    // Filter based on user type and capabilities
    switch (userType) {
      case 'new':
        return baseServices.filter(service =>
          ['role-agents', 'trust-evaluation'].includes(service.id)
        );
      case 'active':
        return baseServices.filter(service =>
          !['mcp-gateway', 'ans-registry'].includes(service.id)
        );
      case 'advanced':
        return baseServices;
      default:
        return baseServices;
    }
  };

  const serviceCards = getServiceCards();

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % serviceCards.length);
    }, 6000); // Increased to 6 seconds for better readability

    return () => clearInterval(interval);
  }, [autoPlay, serviceCards.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % serviceCards.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 15000); // Resume auto-play after 15s
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + serviceCards.length) % serviceCards.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 15000); // Resume auto-play after 15s
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 15000); // Resume auto-play after 15s
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'locked': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending': return Clock;
      case 'completed': return CheckCircle;
      case 'locked': return AlertCircle;
      case 'warning': return AlertCircle;
      default: return Clock;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'pam': return 'border-l-blue-500';
      case 'mcp': return 'border-l-purple-500';
      case 'trust': return 'border-l-green-500';
      case 'governance': return 'border-l-orange-500';
      case 'analytics': return 'border-l-indigo-500';
      default: return 'border-l-gray-500';
    }
  };

  if (serviceCards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No services available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all hover:scale-110"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all hover:scale-110"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>

        {/* Current Service Card */}
        <div className="flex justify-center">
          <Card className={`w-full max-w-4xl border-0 shadow-xl bg-white/90 backdrop-blur-sm ${getCategoryColor(serviceCards[currentIndex].category)} border-l-4`}>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className={`p-4 rounded-full bg-${serviceCards[currentIndex].color}-100`}>
                  {(() => {
                    const Icon = serviceCards[currentIndex].icon;
                    return <Icon className={`h-12 w-12 text-${serviceCards[currentIndex].color}-600`} />;
                  })()}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-3 mb-3">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {serviceCards[currentIndex].title}
                </CardTitle>
                <Badge className={getStatusColor(serviceCards[currentIndex].status)}>
                  {(() => {
                    const StatusIcon = getStatusIcon(serviceCards[currentIndex].status);
                    return <StatusIcon className="h-3 w-3 mr-1" />;
                  })()}
                  {serviceCards[currentIndex].status}
                </Badge>
              </div>

              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {serviceCards[currentIndex].description}
              </p>

              {serviceCards[currentIndex].stats && (
                <div className="mt-3">
                  <Badge variant="secondary" className="text-sm">
                    {serviceCards[currentIndex].stats}
                  </Badge>
                </div>
              )}
            </CardHeader>

            <CardContent className="text-center">
              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {serviceCards[currentIndex].actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={index === 0 ? "default" : "outline"}
                    className="min-w-[120px]"
                    asChild
                  >
                    <Link href={serviceCards[currentIndex].route}>
                      {action}
                      {index === 0 && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Link>
                  </Button>
                ))}
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-center space-x-2">
                {serviceCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                        ? 'bg-blue-600 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Overview Grid */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          PAM + Trust-Gated MCP Services
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {serviceCards.map((service, index) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => goToSlide(index)}
                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${index === currentIndex
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  } ${getCategoryColor(service.category)} border-l-4`}
              >
                <div className="text-center">
                  <Icon className={`h-6 w-6 mx-auto mb-2 text-${service.color}-600`} />
                  <p className="text-xs font-medium text-gray-700 truncate">
                    {service.title}
                  </p>
                  <div className={`w-2 h-2 mx-auto mt-2 rounded-full ${service.status === 'active' ? 'bg-green-500' :
                      service.status === 'pending' ? 'bg-yellow-500' :
                        service.status === 'completed' ? 'bg-blue-500' :
                          service.status === 'warning' ? 'bg-orange-500' :
                            'bg-gray-400'
                    }`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 