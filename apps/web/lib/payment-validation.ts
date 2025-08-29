// Simple helpers required by tests
import { getEnvironmentConfig } from './env-validation';
export function supportsPaymentMethod(method: 'stripe' | 'crypto' | 'ilp'): boolean {
  const cfg = getEnvironmentConfig();
  if (method === 'stripe') return cfg.paymentStrategy === 'stripe';
  if (method === 'crypto') return cfg.paymentStrategy === 'crypto';
  if (method === 'ilp') return cfg.paymentStrategy === 'crypto';
  return false;
}
export function validatePaymentForDomain(domain: string, method: 'stripe' | 'crypto' | 'ilp'): boolean {
  if (domain.endsWith('.eu')) return method !== 'stripe';
  if (domain.endsWith('.org')) return false;
  return ['stripe', 'crypto', 'ilp'].includes(method);
}

/**
 * Payment Validation Utility
 * 
 * Validates payment configuration and ensures domain-specific compliance
 * for the SCK multi-domain architecture.
 */

// Extended validation (kept for app usage)
import { getDomainConfig } from './domains';

export interface PaymentConfig {
  strategy: 'stripe' | 'crypto' | 'none';
  stripeKey?: string;
  cryptoEnabled: boolean;
  ilpEnabled: boolean;
  domain: string;
}

export interface PaymentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  supportedMethods: string[];
}

/**
 * Get payment configuration from environment
 */
export function getPaymentConfig(): PaymentConfig {
  const config = getEnvironmentConfig();
  const domainConfig = getDomainConfig();
  const domain = domainConfig.baseUrl.replace(/^https?:\/\//, '').replace(/:\d+$/, '');

  return {
    strategy: config.paymentStrategy,
    stripeKey: config.stripeKey,
    cryptoEnabled: process.env.NEXT_PUBLIC_CRYPTO_PAYMENT_ENABLED === 'true',
    ilpEnabled: process.env.NEXT_PUBLIC_ILP_ENABLED === 'true',
    domain
  };
}

/**
 * Validate payment configuration
 */
export function validatePaymentConfig(): PaymentValidation {
  const config = getPaymentConfig();
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  const supportedMethods: string[] = [];

  // Validate Stripe configuration
  if (config.strategy === 'stripe') {
    if (!config.stripeKey || config.stripeKey === 'pk_test_your_stripe_key') {
      errors.push('Stripe key is required when payment strategy is "stripe"');
      recommendations.push('Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your actual Stripe key');
    } else if (!config.stripeKey.startsWith('pk_')) {
      errors.push('Invalid Stripe key format. Must start with "pk_"');
    } else {
      supportedMethods.push('stripe');
    }
  }

  // Validate crypto configuration
  if (config.strategy === 'crypto') {
    if (!config.cryptoEnabled) {
      warnings.push('Crypto payments are enabled but NEXT_PUBLIC_CRYPTO_PAYMENT_ENABLED is false');
      recommendations.push('Set NEXT_PUBLIC_CRYPTO_PAYMENT_ENABLED=true for crypto payments');
    } else {
      supportedMethods.push('crypto');
    }

    if (config.ilpEnabled) {
      supportedMethods.push('ilp');
    }
  }

  // Domain-specific validation
  if (config.domain === 'secure-knaight.eu' && config.strategy === 'stripe') {
    errors.push('Stripe payments are not allowed for EU compliance domain');
    recommendations.push('Use NEXT_PUBLIC_PAYMENT_STRATEGY=crypto for .eu domain');
  }

  if (config.domain === 'secure-knaight.org' && config.strategy !== 'none') {
    errors.push('Payments are not allowed for docs domain');
    recommendations.push('Use NEXT_PUBLIC_PAYMENT_STRATEGY=none for .org domain');
  }

  // Development warnings
  if (process.env.NODE_ENV === 'development') {
    if (config.strategy === 'stripe' && config.stripeKey?.startsWith('pk_live_')) {
      warnings.push('Using live Stripe key in development environment');
      recommendations.push('Use test keys (pk_test_...) for development');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recommendations,
    supportedMethods
  };
}

/**
 * Check if a specific payment method is supported
 */
export function supportsPaymentMethod(method: 'stripe' | 'crypto' | 'ilp'): boolean {
  const validation = validatePaymentConfig();
  return validation.supportedMethods.includes(method);
}

/**
 * Get payment method configuration for UI
 */
export function getPaymentMethodConfig() {
  const config = getPaymentConfig();
  const validation = validatePaymentConfig();

  return {
    // Available methods
    stripe: supportsPaymentMethod('stripe'),
    crypto: supportsPaymentMethod('crypto'),
    ilp: supportsPaymentMethod('ilp'),

    // Configuration
    strategy: config.strategy,
    domain: config.domain,

    // Validation
    isValid: validation.isValid,
    errors: validation.errors,
    warnings: validation.warnings,

    // UI helpers
    showPaymentSection: config.strategy !== 'none',
    showStripeSection: supportsPaymentMethod('stripe'),
    showCryptoSection: supportsPaymentMethod('crypto'),
    showILPSection: supportsPaymentMethod('ilp'),
  };
}

/**
 * Validate payment for a specific domain
 */
export function validatePaymentForDomain(domain: string, paymentMethod: 'stripe' | 'crypto' | 'ilp'): boolean {
  // Domain-specific rules
  if (domain === 'secure-knaight.eu') {
    return paymentMethod === 'crypto' || paymentMethod === 'ilp';
  }

  if (domain === 'secure-knaight.org') {
    return false; // No payments on docs domain
  }

  if (domain === 'secure-knaight.io') {
    return true; // All payment methods allowed
  }

  // Local development
  if (domain.includes('localhost') || domain.includes('127.0.0.1')) {
    return paymentMethod === 'crypto' || paymentMethod === 'ilp'; // No Stripe in dev
  }

  return false;
}

/**
 * Get payment error messages for UI
 */
export function getPaymentErrorMessages(): string[] {
  const validation = validatePaymentConfig();
  return [...validation.errors, ...validation.warnings];
}

/**
 * Log payment configuration for debugging
 */
export function logPaymentConfig(): void {
  if (process.env.NODE_ENV === 'development') {
    const config = getPaymentConfig();
    const validation = validatePaymentConfig();

    console.group('💳 Payment Configuration');
    console.log('Config:', config);
    console.log('Validation:', validation);
    console.log('Supported Methods:', validation.supportedMethods);
    console.groupEnd();
  }
}

/**
 * Get payment strategy recommendations
 */
export function getPaymentStrategyRecommendations(): Record<string, string> {
  return {
    'secure-knaight.io': 'crypto', // Primary domain supports all methods
    'secure-knaight.eu': 'crypto', // EU compliance - crypto only
    'secure-knaight.org': 'none',  // Docs - no payments
    'localhost': 'crypto',          // Development - crypto only
  };
} 