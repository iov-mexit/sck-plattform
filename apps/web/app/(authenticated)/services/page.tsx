'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Users, 
  Coins, 
  TrendingUp, 
  Network,
  Bot,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Settings,
  BarChart3
} from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  status: 'active' | 'pending' | 'completed' | 'locked';
  route: string;
  category: 'core' | 'advanced' | 'experimental';
  stats?: string;
  actions: string[];
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'advanced' | 'experimental'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      // In production, this would fetch from an API
      const allServices: Service[] = [
        {
          id: 'role-agents',
          title: 'Role Agents',
          description: 'Create and manage AI-powered role agents for your team',
          icon: Users,
          color: 'blue',
          status: 'active',
          route: '/role-agents',
          category: 'core',
          stats: 'Active Management',
          actions: ['Create Agent', 'View All', 'Manage']
        },
        {
          id: 'nft-minting',
          title: 'NFT Credentials',
          description: 'Mint blockchain-verified achievements and credentials',
          icon: Coins,
          color: 'green',
          status: 'active',
          route: '/nft-minting',
          category: 'core',
          stats: 'Blockchain Ready',
          actions: ['Mint NFT', 'View Transactions', 'Reset']
        },
        {
          id: 'analytics',
          title: 'Trust Analytics',
          description: 'Monitor performance, trust scores, and team dynamics',
          icon: TrendingUp,
          color: 'purple',
          status: 'active',
          route: '/analytics',
          category: 'core',
          stats: 'Real-time Insights',
          actions: ['View Reports', 'Export Data', 'Set Alerts']
        },
        {
          id: 'constellation',
          title: 'Trust Constellation',
          description: 'Visualize your team\'s trust network and relationships',
          icon: Network,
          color: 'orange',
          status: 'active',
          route: '/constellation',
          category: 'core',
          stats: 'Interactive Network',
          actions: ['Explore Network', 'Filter Views', 'Export']
        },
        {
          id: 'agent-services',
          title: 'Agent Services',
          description: 'Advanced AI services and automation tools',
          icon: Bot,
          color: 'indigo',
          status: 'active',
          route: '/agent-services',
          category: 'advanced',
          stats: 'Enterprise AI Tools',
          actions: ['Browse Services', 'Configure', 'Deploy']
        },
        {
          id: 'ans-integration',
          title: 'ANS Registry',
          description: 'Publish agents to public verification registry',
          icon: Shield,
          color: 'red',
          status: 'pending',
          route: '/ans/register',
          category: 'advanced',
          stats: 'Public Discovery',
          actions: ['Register Agent', 'View Public', 'Verify']
        },
        {
          id: 'signal-processing',
          title: 'Signal Processing',
          description: 'Process external trust signals and certifications',
          icon: Zap,
          color: 'yellow',
          status: 'active',
          route: '/signals',
          category: 'advanced',
          stats: 'External Integration',
          actions: ['Connect Sources', 'Process Signals', 'View History']
        },
        {
          id: 'role-templates',
          title: 'Role Templates',
          description: 'Manage and customize role agent templates',
          icon: Settings,
          color: 'gray',
          status: 'active',
          route: '/role-templates',
          category: 'core',
          stats: 'Template Library',
          actions: ['Browse Templates', 'Create Custom', 'Manage']
        }
      ];

      setServices(allServices);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'locked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending': return Clock;
      case 'completed': return CheckCircle;
      case 'locked': return AlertCircle;
      default: return Clock;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'experimental': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredServices = services.filter(service => 
    selectedCategory === 'all' || service.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SCK Platform Services
          </h1>
          <p className="text-lg text-gray-600">
            Access all available services and tools for your organization
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2">
            {[
              { key: 'all', label: 'All Services', count: services.length },
              { key: 'core', label: 'Core Services', count: services.filter(s => s.category === 'core').length },
              { key: 'advanced', label: 'Advanced', count: services.filter(s => s.category === 'advanced').length },
              { key: 'experimental', label: 'Experimental', count: services.filter(s => s.category === 'experimental').length }
            ].map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.label}
                <span className="ml-2 px-2 py-1 rounded-full bg-white/20 text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            const StatusIcon = getStatusIcon(service.status);
            
            return (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg bg-${service.color}-100`}>
                      <Icon className={`h-8 w-8 text-${service.color}-600`} />
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(service.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {service.status}
                      </Badge>
                      <Badge className={getCategoryColor(service.category)}>
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                    {service.stats && (
                      <p className="text-xs text-gray-500 mt-2">{service.stats}</p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Actions */}
                  <div className="space-y-2 mb-4">
                    {service.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={index === 0 ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href={service.route}>
                          {action}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ))}
                  </div>

                  {/* Quick Access */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Service ID: {service.id}</span>
                    <span className="capitalize">{service.category}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500">Try adjusting your category filter</p>
          </div>
        )}

        {/* Service Overview */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Service Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {services.filter(s => s.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Services</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {services.filter(s => s.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {services.filter(s => s.category === 'core').length}
                  </div>
                  <div className="text-sm text-gray-600">Core Services</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {services.filter(s => s.category === 'advanced').length}
                  </div>
                  <div className="text-sm text-gray-600">Advanced</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 