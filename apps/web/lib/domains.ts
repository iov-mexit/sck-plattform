/**
 * SCK Platform Cross-Domain Integration
 * 
 * Implements composable trust economy architecture:
 * - SCK Platform (Private): Role agent creation, external signal processing
 * - ANS Registry (Public): Agent discovery, verification APIs
 * 
 * Local Development:
 * - SCK Platform: localhost:3000
 * - ANS Registry: localhost:3001 (simulation)
 * 
 * Production:
 * - SCK Platform: sck-plattform.vercel.app (Vercel)
 * - ANS Registry: knaight.site
 */

export interface DomainConfig {
  baseUrl: string;
  ansRegistry: string;
  autoRegisterANS: boolean;
  isEU: boolean;
  isANSRegistry: boolean;
  walletRequired: boolean;
  authMethod: 'magic-link' | 'web3';
  isDevelopment: boolean;
  // Additional flags expected by tests/UI helpers
  isProduction?: boolean;
  isOrg?: boolean;
  isLocal?: boolean;
  analytics?: boolean;
  payments?: boolean;
}

export interface ANSRegistrationPayload {
  ansId: string;
  did: string;
  role: string;
  level: number;
  qualificationLevel: string;
  organization: string;
  trustLevel: string;
  nftContract?: string;
  tokenId?: string;
  verificationEndpoint: string;
  publicMetadata: {
    role: string;
    level: number;
    qualificationLevel: string;
    organization: string;
    certifications?: string[];
    trustScore: number;
    lastUpdated: string;
  };
}

/**
 * Get current domain configuration based on hostname
 */
export function getDomainConfig(hostname?: string): DomainConfig {
  const host = hostname || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
  const isDev = process.env.NODE_ENV === 'development' || host === 'localhost';

  // Local Development Configuration
  if (isDev || host === 'localhost') {
    return {
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      ansRegistry: process.env.NEXT_PUBLIC_ANS_REGISTRY_URL || 'http://localhost:3001',
      autoRegisterANS: true,
      isEU: false,
      isANSRegistry: false,
      walletRequired: false,
      authMethod: 'magic-link',
      isDevelopment: true,
      isProduction: false,
      isOrg: false,
      isLocal: true,
      analytics: false,
      payments: false
    };
  }

  // Vercel Production Deployment - SCK Platform
  if (host.includes('vercel.app') && (host.includes('sck-plattform') || host.includes('web-'))) {
    return {
      baseUrl: 'https://sck-plattform.vercel.app', // Use consistent production domain
      ansRegistry: process.env.NEXT_PUBLIC_ANS_REGISTRY_URL || 'https://knaight.site',
      autoRegisterANS: true,
      isEU: false,
      isANSRegistry: false,
      walletRequired: false,
      authMethod: 'magic-link',
      isDevelopment: false,
      isProduction: true,
      isOrg: false,
      isLocal: false,
      analytics: true,
      payments: true
    };
  }

  // EU Compliance Domain
  if (host.includes('secure-knaight.eu')) {
    return {
      baseUrl: 'https://secure-knaight.eu',
      ansRegistry: 'https://knaight.site',
      autoRegisterANS: true,
      isEU: true,
      isANSRegistry: false,
      walletRequired: false,
      authMethod: 'magic-link',
      isDevelopment: false,
      isProduction: true,
      isOrg: false,
      isLocal: false,
      analytics: false,
      payments: true
    };
  }

  // ANS Registry Domain
  if (host.includes('knaight.site')) {
    return {
      baseUrl: 'https://knaight.site',
      ansRegistry: 'https://knaight.site',
      autoRegisterANS: false,
      isEU: false,
      isANSRegistry: true,
      walletRequired: true,
      authMethod: 'web3',
      isDevelopment: false,
      isProduction: true,
      isOrg: false,
      isLocal: false,
      analytics: true,
      payments: true
    };
  }

  // Default: SCK Platform
  const isOrg = host.includes('secure-knaight.org');
  const isEU = host.includes('secure-knaight.eu');
  return {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || `https://${host}`,
    ansRegistry: process.env.NEXT_PUBLIC_ANS_REGISTRY_URL || 'https://knaight.site',
    autoRegisterANS: true,
    isEU,
    isANSRegistry: false,
    walletRequired: false,
    authMethod: 'magic-link',
    isDevelopment: false,
    isProduction: true,
    isOrg,
    isLocal: false,
    analytics: !isEU && !isOrg, // .org domains don't support analytics
    payments: !isOrg
  };
}

