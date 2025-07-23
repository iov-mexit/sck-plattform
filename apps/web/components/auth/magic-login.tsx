'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { validateMagicConfig } from '@/lib/auth/magic-config';

export function MagicLogin() {
  const { magicAuth, loginWithMagic } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate Magic configuration
  const configValidation = validateMagicConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithMagic(email);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show configuration error if Magic is not properly configured
  if (!configValidation.isValid) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="destructive">Configuration Error</Badge>
            Magic Link Not Configured
          </CardTitle>
          <CardDescription>
            Magic Link authentication is not properly configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-red-700">
            <p>Please configure the following environment variables:</p>
            <ul className="list-disc list-inside space-y-1">
              {configValidation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show success message if user is logged in
  if (magicAuth.isLoggedIn && magicAuth.user) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="default">✅ Authenticated</Badge>
            Welcome Back!
          </CardTitle>
          <CardDescription>
            You are successfully logged in with Magic Link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {magicAuth.user.email}
              </p>
              {magicAuth.user.walletAddress && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Wallet:</strong> {magicAuth.user.walletAddress.slice(0, 6)}...{magicAuth.user.walletAddress.slice(-4)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Badge variant="secondary">Magic Link</Badge>
          Email-Based Authentication
        </CardTitle>
        <CardDescription>
          Enter your email to receive a secure login link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting || magicAuth.isLoggingIn}
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            disabled={!email || isSubmitting || magicAuth.isLoggingIn}
            className="w-full"
            size="lg"
          >
            {isSubmitting || magicAuth.isLoggingIn ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending Magic Link...
              </>
            ) : (
              'Send Magic Link'
            )}
          </Button>

          {magicAuth.error && (
            <div className="p-3 bg-red-100 rounded-lg border border-red-300">
              <p className="text-sm text-red-700">
                {magicAuth.error}
              </p>
            </div>
          )}

          {magicAuth.isLoggingIn && !magicAuth.error && (
            <div className="p-3 bg-blue-100 rounded-lg border border-blue-300">
              <p className="text-sm text-blue-700">
                Check your email for the magic link!
              </p>
            </div>
          )}
        </form>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>No password required • Secure email-based login</p>
          <p>Wallet connection is optional and can be added later</p>
        </div>
      </CardContent>
    </Card>
  );
} 