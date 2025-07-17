/**
 * Validation System Tests
 * 
 * Tests for environment validation, payment validation, and domain configuration
 */

import { validateEnvironment, getEnvironmentConfig } from '../env-validation';
import { validatePaymentConfig, supportsPaymentMethod } from '../payment-validation';
import { getCurrentDomain, getDomainConfig } from '../domains';

// Mock environment variables
const mockEnv = (env: Record<string, string>) => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = { ...originalEnv, ...env };
  });
  afterEach(() => {
    process.env = originalEnv;
  });
};

describe('Environment Validation', () => {
  describe('Production Safety', () => {
    mockEnv({
      NEXT_PUBLIC_ENVIRONMENT: 'production',
      NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
    });

    it('should reject localhost URLs in production', () => {
      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Production environment should not use localhost URLs');
    });

    it('should require HTTPS in production', () => {
      mockEnv({
        NEXT_PUBLIC_ENVIRONMENT: 'production',
        NEXT_PUBLIC_BASE_URL: 'http://secure-knaight.io',
      });

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Production URLs must use HTTPS');
    });
  });

  describe('Domain Compliance', () => {
    it('should require EU compliance for .eu domain', () => {
      mockEnv({
        NEXT_PUBLIC_PRIMARY_DOMAIN: 'secure-knaight.eu',
        NEXT_PUBLIC_EU_COMPLIANCE: 'false',
      });

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.warnings).toContain('EU domain detected but NEXT_PUBLIC_EU_COMPLIANCE is false');
    });

    it('should disable Web3 for .org domain', () => {
      mockEnv({
        NEXT_PUBLIC_PRIMARY_DOMAIN: 'secure-knaight.org',
        NEXT_PUBLIC_ENABLE_WEB3: 'true',
      });

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.warnings).toContain('Web3 should be disabled for docs-only domain');
    });
  });

  describe('Payment Strategy Validation', () => {
    it('should require Stripe key when strategy is stripe', () => {
      mockEnv({
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'stripe',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_your_stripe_key',
      });

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Stripe key is required when payment strategy is "stripe"');
    });

    it('should validate Stripe key format', () => {
      mockEnv({
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'stripe',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'invalid_key',
      });

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid Stripe key format. Must start with "pk_"');
    });

    it('should allow crypto payments for .eu domain', () => {
      mockEnv({
        NEXT_PUBLIC_PRIMARY_DOMAIN: 'secure-knaight.eu',
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'crypto',
      });

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(true);
    });

    it('should reject Stripe for .eu domain', () => {
      mockEnv({
        NEXT_PUBLIC_PRIMARY_DOMAIN: 'secure-knaight.eu',
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'stripe',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_valid_key',
      });

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Stripe payments are not allowed for EU compliance domain');
    });

    it('should reject payments for .org domain', () => {
      mockEnv({
        NEXT_PUBLIC_PRIMARY_DOMAIN: 'secure-knaight.org',
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'crypto',
      });

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Payments are not allowed for docs domain');
    });
  });
});

