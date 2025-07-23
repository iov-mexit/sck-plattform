'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Shield, Wallet } from 'lucide-react';

export function MagicLinkLogin() {
  const { magicAuth, loginWithMagic } = useAuth();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const handleLogin = async () => {
    // Email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(emailRegex)) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
    await loginWithMagic(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (emailError) setEmailError(false);
    setEmail(e.target.value);
  };

  if (magicAuth.isLoggedIn) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">Welcome back!</CardTitle>
          <CardDescription>
            You are logged in with Magic Link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Logged in as:</p>
            <Badge variant="secondary" className="text-sm">
              {magicAuth.user?.email}
            </Badge>
          </div>
          {magicAuth.user?.walletAddress && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Wallet Address:</p>
              <Badge variant="outline" className="text-xs font-mono">
                {magicAuth.user.walletAddress.slice(0, 6)}...{magicAuth.user.walletAddress.slice(-4)}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Secure Login</CardTitle>
        <CardDescription>
          Enter your email to receive a secure login link
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={handleEmailChange}
            disabled={magicAuth.isLoggingIn}
            className={emailError ? 'border-red-500' : ''}
          />
          {emailError && (
            <p className="text-sm text-red-500">Please enter a valid email address</p>
          )}
          {magicAuth.error && (
            <p className="text-sm text-red-500">{magicAuth.error}</p>
          )}
        </div>

        <Button
          onClick={handleLogin}
          disabled={magicAuth.isLoggingIn || !email.trim()}
          className="w-full"
        >
          {magicAuth.isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending login link...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send Login Link
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            No password required • Secure email-based authentication
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function OptionalWalletConnection() {
  const { walletConnection, connectWallet, disconnectWallet } = useAuth();

  if (!walletConnection.isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto mt-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Wallet className="h-6 w-6 text-purple-600" />
          </div>
          <CardTitle className="text-lg">Optional Wallet Connection</CardTitle>
          <CardDescription>
            Connect your wallet for blockchain features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={connectWallet}
            disabled={walletConnection.isConnecting}
            variant="outline"
            className="w-full"
          >
            {walletConnection.isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>
          {walletConnection.error && (
            <p className="text-sm text-red-500 mt-2">{walletConnection.error}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <Wallet className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-lg">Wallet Connected</CardTitle>
        <CardDescription>
          Your wallet is connected and ready
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Connected Address:</p>
          <Badge variant="outline" className="text-xs font-mono">
            {walletConnection.address?.slice(0, 6)}...{walletConnection.address?.slice(-4)}
          </Badge>
        </div>
        {walletConnection.chainId && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Network:</p>
            <Badge variant="secondary">
              Chain ID: {walletConnection.chainId}
            </Badge>
          </div>
        )}
        <Button
          onClick={disconnectWallet}
          variant="outline"
          className="w-full"
        >
          Disconnect Wallet
        </Button>
      </CardContent>
    </Card>
  );
} 