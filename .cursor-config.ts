/**
 * SCK Cursor IDE Configuration
 * Enforces development rules and domain strategy
 */

export const RULES = {
  DOMAIN_STRATEGY: {
    description: 'Use centralized domain handling via lib/domains.ts. Never hardcode any full URLs.',
    enforce: true,
    examples: {
      bad: [
        '"https://secure-knaight.io/api/foo"',
        '"http://localhost:3000/api/auth"',
        'window.location.origin + "/api"',
        'process.env.NEXT_PUBLIC_BASE_URL + "/api"',
      ],
      good: [
        'buildApiUrl("/foo")',
        'buildUrl("/auth/callback")',
        'getBaseUrl()',
        'getApiBaseUrl()',
      ],
    },
  },

  ENVIRONMENT_HANDLING: {
    description: 'Always use getDomainConfig() and getDomainType() for environment-specific logic.',
    enforce: true,
    examples: {
      bad: [
        'if (process.env.NODE_ENV === "production")',
        'if (window.location.hostname === "secure-knaight.io")',
        'const isProd = hostname.includes("secure-knaight")',
      ],
      good: [
        'const config = getDomainConfig(hostname)',
        'if (getDomainType(hostname) === "production")',
        'const { isProduction, isEU } = getDomainConfig(hostname)',
      ],
    },
  },

  WALLET_INTEGRATION: {
    description: 'Use buildWalletCallbackUrl() for all wallet callback URLs.',
    enforce: true,
    examples: {
      bad: [
        'redirectUri: "https://secure-knaight.io/api/wallet/callback"',
        'callbackUrl: window.location.origin + "/api/auth/callback"',
      ],
      good: [
        'redirectUri: buildWalletCallbackUrl("metamask")',
        'callbackUrl: buildWalletCallbackUrl("walletconnect")',
      ],
    },
  },

  SEO_METADATA: {
    description: 'Use getCanonicalUrl() and getAlternateUrls() for SEO metadata.',
    enforce: true,
    examples: {
      bad: [
        'canonical: "https://secure-knaight.io/dashboard"',
        'alternates: { en: "https://secure-knaight.io/dashboard" }',
      ],
      good: [
        'canonical: getCanonicalUrl("/dashboard")',
        'alternates: getAlternateUrls("/dashboard")',
      ],
    },
  },

  API_CALLS: {
    description: 'Use buildApiUrl() for all API endpoint construction.',
    enforce: true,
    examples: {
      bad: [
        'fetch("https://secure-knaight.io/api/v1/users")',
        'fetch(process.env.NEXT_PUBLIC_API_URL + "/users")',
      ],
      good: [
        'fetch(buildApiUrl("/users"))',
        'fetch(buildApiUrl("/auth/login"))',
      ],
    },
  },

  CORS_ORIGINS: {
    description: 'Use getCorsOrigins() for CORS configuration.',
    enforce: true,
    examples: {
      bad: [
        'origins: ["https://secure-knaight.io"]',
        'allowedOrigins: ["localhost:3000", "secure-knaight.io"]',
      ],
      good: [
        'origins: getCorsOrigins()',
        'allowedOrigins: getCorsOrigins()',
      ],
    },
  },
};

export const DOMAIN_POLICY = {
  PRIMARY: 'secure-knaight.io',
  EU: 'secure-knaight.eu',
  ORG: 'secure-knaight.org',
  LEGACY: 'secure-knaight.site',

  RULES: {
    'secure-knaight.io': 'Primary production domain - full features',
    'secure-knaight.eu': 'EU compliance mirror - GDPR-focused',
    'secure-knaight.org': 'Open source/docs - community portal',
    'secure-knaight.site': 'Legacy domain - redirect to primary',
  },

  REDIRECTS: {
    'secure-knaight.site': 'secure-knaight.io',
    'secure-knaight.org': 'docs.secure-knaight.io',
    'secure-knaight.eu': 'secure-knaight.io (unless EU compliance needed)',
  },
};

export const ENVIRONMENT_VARIABLES = {
  REQUIRED: [
    'NEXT_PUBLIC_BASE_URL',
    'NEXT_PUBLIC_API_VERSION',
    'NEXT_PUBLIC_ENVIRONMENT',
  ],

  OPTIONAL: [
    'NEXT_PUBLIC_SENTRY_DSN',
    'NEXT_PUBLIC_VERCEL_ANALYTICS_ID',
    'NEXT_PUBLIC_UNLEASH_URL',
    'NEXT_PUBLIC_EU_COMPLIANCE',
  ],

  SECRETS: [
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'DATABASE_URL',
    'REDIS_URL',
  ],
};

export const DEVELOPMENT_GUIDELINES = {
  DOMAIN_STRATEGY: [
    'All domain/environment-related logic must go through lib/domains.ts',
    'Do not hardcode localhost, .io, or any base URLs — use getBaseUrl, buildUrl, buildApiUrl, etc.',
    'Always use getDomainType and getDomainConfig to branch logic per TLD',
    'Ensure all wallet callbacks, API calls, SEO metadata, and redirects follow domain policy',
    'Enable logDomainInfo() in dev to debug domain misconfigurations',
  ],

  ENVIRONMENT_SETUP: [
    'Use .env.local for local development',
    'Use .env.production for production builds',
    'Use .env.example as template (never commit actual values)',
    'Validate environment variables at startup',
  ],

  SECURITY: [
    'Never expose secrets in client-side code',
    'Use NEXT_PUBLIC_ prefix only for client-safe variables',
    'Validate all origins and domains',
    'Use HTTPS in production, HTTP in development',
  ],
};

export const DEBUGGING = {
  ENABLE_DOMAIN_LOGGING: process.env.NODE_ENV === 'development',
  LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL || 'warn',
  SHOW_ENVIRONMENT_BANNER: process.env.NODE_ENV !== 'production',
};

export default {
  RULES,
  DOMAIN_POLICY,
  ENVIRONMENT_VARIABLES,
  DEVELOPMENT_GUIDELINES,
  DEBUGGING,
}; 