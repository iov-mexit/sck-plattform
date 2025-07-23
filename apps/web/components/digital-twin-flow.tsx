'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export function DigitalTwinFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    did: '',
    trustScore: '',
    role: '',
    organization: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary">Step {step}/4</Badge>
            Digital Twin Creation Flow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 1: Import DID</h3>
              <div className="space-y-2">
                <Label htmlFor="did">Digital Identifier (DID)</Label>
                <Input
                  id="did"
                  placeholder="did:example:123456789abcdef"
                  value={formData.did}
                  onChange={(e) => handleInputChange('did', e.target.value)}
                />
              </div>
              <Button onClick={nextStep} disabled={!formData.did}>
                Next: Trust Score Validation
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 2: Trust Score Validation</h3>
              <div className="space-y-2">
                <Label htmlFor="trustScore">Current Trust Score</Label>
                <Input
                  id="trustScore"
                  type="number"
                  placeholder="85"
                  value={formData.trustScore}
                  onChange={(e) => handleInputChange('trustScore', e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={!formData.trustScore}>
                  Next: Role Selection
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 3: Role Selection</h3>
              <div className="space-y-2">
                <Label htmlFor="role">Target Role</Label>
                <Input
                  id="role"
                  placeholder="Software Engineer"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep} disabled={!formData.role}>
                  Next: Organization
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 4: Organization Setup</h3>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  placeholder="Acme Corp"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <Button onClick={() => console.log('Creating digital twin...', formData)}>
                  Create Digital Twin
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 