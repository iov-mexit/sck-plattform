/**
 * Zod Validation Tests
 * 
 * Tests for the Zod-enhanced environment validation system
 */

import { getEnvironmentConfig, validateEnvironment } from '../env-validation';

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

describe('Zod Environment Validation', () => {
  describe('Valid Configurations', () => {
    it('should parse valid development configuration', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
        NEXT_PUBLIC_ENVIRONMENT: 'development',
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'crypto',
        NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: 'test_project_id',
      });

      const config = getEnvironmentConfig();
      expect(config.environment).toBe('development');
      expect(config.baseUrl).toBe('http://localhost:3000');
      expect(config.primaryDomain).toBe('localhost');
      expect(config.paymentStrategy).toBe('crypto');
      expect(config.enableWeb3).toBe(true);
    });

    it('should parse valid production configuration', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'https://secure-knaight.io',
        NEXT_PUBLIC_ENVIRONMENT: 'production',
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'stripe',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_valid_key',
        NEXT_PUBLIC_SENTRY_DSN: 'https://sentry.io/project',
        NEXT_PUBLIC_ANALYTICS_ID: 'UA-XXXXX-Y',
      });

      const config = getEnvironmentConfig();
      expect(config.environment).toBe('production');
      expect(config.baseUrl).toBe('https://secure-knaight.io');
      expect(config.primaryDomain).toBe('secure-knaight.io');
      expect(config.paymentStrategy).toBe('stripe');
      expect(config.enableWeb3).toBe(false);
    });

    it('should handle EU compliance configuration', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'https://secure-knaight.eu',
        NEXT_PUBLIC_ENVIRONMENT: 'production',
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'crypto',
        NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: 'test_project_id',
        NEXT_PUBLIC_EU_COMPLIANCE: 'true',
        NEXT_PUBLIC_COOKIE_CONSENT_ENABLED: 'true',
      });

      const config = getEnvironmentConfig();
      expect(config.primaryDomain).toBe('secure-knaight.eu');
      expect(config.euCompliance).toBe(true);
      expect(config.cookieConsentEnabled).toBe(true);
    });
  });

  describe('Invalid Configurations', () => {
    it('should throw error for invalid URL', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'invalid-url',
        NEXT_PUBLIC_ENVIRONMENT: 'development',
      });

      expect(() => getEnvironmentConfig()).toThrow('BASE_URL must be a valid URL');
    });

    it('should throw error for invalid environment', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
        NEXT_PUBLIC_ENVIRONMENT: 'invalid',
      });

      expect(() => getEnvironmentConfig()).toThrow();
    });

    it('should throw error for invalid payment strategy', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
        NEXT_PUBLIC_ENVIRONMENT: 'development',
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'invalid',
      });

      expect(() => getEnvironmentConfig()).toThrow();
    });
  });

  describe('Validation Logic', () => {
    it('should validate production safety', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
        NEXT_PUBLIC_ENVIRONMENT: 'production',
      });

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('CRITICAL: Production cannot run with localhost as base URL');
    });

    it('should validate Stripe configuration', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'https://secure-knaight.io',
        NEXT_PUBLIC_ENVIRONMENT: 'production',
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'stripe',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_your_stripe_key',
      });

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Stripe is selected but the publishable key is missing or a placeholder');
    });

    it('should validate crypto configuration', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'https://secure-knaight.io',
        NEXT_PUBLIC_ENVIRONMENT: 'production',
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'crypto',
      });

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Crypto payment strategy selected, but WalletConnect project ID is missing');
    });

    it('should validate EU compliance', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'https://secure-knaight.eu',
        NEXT_PUBLIC_ENVIRONMENT: 'production',
        NEXT_PUBLIC_PAYMENT_STRATEGY: 'crypto',
        NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: 'test_project_id',
        NEXT_PUBLIC_EU_COMPLIANCE: 'false',
      });

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.warnings).toContain('EU domain detected but EU compliance not enabled');
    });
  });

  describe('Default Values', () => {
    it('should use default payment strategy', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
        NEXT_PUBLIC_ENVIRONMENT: 'development',
      });

      const config = getEnvironmentConfig();
      expect(config.paymentStrategy).toBe('none');
    });

    it('should use default log level', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
        NEXT_PUBLIC_ENVIRONMENT: 'development',
      });

      const config = getEnvironmentConfig();
      expect(config.logLevel).toBe('info');
    });

    it('should transform boolean values correctly', () => {
      mockEnv({
        NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
        NEXT_PUBLIC_ENVIRONMENT: 'development',
        NEXT_PUBLIC_EU_COMPLIANCE: 'true',
        NEXT_PUBLIC_COOKIE_CONSENT_ENABLED: 'true',
        NEXT_PUBLIC_DEBUG_MODE: 'true',
      });

      const config = getEnvironmentConfig();
      expect(config.euCompliance).toBe(true);
      expect(config.cookieConsentEnabled).toBe(true);
      expect(config.debugMode).toBe(true);
    });
  });
}); 