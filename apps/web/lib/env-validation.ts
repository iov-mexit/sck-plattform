// env-validation.ts
import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url({ message: 'BASE_URL must be a valid URL' }),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'production']),
  NEXT_PUBLIC_PAYMENT_STRATEGY: z.enum(['stripe', 'crypto', 'none']).default('none'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_MAGIC_API_KEY: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_EU_COMPLIANCE: z.coerce.boolean().optional().default(false),
  NEXT_PUBLIC_COOKIE_CONSENT_ENABLED: z.coerce.boolean().optional().default(false),
  NEXT_PUBLIC_DEBUG_MODE: z.coerce.boolean().optional().default(false),
  NEXT_PUBLIC_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional().default('info'),
  NEXT_PUBLIC_VALIDATE_ENVIRONMENT: z.string().optional().transform((v: string | undefined) => v !== 'false'),
});

export type RawEnv = z.infer<typeof EnvSchema>;

export interface EnvironmentConfig {
  environment: 'development' | 'production';
  baseUrl: string;
  primaryDomain: string;
  paymentStrategy: 'stripe' | 'crypto' | 'none';
  stripeKey?: string;
  enableWeb3: boolean;
  walletConnectProjectId?: string;
  enableMagicAuth: boolean;
  magicApiKey?: string;
  euCompliance: boolean;
  validateEnvironment: boolean;
  sentryDsn?: string;
  analyticsId?: string;
  debugMode: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  cookieConsentEnabled: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Parses and validates raw .env values using Zod.
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const parsed = EnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.format();
    const errors = Object.entries(formatted)
      .map(([key, val]) => {
        if (typeof val === 'object' && val !== null && '_errors' in val) {
          return `${key}: ${(val._errors as string[]).join(', ')}`;
        }
        return null;
      })
      .filter((error): error is string => error !== null);

    throw new Error(`❌ Invalid environment variables:\n${errors.join('\n')}`);
  }

  const env = parsed.data;

  return {
    environment: env.NEXT_PUBLIC_ENVIRONMENT,
    baseUrl: env.NEXT_PUBLIC_BASE_URL,
    primaryDomain: new URL(env.NEXT_PUBLIC_BASE_URL).hostname,
    paymentStrategy: env.NEXT_PUBLIC_PAYMENT_STRATEGY,
    stripeKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    enableWeb3: !!env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    walletConnectProjectId: env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    enableMagicAuth: !!env.NEXT_PUBLIC_MAGIC_API_KEY,
    magicApiKey: env.NEXT_PUBLIC_MAGIC_API_KEY,
    euCompliance: env.NEXT_PUBLIC_EU_COMPLIANCE ?? false,
    validateEnvironment: env.NEXT_PUBLIC_VALIDATE_ENVIRONMENT ?? true,
    sentryDsn: env.NEXT_PUBLIC_SENTRY_DSN,
    analyticsId: env.NEXT_PUBLIC_ANALYTICS_ID,
    debugMode: env.NEXT_PUBLIC_DEBUG_MODE ?? false,
    logLevel: env.NEXT_PUBLIC_LOG_LEVEL ?? 'info',
    cookieConsentEnabled: env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED ?? false,
  };
}

/**
 * Deep validation logic on top of Zod schema parsing.
 */
export function validateEnvironment(config: EnvironmentConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Base URL check
  if (config.environment === 'production') {
    if (config.baseUrl.includes('localhost')) {
      errors.push('CRITICAL: Production cannot run with localhost as base URL');
    }
    if (!config.baseUrl.startsWith('https://')) {
      errors.push('Production URLs must use HTTPS');
    }
  }

  // Authentication validation
  if (!config.enableMagicAuth) {
    warnings.push('Magic Link authentication is not configured - users will not be able to log in');
  }

  // Payment strategy check
  if (config.paymentStrategy === 'stripe') {
    if (!config.stripeKey) {
      errors.push('Stripe key is required when payment strategy is "stripe"');
    } else if (!config.stripeKey.startsWith('pk_')) {
      errors.push('Invalid Stripe key format. Must start with "pk_"');
    }
  }

  if (config.paymentStrategy === 'crypto' && !config.walletConnectProjectId) {
    errors.push('Crypto payment strategy selected, but WalletConnect project ID is missing');
  }

  // Web3 enablement consistency
  if (config.enableWeb3 && !config.walletConnectProjectId) {
    errors.push('Web3 is enabled but WalletConnect project ID is missing');
  }

  // EU compliance
  if (config.primaryDomain.endsWith('.eu') && !config.euCompliance) {
    warnings.push('EU domain detected but EU compliance not enabled');
  }

  if (config.euCompliance && !config.cookieConsentEnabled) {
    warnings.push('EU compliance enabled but cookie consent not configured');
  }

  // Sentry & analytics
  if (config.environment === 'production') {
    if (!config.sentryDsn) {
      warnings.push('Sentry DSN missing in production');
    }
    if (!config.analyticsId && !config.euCompliance) {
      warnings.push('Analytics ID missing and EU compliance is false');
    }
  }

  // Logging level check
  if (config.logLevel === 'debug' && config.environment === 'production') {
    warnings.push('Log level is set to DEBUG in production — consider reducing verbosity');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Output validation result to console.
 */
export function logValidationResults(result: ValidationResult): void {
  if (!result.isValid) {
    console.group('❌ Environment Validation Failed');
    result.errors.forEach((e: string) => console.error(`ERROR: ${e}`));
    result.warnings.forEach((w: string) => console.warn(`⚠️ Warning: ${w}`));
    console.groupEnd();
  } else {
    console.log('✅ Environment validation passed');
    result.warnings.forEach((w: string) => console.warn(`⚠️ Warning: ${w}`));
  }
}

/**
 * Check if privacy features should be enabled based on domain and compliance settings.
 */
export function shouldEnablePrivacyFeatures(hostname: string): boolean {
  const config = getEnvironmentConfig();
  return config.euCompliance || hostname.endsWith('.eu');
}

/**
 * Check if analytics should be enabled based on domain and compliance settings.
 */
export function shouldEnableAnalytics(hostname: string): boolean {
  const config = getEnvironmentConfig();
  return !config.euCompliance && !hostname.endsWith('.eu') && !!config.analyticsId;
} 