'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DigitalTwin {
  id: string;
  name: string;
  description?: string;
  assignedToDid: string;
  soulboundTokenId?: string;
  status: string;
  level: number;
  createdAt: string;
  organization: {
    id: string;
    name: string;
    domain: string;
  };
  roleTemplate: {
    id: string;
    title: string;
    category: string;
    focus: string;
  };
  signals: Array<{
    id: string;
    type: string;
    title: string;
    value?: number;
    verified: boolean;
    createdAt: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issuedAt: string;
    expiresAt?: string;
    verified: boolean;
  }>;
  blockchainTransactions: Array<{
    transactionHash: string;
    network: string;
    blockNumber?: number;
  }>;
}

export function AdminPanel() {
  const [digitalTwins, setDigitalTwins] = useState<DigitalTwin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTwin, setSelectedTwin] = useState<DigitalTwin | null>(null);

  // Fetch digital twins
  useEffect(() => {
    fetchDigitalTwins();
  }, []);

  const fetchDigitalTwins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/digital-twins');
      const data = await response.json();

      if (data.success) {
        setDigitalTwins(data.data);
      } else {
        console.error('Failed to fetch digital twins:', data.error);
      }
    } catch (error) {
      console.error('Error fetching digital twins:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter digital twins
  const filteredTwins = digitalTwins.filter(twin => {
    const matchesStatus = filterStatus === 'all' || twin.status === filterStatus;
    const matchesSearch = searchTerm === '' ||
      twin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      twin.assignedToDid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      twin.roleTemplate.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Update twin status
  const updateTwinStatus = async (twinId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/v1/digital-twins/${twinId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setDigitalTwins(prev =>
          prev.map(twin =>
            twin.id === twinId
              ? { ...twin, status: newStatus }
              : twin
          )
        );
      } else {
        console.error('Failed to update twin status:', data.error);
      }
    } catch (error) {
      console.error('Error updating twin status:', error);
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'deleted':
        return <Badge variant="outline">Deleted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get level badge
  const getLevelBadge = (level: number) => {
    const colors = ['bg-gray-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100'];
    const color = colors[Math.min(level - 1, colors.length - 1)];
    return <Badge variant="outline" className={color}>Level {level}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Digital Twins Admin Panel</CardTitle>
          <CardDescription>Loading digital twins...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Digital Twins Admin Panel</CardTitle>
          <CardDescription>
            Manage your organization's digital twins and track their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name, DID, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{digitalTwins.length}</div>
              <div className="text-sm text-blue-700">Total Twins</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">
                {digitalTwins.filter(t => t.status === 'active').length}
              </div>
              <div className="text-sm text-green-700">Active</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-900">
                {digitalTwins.filter(t => t.soulboundTokenId).length}
              </div>
              <div className="text-sm text-yellow-700">Minted NFTs</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-900">
                {digitalTwins.reduce((sum, t) => sum + t.signals.length, 0)}
              </div>
              <div className="text-sm text-purple-700">Total Signals</div>
            </div>
          </div>

          {/* Digital Twins Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left">Twin</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">DID</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Role</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Token ID</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Signals</th>
                  <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTwins.map((twin) => (
                  <tr key={twin.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      <div>
                        <div className="font-medium">{twin.name}</div>
                        <div className="text-sm text-gray-500">{getLevelBadge(twin.level)}</div>
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <div className="font-mono text-sm break-all max-w-32">
                        {twin.assignedToDid}
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <div>
                        <div className="font-medium">{twin.roleTemplate.title}</div>
                        <div className="text-sm text-gray-500">{twin.roleTemplate.category}</div>
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {twin.soulboundTokenId ? (
                        <div className="font-mono text-sm">
                          #{twin.soulboundTokenId}
                        </div>
                      ) : (
                        <Badge variant="outline">Not Minted</Badge>
                      )}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {getStatusBadge(twin.status)}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{twin.signals.length} signals</span>
                        <span className="text-sm">{twin.certifications.length} certs</span>
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTwin(twin)}
                        >
                          View
                        </Button>
                        {twin.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTwinStatus(twin.id, 'inactive')}
                          >
                            Set Idle
                          </Button>
                        )}
                        {twin.status === 'inactive' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateTwinStatus(twin.id, 'active')}
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTwins.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No digital twins found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Twin Details Modal */}
      {selectedTwin && (
        <Card>
          <CardHeader>
            <CardTitle>Digital Twin Details</CardTitle>
            <CardDescription>
              Detailed view of {selectedTwin.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedTwin.name}</div>
                  <div><span className="font-medium">DID:</span> <span className="font-mono break-all">{selectedTwin.assignedToDid}</span></div>
                  <div><span className="font-medium">Role:</span> {selectedTwin.roleTemplate.title}</div>
                  <div><span className="font-medium">Category:</span> {selectedTwin.roleTemplate.category}</div>
                  <div><span className="font-medium">Focus:</span> {selectedTwin.roleTemplate.focus}</div>
                  <div><span className="font-medium">Level:</span> {selectedTwin.level}</div>
                  <div><span className="font-medium">Status:</span> {getStatusBadge(selectedTwin.status)}</div>
                  {selectedTwin.soulboundTokenId && (
                    <div><span className="font-medium">Token ID:</span> #{selectedTwin.soulboundTokenId}</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Activity</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Signals:</span> {selectedTwin.signals.length}</div>
                  <div><span className="font-medium">Certifications:</span> {selectedTwin.certifications.length}</div>
                  <div><span className="font-medium">Blockchain Transactions:</span> {selectedTwin.blockchainTransactions.length}</div>
                  <div><span className="font-medium">Created:</span> {new Date(selectedTwin.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedTwin(null)}
              >
                Close
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: Implement view on blockchain explorer
                  if (selectedTwin.soulboundTokenId) {
                    window.open(`https://etherscan.io/token/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?a=${selectedTwin.soulboundTokenId}`, '_blank');
                  }
                }}
                disabled={!selectedTwin.soulboundTokenId}
              >
                View on Etherscan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 