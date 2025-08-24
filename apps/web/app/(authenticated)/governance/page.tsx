'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Shield,
  FileText,
  Cpu,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Building,
  Hash,
  ExternalLink
} from 'lucide-react';

interface ApprovalRequest {
  id: string;
  artifactId: string;
  artifactType: string;
  loaLevel: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  requestorId?: string;
  requestorType?: string;
  requestReason?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate?: string;
  reviewers: any[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  organization?: {
    name: string;
    domain: string;
  };
  _count: {
    decisions: number;
    blockchainTransactions: number;
  };
}

export default function GovernanceConsole() {
  const [loading, setLoading] = useState(false);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'ALL',
    artifactType: 'ALL',
    loaLevel: 'ALL'
  });

  // Fetch approvals
  async function fetchApprovals() {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.status !== 'ALL') params.append('status', filters.status);
      if (filters.artifactType !== 'ALL') params.append('artifactType', filters.artifactType);
      if (filters.loaLevel !== 'ALL') params.append('loaLevel', filters.loaLevel);

      const res = await fetch(`/api/approvals/list?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setApprovals(data.data);
      } else {
        throw new Error(data.message || 'Failed to load approvals');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load approval requests');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApprovals();
  }, [filters]);

  async function handleDecision(id: string, decision: 'APPROVED' | 'REJECTED') {
    try {
      const res = await fetch('/api/approvals/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          decision,
          reviewerId: 'current-user', // TODO: Get from auth context
          reviewerType: 'USER',
          comment: `Decision: ${decision}`,
          evidence: { timestamp: new Date().toISOString() }
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Refresh the list
        fetchApprovals();
      } else {
        throw new Error(data.message || 'Failed to update approval');
      }
    } catch (err: any) {
      setError(err.message || 'Could not update approval');
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'PENDING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'EXPIRED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  function getArtifactIcon(artifactType: string) {
    switch (artifactType) {
      case 'MCP_POLICY': return <FileText className="w-4 h-4" />;
      case 'ROLE_AGENT': return <User className="w-4 h-4" />;
      case 'ANS_ENTRY': return <Hash className="w-4 h-4" />;
      case 'AI_RECOMMENDATION': return <Cpu className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  }

  function isOverdue(dueDate: string | undefined) {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-600" />
          Secure Knight Governance Console
        </h1>
        <Button
          onClick={() => fetchApprovals()}
          disabled={loading}
          variant="outline"
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="EXPIRED">Expired</option>
            </select>

            <select
              value={filters.artifactType}
              onChange={(e) => setFilters(prev => ({ ...prev, artifactType: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            >
              <option value="ALL">All Artifacts</option>
              <option value="MCP_POLICY">MCP Policies</option>
              <option value="ROLE_AGENT">Role Agents</option>
              <option value="ANS_ENTRY">ANS Entries</option>
              <option value="AI_RECOMMENDATION">AI Recommendations</option>
            </select>

            <select
              value={filters.loaLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, loaLevel: e.target.value }))}
              className="px-3 py-2 border rounded-md"
            >
              <option value="ALL">All LoA Levels</option>
              <option value="1">LoA 1</option>
              <option value="2">LoA 2</option>
              <option value="3">LoA 3</option>
              <option value="4">LoA 4</option>
              <option value="5">LoA 5</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* LoA Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Pending Approvals ({approvals.filter(a => a.status === 'PENDING').length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : approvals.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No approval requests found.</p>
          ) : (
            <div className="space-y-4">
              {approvals.map((req) => (
                <div key={req.id} className="border rounded-xl p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getArtifactIcon(req.artifactType)}
                      <div>
                        <h3 className="font-semibold text-lg">
                          {req.artifactType.replace('_', ' ')} – {req.artifactId}
                        </h3>
                        <p className="text-sm text-gray-600">
                          LoA Level {req.loaLevel} • Requested by {req.requestorType || 'System'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(req.priority)}>
                        {req.priority}
                      </Badge>
                      <Badge className={getStatusColor(req.status)}>
                        {req.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Organization</p>
                      <p className="font-medium">{req.organization?.name || 'Global'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Created</p>
                      <p className="font-medium">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {req.dueDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className={isOverdue(req.dueDate) ? 'text-red-600 font-medium' : ''}>
                          Due: {new Date(req.dueDate).toLocaleDateString()}
                          {isOverdue(req.dueDate) && ' (OVERDUE)'}
                        </span>
                      </div>
                    )}
                    {req.requestReason && (
                      <div className="md:col-span-2">
                        <p className="text-gray-600">Reason</p>
                        <p className="font-medium">{req.requestReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Review History */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {req._count.decisions} reviews
                    </span>
                    <span className="flex items-center gap-1">
                      <Hash className="w-4 h-4" />
                      {req._count.blockchainTransactions} blockchain records
                    </span>
                  </div>

                  {/* Actions */}
                  {req.status === 'PENDING' && (
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        onClick={() => handleDecision(req.id, 'APPROVED')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDecision(req.id, 'REJECTED')}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {approvals.filter(a => a.status === 'PENDING').length}
            </div>
            <p className="text-sm text-gray-600">Pending Approvals</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {approvals.filter(a => a.status === 'APPROVED').length}
            </div>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {approvals.filter(a => a.status === 'REJECTED').length}
            </div>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">
              {approvals.filter(a => a.priority === 'HIGH' || a.priority === 'CRITICAL').length}
            </div>
            <p className="text-sm text-gray-600">High Priority</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
