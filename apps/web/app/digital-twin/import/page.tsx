import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ImportDidRolesPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-lg w-full shadow-lg border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center text-gray-900 mb-2">Import DID & Assign Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">This is a placeholder for the Import DID & Roles feature. Here, organizations will be able to assign DIDs to role templates or create custom roles for their digital twins.</p>
        </CardContent>
      </Card>
    </div>
  );
} 