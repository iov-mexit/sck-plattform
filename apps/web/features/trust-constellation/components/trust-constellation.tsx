'use client';

import { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/card';

async function fetchOrganizations() {
  const res = await fetch('/api/v1/organizations');
  if (!res.ok) {
    throw new Error('Failed to fetch organizations');
  }
  return res.json();
}

export function TrustConstellation() {
  const containerRef = useRef(null);
  const { data, error, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
  });

  useEffect(() => {
    if (containerRef.current && data) {
      const nodes = data.map((org: any) => ({
        id: org.id,
        label: org.name,
      }));

      const edges = data.map((org: any, index: number) => ({
        from: org.id,
        to: data[(index + 1) % data.length].id,
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

      const network = new Network(containerRef.current, networkData, options);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