describe('Payment Validation', () => {
  describe('Stripe Configuration', () => {
    it('should validate Stripe key presence', () => {
      mockEnv({
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'stripe',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_valid_key',
      });

      const validation = validatePaymentConfig();
      expect(validation.isValid).toBe(true);
      expect(validation.supportedMethods).toContain('stripe');
    });

    it('should reject missing Stripe key', () => {
      mockEnv({
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'stripe',
      });

      const validation = validatePaymentConfig();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Stripe key is required when payment strategy is "stripe"');
    });
  });

  describe('Crypto Configuration', () => {
    it('should support crypto payments when enabled', () => {
      mockEnv({
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'crypto',
        NEXT_PUBLIC_CRYPTO_PAYMENT_ENABLED: 'true',
      });

      const validation = validatePaymentConfig();
      expect(validation.supportedMethods).toContain('crypto');
    });

    it('should support ILP when enabled', () => {
      mockEnv({
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'crypto',
        NEXT_PUBLIC_CRYPTO_PAYMENT_ENABLED: 'true',
        NEXT_PUBLIC_ILP_ENABLED: 'true',
      });

      const validation = validatePaymentConfig();
      expect(validation.supportedMethods).toContain('ilp');
    });
  });

  describe('Domain-Specific Validation', () => {
    it('should validate payment methods for .io domain', () => {
      expect(validatePaymentForDomain('secure-knaight.io', 'stripe')).toBe(true);
      expect(validatePaymentForDomain('secure-knaight.io', 'crypto')).toBe(true);
      expect(validatePaymentForDomain('secure-knaight.io', 'ilp')).toBe(true);
    });

    it('should validate payment methods for .eu domain', () => {
      expect(validatePaymentForDomain('secure-knaight.eu', 'stripe')).toBe(false);
      expect(validatePaymentForDomain('secure-knaight.eu', 'crypto')).toBe(true);
      expect(validatePaymentForDomain('secure-knaight.eu', 'ilp')).toBe(true);
    });

    it('should validate payment methods for .org domain', () => {
      expect(validatePaymentForDomain('secure-knaight.org', 'stripe')).toBe(false);
      expect(validatePaymentForDomain('secure-knaight.org', 'crypto')).toBe(false);
      expect(validatePaymentForDomain('secure-knaight.org', 'ilp')).toBe(false);
    });

    it('should validate payment methods for localhost', () => {
      expect(validatePaymentForDomain('localhost', 'stripe')).toBe(false);
      expect(validatePaymentForDomain('localhost', 'crypto')).toBe(true);
      expect(validatePaymentForDomain('localhost', 'ilp')).toBe(true);
    });
  });
});

describe('Feature Support', () => {
  describe('Payment Methods', () => {
    it('should support crypto payments when configured', () => {
      mockEnv({
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'crypto',
        NEXT_PUBLIC_CRYPTO_PAYMENT_ENABLED: 'true',
      });

      expect(supportsPaymentMethod('crypto')).toBe(true);
      expect(supportsPaymentMethod('stripe')).toBe(false);
    });

    it('should support Stripe when configured', () => {
      mockEnv({
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'stripe',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_valid_key',
      });

      expect(supportsPaymentMethod('stripe')).toBe(true);
      expect(supportsPaymentMethod('crypto')).toBe(false);
    });
  });
});

describe('Domain Configuration', () => {
  describe('Domain Detection', () => {
    it('should detect current domain from environment', () => {
      mockEnv({
        NEXT_PUBLIC_PRIMARY_DOMAIN: 'secure-knaight.eu',
      });

      // Note: This test may need adjustment based on actual implementation
      // as getCurrentDomain() uses window.location in browser
      expect(getCurrentDomain()).toBe('secure-knaight.eu');
    });
  });

  describe('Domain Configuration', () => {
    it('should configure .io domain correctly', () => {
      const config = getDomainConfig('secure-knaight.io');

      expect(config.isProduction).toBe(true);
      expect(config.isEU).toBe(false);
      expect(config.isOrg).toBe(false);
      expect(config.analytics).toBe(true);
      expect(config.payments).toBe(true);
    });

    it('should configure .eu domain correctly', () => {
      const config = getDomainConfig('secure-knaight.eu');

      expect(config.isProduction).toBe(true);
      expect(config.isEU).toBe(true);
      expect(config.isOrg).toBe(false);
      expect(config.analytics).toBe(false);
      expect(config.payments).toBe(true);
    });

    it('should configure .org domain correctly', () => {
      const config = getDomainConfig('secure-knaight.org');

      expect(config.isProduction).toBe(true);
      expect(config.isEU).toBe(false);
      expect(config.isOrg).toBe(true);
      expect(config.analytics).toBe(false);
      expect(config.payments).toBe(true); // This depends on env config
    });

    it('should configure localhost correctly', () => {
      const config = getDomainConfig('localhost');

      expect(config.isLocal).toBe(true);
      expect(config.isProduction).toBe(false);
      expect(config.analytics).toBe(false);
      expect(config.payments).toBe(false); // This depends on env config
    });
  });
}); 