/**
 * Derive current primary domain from env or URL
 */
export function getCurrentDomain(): string {
  if (process.env.NEXT_PUBLIC_PRIMARY_DOMAIN) return process.env.NEXT_PUBLIC_PRIMARY_DOMAIN;
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try {
    return new URL(base).hostname;
  } catch {
    return 'localhost';
  }
}

/**
 * Get base URL for current environment
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'http://localhost:3000';
}

/**
 * Build API URL with proper domain and version
 */
export function buildApiUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const version = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}/api/${version}${cleanPath}`;
}

/**
 * Level-based role agent naming convention
 * Pattern: "L{level} {role}"
 */
export function generateRoleAgentName(roleTemplate: string, level: number): string {
  return `L${level} ${roleTemplate}`;
}

/**
 * Assign level based on trust score
 */
export function assignLevel(trustScore: number): number {
  if (trustScore >= 900) return 5;  // Expert
  if (trustScore >= 750) return 4;  // Advanced  
  if (trustScore >= 500) return 3;  // Intermediate
  if (trustScore >= 250) return 2;  // Basic
  return 1;                         // Entry
}

/**
 * Get qualification level from trust score and level
 */
export function getQualificationLevel(trustScore: number, level: number): string {
  if (trustScore >= 900) return 'Expert';
  if (trustScore >= 750) return 'Advanced';
  if (trustScore >= 500) return 'Intermediate';
  if (trustScore >= 250) return 'Basic';
  return 'Entry';
}

/**
 * Check if agent can be promoted to higher level
 */
export function canPromoteLevel(currentLevel: number, newTrustScore: number): boolean {
  const suggestedLevel = assignLevel(newTrustScore);
  return suggestedLevel > currentLevel;
}

/**
 * Get trust level classification for ANS
 */
export function getTrustLevel(trustScore: number): string {
  if (trustScore >= 900) return 'EXPERT';
  if (trustScore >= 750) return 'HIGHLY_TRUSTED';
  if (trustScore >= 500) return 'TRUSTED';
  if (trustScore >= 250) return 'BASIC_TRUST';
  return 'UNVERIFIED';
}

/**
 * Build ANS registration payload for role agent
 */
export function buildANSRegistrationPayload(roleAgent: {
  id: string;
  name: string;
  level: number;
  trustScore: number;
  assignedToDid: string;
  organization: { name: string; domain: string };
  roleTemplate: { title: string };
  certifications?: string[];
}): ANSRegistrationPayload {
  const config = getDomainConfig();

  // Generate ANS identifier: l{level}-{role}.{org-domain}.knaight
  const roleName = roleAgent.roleTemplate.title.toLowerCase().replace(/\s+/g, '-');
  const orgDomain = roleAgent.organization.domain.toLowerCase();
  const ansId = `l${roleAgent.level}-${roleName}.${orgDomain}.knaight`;

  return {
    ansId,
    did: roleAgent.assignedToDid,
    role: roleAgent.roleTemplate.title,
    level: roleAgent.level,
    qualificationLevel: getQualificationLevel(roleAgent.trustScore, roleAgent.level),
    organization: roleAgent.organization.name,
    trustLevel: getTrustLevel(roleAgent.trustScore),
    verificationEndpoint: buildApiUrl(`/verify/${roleAgent.id}`),
    publicMetadata: {
      role: roleAgent.roleTemplate.title,
      level: roleAgent.level,
      qualificationLevel: getQualificationLevel(roleAgent.trustScore, roleAgent.level),
      organization: roleAgent.organization.name,
      certifications: roleAgent.certifications || [],
      trustScore: roleAgent.trustScore,
      lastUpdated: new Date().toISOString()
    }
  };
}

/**
 * Register role agent to ANS Registry
 */
export async function registerToANS(payload: ANSRegistrationPayload): Promise<{
  success: boolean;
  ansId?: string;
  error?: string;
  correlationId: string;
}> {
  const config = getDomainConfig();
  const correlationId = generateCorrelationId();

  if (!config.autoRegisterANS) {
    return {
      success: false,
      error: 'ANS auto-registration disabled for this domain',
      correlationId
    };
  }

  try {
    console.log(`🔗 ANS Registration [${correlationId}]:`, {
      ansId: payload.ansId,
      level: payload.level,
      organization: payload.organization,
      ansRegistry: config.ansRegistry
    });

    // In development, simulate ANS registration
    if (config.isDevelopment) {
      console.log(`🏠 [LOCAL] Simulating ANS registration to ${config.ansRegistry}`);
      // TODO: When localhost:3001 ANS registry is set up, make real request
      return {
        success: true,
        ansId: payload.ansId,
        correlationId
      };
    }

    // Production ANS registration
    const response = await fetch(`${config.ansRegistry}/api/ans/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Correlation-ID': correlationId,
        'Origin': config.baseUrl
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`ANS registration failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      ansId: result.ansId || payload.ansId,
      correlationId
    };

  } catch (error) {
    console.error(`❌ ANS Registration failed [${correlationId}]:`, error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      correlationId
    };
  }
}

/**
 * Generate correlation ID for tracking requests across services
 */
export function generateCorrelationId(): string {
  return `sck-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate cross-domain request origin
 */
