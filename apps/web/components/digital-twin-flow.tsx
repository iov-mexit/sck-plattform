'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormData {
  name: string;
  assignedToDid: string;
  roleTemplateId: string;
  description: string;
  trustScore: string;
}

export function RoleAgentFlow() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    assignedToDid: '',
    roleTemplateId: '',
    description: '',
    trustScore: '500'
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            Role Agent Creation Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 1: Basic Information</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Role Agent Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Security Engineer Agent"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="did">Assigned DID</Label>
                <Input
                  id="did"
                  value={formData.assignedToDid}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedToDid: e.target.value }))}
                  placeholder="did:ethr:0x..."
                />
              </div>
              <Button onClick={nextStep}>Next</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 2: Role Assignment</h3>
              <div className="space-y-2">
                <Label htmlFor="roleTemplate">Role Template</Label>
                <Select value={formData.roleTemplateId} onValueChange={(value) => setFormData(prev => ({ ...prev, roleTemplateId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security-engineer">Security Engineer</SelectItem>
                    <SelectItem value="compliance-officer">Compliance Officer</SelectItem>
                    <SelectItem value="soc-analyst">SOC Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trustScore">Initial Trust Score</Label>
                <Input
                  id="trustScore"
                  type="number"
                  min="0"
                  max="1000"
                  value={formData.trustScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, trustScore: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep}>Previous</Button>
                <Button onClick={nextStep}>Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 3: Additional Details</h3>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this role agent's purpose..."
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={prevStep}>Previous</Button>
                <Button onClick={() => console.log('Creating role agent...', formData)}>
                  Create Role Agent
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 