/**
 * Validation System Tests
 * 
 * Tests for environment validation, payment validation, and domain configuration
 */

import { validateEnvironment, getEnvironmentConfig } from '../env-validation';
import { validatePaymentConfig, supportsPaymentMethod, validatePaymentForDomain } from '../payment-validation';
import { getCurrentDomain, getDomainConfig } from '../domains';

// Mock environment variables
const mockEnv = {
  environment: 'development' as const,
  baseUrl: 'http://localhost:3000',
  primaryDomain: 'localhost',
  paymentStrategy: 'crypto',
  stripeKey: 'pk_test_valid_key',
  walletConnectProjectId: 'test_project_id',
  enableWeb3: true,
  enableMagicAuth: false,
  euCompliance: false,
  cookieConsentEnabled: false,
  debugMode: false,
  validateEnvironment: false,
  logLevel: 'info',
  analytics: false,
  payments: true
};

describe('Environment Validation', () => {
  describe('Production Safety', () => {
    it('should reject localhost URLs in production', () => {
      const config = {
        ...mockEnv,
        environment: 'production' as const,
        baseUrl: 'http://localhost:3000'
      };

      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('CRITICAL: Production cannot run with localhost as base URL');
    });

    it('should require HTTPS in production', () => {
      const config = {
        ...mockEnv,
        environment: 'production' as const,
        baseUrl: 'http://secure-knaight.io'
      };

      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Production must use HTTPS');
    });
  });

  describe('Domain Compliance', () => {
    it('should require EU compliance for .eu domain', () => {
      const config = {
        ...mockEnv,
        baseUrl: 'https://secure-knaight.eu',
        primaryDomain: 'secure-knaight.eu',
        euCompliance: false
      };

      const result = validateEnvironment(config);

      expect(result.warnings).toContain('EU domain detected but EU compliance not enabled');
    });

    it('should disable Web3 for .org domain', () => {
      const config = {
        ...mockEnv,
        baseUrl: 'https://secure-knaight.org',
        primaryDomain: 'secure-knaight.org',
        enableWeb3: true
      };

      const result = validateEnvironment(config);

      expect(result.warnings).toContain('Web3 should be disabled for docs-only domain');
    });
  });

  describe('Payment Strategy Validation', () => {
    it('should require Stripe key when strategy is stripe', () => {
      const config = {
        ...mockEnv,
        paymentStrategy: 'stripe',
        stripeKey: ''
      };

      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Stripe is selected but the publishable key is missing or a placeholder');
    });

    it('should validate Stripe key format', () => {
      const config = {
        ...mockEnv,
        paymentStrategy: 'stripe',
        stripeKey: 'invalid_key'
      };

      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Stripe key format is invalid');
    });

    it('should allow crypto payments for .eu domain', () => {
      const config = {
        ...mockEnv,
        baseUrl: 'https://secure-knaight.eu',
        primaryDomain: 'secure-knaight.eu',
        paymentStrategy: 'crypto',
        walletConnectProjectId: 'test-project-id'
      };

      const result = validateEnvironment(config);

      expect(result.isValid).toBe(true);
    });

    it('should reject Stripe for .eu domain', () => {
      const config = {
        ...mockEnv,
        baseUrl: 'https://secure-knaight.eu',
        primaryDomain: 'secure-knaight.eu',
        paymentStrategy: 'stripe',
        stripeKey: 'pk_test_valid_key'
      };

      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Stripe payments are not allowed for EU compliance domain');
    });

    it('should reject payments for .org domain', () => {
      const config = {
        ...mockEnv,
        baseUrl: 'https://secure-knaight.org',
        primaryDomain: 'secure-knaight.org',
        paymentStrategy: 'stripe',
        stripeKey: 'pk_test_valid_key'
      };

      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Payments are not allowed for docs domain');
    });
  });
});

describe('Payment Validation', () => {
  describe('Stripe Configuration', () => {
    it('should validate Stripe key presence', () => {
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'stripe';
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_valid_key';

      const validation = validatePaymentConfig();
      expect(validation.isValid).toBe(true);
    });

    it('should reject missing Stripe key', () => {
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'stripe';
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = '';

      const validation = validatePaymentConfig();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Stripe key is required when payment strategy is "stripe"');
    });
  });

  describe('Crypto Configuration', () => {
    it('should support crypto payments when enabled', () => {
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'crypto';
      process.env.NEXT_PUBLIC_CRYPTO_PAYMENT_ENABLED = 'true';

      expect(supportsPaymentMethod('crypto')).toBe(true);
      expect(supportsPaymentMethod('stripe')).toBe(false);
    });

    it('should support ILP when enabled', () => {
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'crypto';
      process.env.NEXT_PUBLIC_CRYPTO_PAYMENT_ENABLED = 'true';
      process.env.NEXT_PUBLIC_ILP_ENABLED = 'true';

      expect(supportsPaymentMethod('ilp')).toBe(true);
      expect(supportsPaymentMethod('stripe')).toBe(false);
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
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'crypto';
      process.env.NEXT_PUBLIC_CRYPTO_PAYMENT_ENABLED = 'true';

      expect(supportsPaymentMethod('crypto')).toBe(true);
      expect(supportsPaymentMethod('stripe')).toBe(false);
    });

    it('should support Stripe when configured', () => {
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'stripe';
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_valid_key';

      expect(supportsPaymentMethod('stripe')).toBe(true);
      expect(supportsPaymentMethod('crypto')).toBe(false);
    });
  });
});

describe('Domain Configuration', () => {
  describe('Domain Detection', () => {
    it('should detect current domain from environment', () => {
      process.env.NEXT_PUBLIC_PRIMARY_DOMAIN = 'secure-knaight.eu';

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

      expect(config.isEU).toBe(false);
      expect(config.isOrg).toBe(true);
      expect(config.analytics).toBe(false);
      expect(config.payments).toBe(false); // .org domains don't support payments
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