export function validateOrigin(origin: string): boolean {
  const config = getDomainConfig();

  const allowedOrigins = [
    config.baseUrl,
    config.ansRegistry,
    'https://secure-knaight.io',
    'https://secure-knaight.eu',
    'https://knaight.site'
  ];

  // Allow localhost in development
  if (config.isDevelopment) {
    allowedOrigins.push(
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    );
  }

  return allowedOrigins.includes(origin);
}

/**
 * Get CORS origins for API configuration
 */
export function getCorsOrigins(): string[] {
  const config = getDomainConfig();

  const origins = [
    config.ansRegistry,
    'https://secure-knaight.io',
    'https://secure-knaight.eu',
    'https://knaight.site'
  ];

  if (config.isDevelopment) {
    origins.push(
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    );
  }

  return origins;
}

/**
 * Debug helper for local development
 */
export function debugDomainInfo(hostname?: string) {
  if (process.env.NODE_ENV !== 'development') return;

  const config = getDomainConfig(hostname);
  console.log('🌐 Domain Configuration:', {
    hostname: hostname || 'current',
    config,
    baseUrl: getBaseUrl(),
    corsOrigins: getCorsOrigins()
  });
}

/**
 * Test ANS integration in development
 */
export async function testANSIntegration() {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('⚠️  ANS integration testing only available in development');
    return;
  }

  console.log('🧪 Testing ANS Integration...');

  const testAgent = {
    id: 'agent-test-123',
    name: 'L4 Security Engineer',
    level: 4,
    trustScore: 825,
    assignedToDid: 'did:ethr:0xtest123...',
    organization: { name: 'TestCorp', domain: 'testcorp' },
    roleTemplate: { title: 'Security Engineer' },
    certifications: ['CISSP', 'CEH']
  };

  try {
    const payload = buildANSRegistrationPayload(testAgent);
    console.log('📋 ANS Payload:', payload);

    const result = await registerToANS(payload);
    console.log('✅ ANS Registration Result:', result);

    return result;
  } catch (error) {
    console.error('❌ ANS Integration Test Failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error', correlationId: 'test-failed' };
  }
} 