/**
 * SCK Domain Management
 * Handles domain configuration for local development and production environments
 */

import { getEnvironmentConfig, shouldEnablePrivacyFeatures, shouldEnableAnalytics } from './env-validation';

// =============================================================================
// DOMAIN CONFIGURATION
// =============================================================================

export const PRIMARY_DOMAIN = 'secure-knaight.io';
export const EU_DOMAIN = 'secure-knaight.eu';
export const ORG_DOMAIN = 'secure-knaight.org';

export const PRODUCTION_DOMAINS = [
  PRIMARY_DOMAIN,
  EU_DOMAIN,
  ORG_DOMAIN,
] as const;

export const LEGACY_DOMAINS = [
  'secure-knaight.site',
] as const;

export const ALLOWED_DOMAINS = [
  'localhost',
  'localhost:3000',
  'localhost:3001',
  '127.0.0.1',
  '127.0.0.1:3000',
  '127.0.0.1:3001',
  ...PRODUCTION_DOMAINS,
  ...LEGACY_DOMAINS,
] as const;

export type ProductionDomain = typeof PRODUCTION_DOMAINS[number];
export type AllowedDomain = typeof ALLOWED_DOMAINS[number];

// =============================================================================
// ENVIRONMENT DETECTION
// =============================================================================

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

// =============================================================================
// BASE URL MANAGEMENT
// =============================================================================

export function getBaseUrl(): string {
  // Runtime detection for client-side
  if (typeof window !== 'undefined' && window?.location?.origin) {
    return window.location.origin;
  }

  // Environment variable fallback
  const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (envBaseUrl) {
    return envBaseUrl;
  }

  // Default fallbacks based on environment
  if (isDevelopment()) {
    return 'http://localhost:3000';
  }

  return `https://${PRIMARY_DOMAIN}`;
}

export function getApiBaseUrl(): string {
  const baseUrl = getBaseUrl();
  const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || 'v1';
  return `${baseUrl}/api/${apiVersion}`;
}

// =============================================================================
// DOMAIN VALIDATION
// =============================================================================

export function getCurrentDomain(): string {
  // Runtime detection for client-side
  if (typeof window !== 'undefined' && window?.location?.hostname) {
    return window.location.hostname;
  }

  // Environment variable fallback
  const envDomain = process.env.NEXT_PUBLIC_PRIMARY_DOMAIN;
  if (envDomain) {
    return envDomain;
  }

  // Default fallback
  return PRIMARY_DOMAIN;
}

export function isValidDomain(hostname: string): boolean {
  return ALLOWED_DOMAINS.includes(hostname as AllowedDomain);
}

export function isProductionDomain(hostname: string): boolean {
  return PRODUCTION_DOMAINS.includes(hostname as ProductionDomain);
}

export function isLocalDomain(hostname: string): boolean {
  return hostname.startsWith('localhost') || hostname.startsWith('127.0.0.1');
}

export function getDomainType(hostname: string): 'local' | 'production' | 'invalid' {
  if (isLocalDomain(hostname)) {
    return 'local';
  }
  if (isProductionDomain(hostname)) {
    return 'production';
  }
  return 'invalid';
}

// =============================================================================
// DOMAIN-SPECIFIC CONFIGURATION
// =============================================================================

export function getDomainConfig(hostname: string) {
  const domainType = getDomainType(hostname);
  const envConfig = getEnvironmentConfig();

  switch (domainType) {
    case 'local':
      return {
        isLocal: true,
        isProduction: false,
        isEU: false,
        isOrg: false,
        analytics: false,
        sentry: false,
        featureFlags: false,
        cookieConsent: false,
        gdpr: false,
        web3: envConfig.enableWeb3,
        payments: envConfig.paymentStrategy !== 'none',
      };

    case 'production':
      return {
        isLocal: false,
        isProduction: true,
        isEU: hostname === EU_DOMAIN,
        isOrg: hostname === ORG_DOMAIN,
        analytics: shouldEnableAnalytics(hostname),
        sentry: shouldEnableAnalytics(hostname),
        featureFlags: true,
        cookieConsent: !shouldEnablePrivacyFeatures(hostname),
        gdpr: hostname === EU_DOMAIN,
        web3: envConfig.enableWeb3,
        payments: envConfig.paymentStrategy !== 'none',
      };

    default:
      return {
        isLocal: false,
        isProduction: false,
        isEU: false,
        isOrg: false,
        analytics: false,
        sentry: false,
        featureFlags: false,
        cookieConsent: false,
        gdpr: false,
        web3: envConfig.enableWeb3,
        payments: envConfig.paymentStrategy !== 'none',
      };
  }
}

// =============================================================================
// URL BUILDING UTILITIES
// =============================================================================

