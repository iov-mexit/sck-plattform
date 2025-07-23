import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DigitalTwinOverviewPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-lg w-full shadow-lg border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-900 mb-2">Digital Twin Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">This is a placeholder for the Digital Twin Overview. Here, organizations will be able to view and manage their digital twins.</p>
        </CardContent>
      </Card>
    </div>
  );
} 