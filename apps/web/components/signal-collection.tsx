'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Signal {
  id: string;
  type: string;
  title: string;
  description?: string;
  value?: number;
  source: string;
  verified: boolean;
  createdAt: string;
  metadata?: any;
}

interface SignalCollectionProps {
  digitalTwinId: string;
  onSignalCreated?: (signal: Signal) => void;
}

const signalTypes = [
  { value: 'certification', label: 'Certification', description: 'Professional certifications and credentials' },
  { value: 'activity', label: 'Activity', description: 'Daily work activities and tasks' }
];

const signalSources = [
  { value: 'securecodewarrior', label: 'Secure Code Warrior' },
  { value: 'certification_provider', label: 'Certification Provider' },
  { value: 'manual', label: 'Manual Entry' }
];

export function SignalCollection({ digitalTwinId, onSignalCreated }: SignalCollectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    value: '',
    source: '',
    metadata: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/signals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          digitalTwinId,
          value: formData.value ? parseFloat(formData.value) : undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const newSignal = result.data;
        setSignals(prev => [newSignal, ...prev]);
        onSignalCreated?.(newSignal);

        // Reset form
        setFormData({
          type: '',
          title: '',
          description: '',
          value: '',
          source: '',
          metadata: {}
        });
      } else {
        console.error('Failed to create signal:', result.error);
      }
    } catch (error) {
      console.error('Error creating signal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSignals = async () => {
    try {
      const response = await fetch(`/api/v1/signals?digitalTwinId=${digitalTwinId}`);
      const result = await response.json();

      if (result.success) {
        setSignals(result.data);
      }
    } catch (error) {
      console.error('Error loading signals:', error);
    }
  };

  // Load signals on component mount
  useState(() => {
    loadSignals();
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Signal</CardTitle>
          <CardDescription>
            Record a new security activity, certification, or achievement for this digital twin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Signal Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select signal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {signalTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {signalSources.map((source) => (
                      <SelectItem key={source.value} value={source.value}>
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter signal title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter signal description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value (Optional)</Label>
              <Input
                id="value"
                type="number"
                min="0"
                max="1000"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Enter numeric value (0-1000)"
              />
            </div>

            <Button type="submit" disabled={isLoading || !formData.type || !formData.title || !formData.source}>
              {isLoading ? 'Creating...' : 'Create Signal'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Signals</CardTitle>
          <CardDescription>
            Latest signals collected for this digital twin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {signals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No signals collected yet. Add your first signal above.
              </p>
            ) : (
              signals.map((signal) => (
                <div key={signal.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{signal.type}</Badge>
                      <Badge variant="outline">{signal.source}</Badge>

                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(signal.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="font-medium">{signal.title}</h4>
                  {signal.description && (
                    <p className="text-sm text-muted-foreground">{signal.description}</p>
                  )}

                  {signal.value && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Value:</span>
                      <span className="text-sm">{signal.value}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 