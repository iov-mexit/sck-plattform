'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { WalletConnect } from '@/components/wallet-connect';
import { RoleSelection } from './role-selection';

interface RoleTemplate {
  id: string;
  title: string;
  focus: string;
  category: string;
  selectable: boolean;
  responsibilities: string[];
  securityContributions: {
    title: string;
    bullets: string[];
  }[];
}

type Step = 'wallet' | 'role' | 'did' | 'confirm' | 'mint' | 'signals';

export function DigitalTwinFlow() {
  const { isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState<Step>('wallet');
  const [selectedRole, setSelectedRole] = useState<RoleTemplate | null>(null);
  const [did, setDid] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);

  const handleNext = () => {
    switch (currentStep) {
      case 'wallet':
        if (isConnected) setCurrentStep('role');
        break;
      case 'role':
        if (selectedRole) setCurrentStep('did');
        break;
      case 'did':
        if (did) setCurrentStep('confirm');
        break;
      case 'confirm':
        setCurrentStep('mint');
        break;
      case 'mint':
        setCurrentStep('signals');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'role':
        setCurrentStep('wallet');
        break;
      case 'did':
        setCurrentStep('role');
        break;
      case 'confirm':
        setCurrentStep('did');
        break;
      case 'mint':
        setCurrentStep('confirm');
        break;
      case 'signals':
        setCurrentStep('mint');
        break;
    }
  };

  const handleMint = async () => {
    setIsMinting(true);
    // Simulate minting process
    setTimeout(() => {
      setMintedTokenId('12345');
      setIsMinting(false);
      setCurrentStep('signals');
    }, 2000);
  };

  const generateDID = () => {
    const newDid = `did:example:${Math.random().toString(36).substring(2, 15)}`;
    setDid(newDid);
  };

  const getSecurityLevel = (role: RoleTemplate) => {
    const highSecurityRoles = ['Backend Developer', 'Full Stack Developer', 'Blockchain Developer', 'Security Test Engineer'];
    const mediumHighRoles = ['Mobile Developer', 'Web Developer (Frontend)', 'QA Analyst', 'Release QA Engineer'];
    const mediumRoles = ['Test Automation Engineer', 'Performance Test Engineer', 'Product Designer'];

    if (highSecurityRoles.includes(role.title)) return { level: 'High', color: 'bg-red-100 text-red-800', score: '85-90' };
    if (mediumHighRoles.includes(role.title)) return { level: 'Medium-High', color: 'bg-orange-100 text-orange-800', score: '75-80' };
    if (mediumRoles.includes(role.title)) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800', score: '65-70' };
    return { level: 'Lower', color: 'bg-green-100 text-green-800', score: '55-60' };
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {['wallet', 'role', 'did', 'confirm', 'mint', 'signals'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep === step
              ? 'bg-blue-600 text-white'
              : index < ['wallet', 'role', 'did', 'confirm', 'mint', 'signals'].indexOf(currentStep)
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-600'
              }`}>
              {index + 1}
            </div>
            {index < 5 && (
              <div className={`w-16 h-1 mx-2 ${index < ['wallet', 'role', 'did', 'confirm', 'mint', 'signals'].indexOf(currentStep)
                ? 'bg-green-600'
                : 'bg-gray-200'
                }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Wallet Connection */}
      {currentStep === 'wallet' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">Step 1</Badge>
              Connect MetaMask Wallet
            </CardTitle>
            <CardDescription>
              Connect your wallet to mint Digital Twin NFTs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletConnect />
            {isConnected && (
              <Button onClick={handleNext} className="w-full mt-4">
                Continue to Role Selection →
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Role Template Selection */}
      {currentStep === 'role' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">Step 2</Badge>
              Select Role Template
            </CardTitle>
            <CardDescription>
              Choose from our comprehensive role templates with security requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RoleSelection
              onRoleSelect={setSelectedRole}
              selectedRole={selectedRole}
            />
            {selectedRole && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Selected Role: {selectedRole.title}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Focus:</span> {selectedRole.focus}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {selectedRole.category}
                  </div>
                  <div>
                    <span className="font-medium">Security Level:</span>
                    <Badge className={`ml-2 ${getSecurityLevel(selectedRole).color}`}>
                      {getSecurityLevel(selectedRole).level} ({getSecurityLevel(selectedRole).score})
                    </Badge>
                  </div>
                </div>
                <Button onClick={handleNext} className="w-full mt-4">
                  Continue to DID Generation →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: DID Generation */}
      {currentStep === 'did' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">Step 3</Badge>
              Generate Decentralized Identifier
            </CardTitle>
            <CardDescription>
              Create a privacy-preserving DID for your Digital Twin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="did">DID</Label>
              <Input
                id="did"
                value={did}
                onChange={(e) => setDid(e.target.value)}
                placeholder="did:ethr:0x..."
              />
            </div>
            <Button onClick={generateDID} variant="outline" className="w-full">
              Generate New DID
            </Button>
            {did && (
              <Button onClick={handleNext} className="w-full">
                Continue to Confirmation →
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 'confirm' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">Step 4</Badge>
              Confirm Digital Twin Details
            </CardTitle>
            <CardDescription>
              Review your Digital Twin configuration before minting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedRole && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Role Information</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="font-medium">Title:</span> {selectedRole.title}</div>
                  <div><span className="font-medium">Focus:</span> {selectedRole.focus}</div>
                  <div><span className="font-medium">Category:</span> {selectedRole.category}</div>
                  <div>
                    <span className="font-medium">Security Level:</span>
                    <Badge className={`ml-2 ${getSecurityLevel(selectedRole).color}`}>
                      {getSecurityLevel(selectedRole).level} ({getSecurityLevel(selectedRole).score})
                    </Badge>
                  </div>
                </div>
              </div>
            )}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">DID Information</h4>
              <div className="text-sm">
                <div><span className="font-medium">DID:</span> {did}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                ← Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Proceed to Mint →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Minting */}
      {currentStep === 'mint' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">Step 5</Badge>
              Mint Digital Twin NFT
            </CardTitle>
            <CardDescription>
              Mint your Digital Twin as a soulbound NFT
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Minting Process</h4>
              <p className="text-sm text-yellow-700">
                This will create a soulbound NFT representing your Digital Twin.
                The NFT will be permanently linked to your wallet address.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                ← Back
              </Button>
              <Button
                onClick={handleMint}
                disabled={isMinting}
                className="flex-1"
              >
                {isMinting ? 'Minting...' : 'Mint Digital Twin NFT'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Signals */}
      {currentStep === 'signals' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary">Step 6</Badge>
              Signal Collection Setup
            </CardTitle>
            <CardDescription>
              Configure achievement signals for your Digital Twin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mintedTokenId && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Successfully Minted!</h4>
                <p className="text-sm text-green-700">
                  Your Digital Twin NFT has been minted with token ID: {mintedTokenId}
                </p>
              </div>
            )}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div>• Connect achievement signals from SecureCodeWarrior</div>
                <div>• Set up automated achievement tracking</div>
                <div>• Configure trust score monitoring</div>
                <div>• Link additional security certifications</div>
              </div>
            </div>
            <Button onClick={() => setCurrentStep('wallet')} className="w-full">
              Start Over
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}