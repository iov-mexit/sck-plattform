'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function fetchOrganizations() {
  const res = await fetch('/api/v1/organizations');
  if (!res.ok) {
    throw new Error('Failed to fetch organizations');
  }
  return res.json();
}

export function TrustConstellation({ onError }: { onError?: (error: Error) => void }) {
  const containerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const { data, error, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (error && onError) {
      console.error('TrustConstellation error:', error);
      onError(error as Error);
    }
  }, [error, onError]);

  useEffect(() => {
    if (!isClient || !containerRef.current || !data || !data.data) return;

    const initializeNetwork = async () => {
      try {
        const visNetwork = await import('vis-network');
        const Network = visNetwork.Network;
        const organizations = data.data;
        const nodes = organizations.map((org: any) => ({
          id: org.id,
          label: org.name,
        }));

        const edges = organizations.map((org: any, index: number) => ({
          from: org.id,
          to: organizations[(index + 1) % organizations.length].id,
        }));

        const networkData = {
          nodes,
          edges,
        };

        const options = {
          nodes: {
            shape: 'dot',
            size: 20,
            font: {
              size: 18,
              color: '#ffffff'
            },
            borderWidth: 2,
            color: {
              border: '#ffffff',
              background: '#000000'
            }
          },
          edges: {
            width: 2,
            color: {
              color: '#ffffff'
            }
          },
          physics: {
            enabled: true,
            solver: 'forceAtlas2Based',
            forceAtlas2Based: {
              gravitationalConstant: -50,
              centralGravity: 0.01,
              springConstant: 0.08,
              springLength: 100
            }
          },
          interaction: {
            hover: true
          }
        };

        if (containerRef.current) {
          new Network(containerRef.current, networkData, options);
        }
      } catch (err) {
        console.error('Failed to initialize network:', err);
        if (onError) {
          onError(err as Error);
        }
      }
    };

    initializeNetwork();
  }, [data, isClient, onError]);

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trust Constellation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Trust Constellation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 flex items-center justify-center">
          <div className="text-gray-500">Loading organizations...</div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) return (
    <Card>
      <CardHeader>
        <CardTitle>Trust Constellation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 flex items-center justify-center">
          <div className="text-red-500">Error loading organizations</div>
        </div>
      </CardContent>
    </Card>
  );

  if (!data || !data.data || data.data.length === 0) return (
    <Card>
      <CardHeader>
        <CardTitle>Trust Constellation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 flex items-center justify-center">
          <div className="text-gray-500">No organizations found.</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trust Constellation</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} style={{ height: '500px' }} />
      </CardContent>
    </Card>
  );
}