export function buildUrl(path: string, domain?: string): string {
  const baseUrl = domain ? `https://${domain}` : getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function buildApiUrl(endpoint: string): string {
  const apiBaseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${apiBaseUrl}${cleanEndpoint}`;
}

export function buildWalletCallbackUrl(provider: string): string {
  return buildApiUrl(`/auth/${provider}/callback`);
}

export function buildWebhookUrl(service: string): string {
  return buildApiUrl(`/webhooks/${service}`);
}

// =============================================================================
// SEO & METADATA UTILITIES
// =============================================================================

export function getCanonicalUrl(path: string): string {
  return buildUrl(path, PRIMARY_DOMAIN);
}

export function getAlternateUrls(path: string): Record<string, string> {
  return {
    'en': buildUrl(path, PRIMARY_DOMAIN),
    'en-EU': buildUrl(path, EU_DOMAIN),
    'x-default': buildUrl(path, PRIMARY_DOMAIN),
  };
}

// =============================================================================
// SECURITY & VALIDATION
// =============================================================================

export function validateOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    return isValidDomain(url.hostname);
  } catch {
    return false;
  }
}

export function getCorsOrigins(): string[] {
  if (isDevelopment()) {
    return [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ];
  }

  return [
    `https://${PRIMARY_DOMAIN}`,
    `https://${EU_DOMAIN}`,
    `https://${ORG_DOMAIN}`,
  ];
}

// =============================================================================
// REDIRECT UTILITIES
// =============================================================================

export function getRedirectUrl(fromDomain: string, toDomain: string, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `https://${toDomain}${cleanPath}`;
}

export function shouldRedirect(fromDomain: string): { should: boolean; target: string } {
  // Don't redirect from primary domain
  if (fromDomain === PRIMARY_DOMAIN) {
    return { should: false, target: '' };
  }

  // Redirect legacy .site domain to primary
  if (fromDomain === 'secure-knaight.site') {
    return { should: true, target: `https://${PRIMARY_DOMAIN}` };
  }

  // Redirect .org to docs subdomain
  if (fromDomain === ORG_DOMAIN) {
    return { should: true, target: `https://docs.${PRIMARY_DOMAIN}` };
  }

  // Redirect .eu to primary unless EU-specific features are needed
  if (fromDomain === EU_DOMAIN) {
    // Check if EU-specific features are required
    const requiresEU = process.env.NEXT_PUBLIC_EU_COMPLIANCE === 'true';
    if (!requiresEU) {
      return { should: true, target: `https://${PRIMARY_DOMAIN}` };
    }
  }

  return { should: false, target: '' };
}

// =============================================================================
// ENVIRONMENT-SPECIFIC HELPERS
// =============================================================================

export function getEnvironmentName(): string {
  if (isDevelopment()) return 'development';
  if (isTest()) return 'test';
  return 'production';
}

export function getEnvironmentColor(): string {
  switch (getEnvironmentName()) {
    case 'development': return '#10b981'; // green
    case 'test': return '#f59e0b'; // yellow
    case 'production': return '#ef4444'; // red
    default: return '#6b7280'; // gray
  }
}

export function getDomainTheme(hostname: string): 'default' | 'eu' | 'org' {
  if (hostname === EU_DOMAIN) return 'eu';
  if (hostname === ORG_DOMAIN) return 'org';
  return 'default';
}

export function getDomainThemeConfig(hostname: string) {
  const theme = getDomainTheme(hostname);

  switch (theme) {
    case 'eu':
      return {
        primaryColor: '#2563eb', // EU blue
        secondaryColor: '#1e40af',
        accentColor: '#3b82f6',
        logo: '/images/logo-eu.svg',
        favicon: '/favicon-eu.ico',
      };
    case 'org':
      return {
        primaryColor: '#059669', // Open source green
        secondaryColor: '#047857',
        accentColor: '#10b981',
        logo: '/images/logo-org.svg',
        favicon: '/favicon-org.ico',
      };
    default:
      return {
        primaryColor: '#7c3aed', // SCK purple
        secondaryColor: '#5b21b6',
        accentColor: '#8b5cf6',
        logo: '/images/logo.svg',
        favicon: '/favicon.ico',
      };
  }
}

// =============================================================================
// DEBUGGING & LOGGING
// =============================================================================

export function logDomainInfo(hostname: string): void {
  if (isDevelopment()) {
    console.log('🌐 Domain Info:', {
      hostname,
      domainType: getDomainType(hostname),
      config: getDomainConfig(hostname),
      baseUrl: getBaseUrl(),
      apiBaseUrl: getApiBaseUrl(),
      environment: getEnvironmentName(),
    });
  }
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type DomainConfig = ReturnType<typeof getDomainConfig>;
export type Environment = 'development' | 'production' | 'test'; 