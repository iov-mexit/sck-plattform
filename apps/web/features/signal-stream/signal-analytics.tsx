'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SignalStatistics {
  total: number;
  recent: number;
  recentSignals: Array<{
    id: string;
    type: string;
    title: string;
    createdAt: string;
  }>;
}

interface SignalAnalyticsProps {
  digitalTwinId?: string;
  organizationId?: string;
}

export function SignalAnalytics({ digitalTwinId, organizationId }: SignalAnalyticsProps) {
  const [statistics, setStatistics] = useState<SignalStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (digitalTwinId) {
        params.append('digitalTwinId', digitalTwinId);
      } else if (organizationId) {
        params.append('organizationId', organizationId);
      }

      const response = await fetch(`/api/v1/signals/statistics?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setStatistics(result.data);
      } else {
        setError(result.error || 'Failed to load statistics');
      }
    } catch (error) {
      setError('Failed to load statistics');
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [digitalTwinId, organizationId]);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>Error loading statistics: {error}</p>
            <button
              onClick={loadStatistics}
              className="text-primary hover:underline mt-2"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!statistics) {
    return null;
  }



  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
            <p className="text-xs text-muted-foreground">
              All time signals collected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.recent}</div>
            <p className="text-xs text-muted-foreground">
              Last 5 signals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Signals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Signals</CardTitle>
          <CardDescription>
            Latest signals collected for this digital twin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statistics.recentSignals.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No signals collected yet
              </p>
            ) : (
              statistics.recentSignals.map((signal) => (
                <div key={signal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{signal.type}</Badge>
                    <span className="font-medium">{signal.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(signal.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 