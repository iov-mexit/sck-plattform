/**
 * Startup Validation
 * 
 * Validates environment configuration on app startup and provides
 * domain-aware configuration for the SCK multi-domain architecture.
 */

import { validateEnvironment, getEnvironmentConfig, logValidationResults } from './env-validation';
import { getCurrentDomain, logDomainInfo } from './domains';
import { validatePaymentConfig, logPaymentConfig } from './payment-validation';

/**
 * Initialize environment validation on app startup
 * Call this in _app.tsx or layout.tsx
 */
export function initializeEnvironmentValidation(): void {
  // Only run on server-side or during build
  if (typeof window === 'undefined') {
    try {
      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      // Log validation results
      logValidationResults(result);

      // Validate payment configuration
      const paymentValidation = validatePaymentConfig();
      if (!paymentValidation.isValid) {
        console.error('❌ Payment configuration validation failed:');
        paymentValidation.errors.forEach(error => console.error(`  ❌ ${error}`));
        paymentValidation.recommendations.forEach(rec => console.info(`  💡 ${rec}`));
      }

      // Log domain info in development
      if (process.env.NODE_ENV === 'development') {
        const currentDomain = getCurrentDomain();
        logDomainInfo(currentDomain);
        logPaymentConfig();
      }

      // Throw error if critical validation fails
      if (!result.isValid || !paymentValidation.isValid) {
        console.error('❌ Critical environment validation failed. Please fix the errors above.');
        // In production, you might want to exit the process
        if (process.env.NODE_ENV === 'production') {
          process.exit(1);
        }
      }
    } catch (error) {
      console.error('❌ Environment configuration error:', error);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
}

/**
 * Get validated environment configuration
 * Use this instead of direct process.env access
 */
export function getValidatedConfig() {
  try {
    const config = getEnvironmentConfig();
    const result = validateEnvironment(config);

    if (!result.isValid) {
      console.error('Environment validation failed:', result.errors);
    }

    return {
      config,
      validation: result,
      isValid: result.isValid
    };
  } catch (error) {
    console.error('Environment configuration error:', error);
    return {
      config: null,
      validation: { isValid: false, errors: [error instanceof Error ? error.message : 'Unknown error'], warnings: [] },
      isValid: false
    };
  }
}

/**
 * Check if current environment supports specific features
 */
export function supportsFeature(feature: 'web3' | 'payments' | 'analytics' | 'sentry' | 'cookies'): boolean {
  const { config } = getValidatedConfig();

  if (!config) {
    return false;
  }

  const currentDomain = getCurrentDomain();

  switch (feature) {
    case 'web3':
      return config.enableWeb3 || false;

    case 'payments':
      return config.paymentStrategy !== 'none';

    case 'analytics':
      return config.environment === 'production' && !config.euCompliance && !!config.analyticsId;

    case 'sentry':
      return config.environment === 'production' && !config.euCompliance && !!config.sentryDsn;

    case 'cookies':
      return !config.euCompliance && (config.cookieConsentEnabled || false);

    default:
      return false;
  }
}

/**
 * Get feature flags based on domain and environment
 */
export function getFeatureFlags() {
  const { config } = getValidatedConfig();
  const currentDomain = getCurrentDomain();

  if (!config) {
    return {
      web3: false,
      payments: false,
      analytics: false,
      sentry: false,
      cookies: false,
      euCompliance: false,
      privacyMode: true,
      stripe: false,
      crypto: false,
      debug: false,
      validation: false,
    };
  }

  return {
    // Core features
    web3: config.enableWeb3 || false,
    payments: config.paymentStrategy !== 'none',
    analytics: supportsFeature('analytics'),
    sentry: supportsFeature('sentry'),
    cookies: supportsFeature('cookies'),

    // Domain-specific features
    euCompliance: config.euCompliance || false,
    privacyMode: config.euCompliance || currentDomain.includes('.org'),

    // Payment methods
    stripe: config.paymentStrategy === 'stripe',
    crypto: config.paymentStrategy === 'crypto',

    // Development features
    debug: config.environment === 'development',
    validation: config.validateEnvironment || false,
  };
}

/**
 * Validate environment on client-side (for debugging)
 */
export function validateClientEnvironment(): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const { config, validation } = getValidatedConfig();

    console.group('🔍 Client Environment Validation');
    console.log('Config:', config);
    console.log('Validation:', validation);
    console.log('Feature Flags:', getFeatureFlags());
    console.groupEnd();
  }
}

/**
 * Get environment-specific warnings for developers
 */
export function getEnvironmentWarnings(): string[] {
  const warnings: string[] = [];
  const { config } = getValidatedConfig();

  if (!config) {
    return ['Environment configuration is invalid'];
  }

  // Development warnings
  if (config.environment === 'development') {
    if (config.baseUrl.includes('localhost') && config.validateEnvironment) {
      warnings.push('Using localhost in development mode');
    }
  }

  // Production warnings
  if (config.environment === 'production') {
    if (config.baseUrl.includes('localhost')) {
      warnings.push('⚠️  CRITICAL: Using localhost in production!');
    }

    if (!config.baseUrl.startsWith('https://')) {
      warnings.push('⚠️  Production should use HTTPS');
    }
  }

  // Domain-specific warnings
  if (config.primaryDomain.endsWith('.eu') && !config.euCompliance) {
    warnings.push('EU domain detected but EU compliance is disabled');
  }

  if (config.primaryDomain.includes('.org') && config.enableWeb3) {
    warnings.push('Docs domain should have Web3 disabled');
  }

  return warnings;
} 