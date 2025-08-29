/**
 * Zod Validation Tests
 * 
 * Tests for the Zod-enhanced environment validation system
 */

import { getEnvironmentConfig, validateEnvironment } from '../env-validation';

describe('Zod Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment variables before each test
    delete process.env.NEXT_PUBLIC_BASE_URL;
    delete process.env.NEXT_PUBLIC_ENVIRONMENT;
    delete process.env.NEXT_PUBLIC_PAYMENT_STRATEGY;
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    delete process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;
    delete process.env.NEXT_PUBLIC_ENABLE_WEB3;
    delete process.env.NEXT_PUBLIC_EU_COMPLIANCE;
    delete process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED;
    delete process.env.NEXT_PUBLIC_DEBUG_MODE;
    delete process.env.NEXT_PUBLIC_VALIDATE_ENVIRONMENT;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Valid Configurations', () => {
    it('should parse valid development configuration', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'development';
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'crypto';
      process.env.NEXT_PUBLIC_ENABLE_WEB3 = 'true';
      process.env.NEXT_PUBLIC_EU_COMPLIANCE = 'false';
      process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED = 'false';
      process.env.NEXT_PUBLIC_DEBUG_MODE = 'false';
      process.env.NEXT_PUBLIC_VALIDATE_ENVIRONMENT = 'false';

      const config = getEnvironmentConfig();

      expect(config.environment).toBe('development');
      expect(config.baseUrl).toBe('http://localhost:3000');
      expect(config.primaryDomain).toBe('localhost');
      expect(config.paymentStrategy).toBe('crypto');
      expect(config.enableWeb3).toBe(true);
    });

    it('should parse valid production configuration', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://secure-knaight.io';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'production';
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'stripe';
      process.env.NEXT_PUBLIC_ENABLE_WEB3 = 'true';
      process.env.NEXT_PUBLIC_EU_COMPLIANCE = 'false';
      process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED = 'false';
      process.env.NEXT_PUBLIC_DEBUG_MODE = 'false';
      process.env.NEXT_PUBLIC_VALIDATE_ENVIRONMENT = 'true';

      const config = getEnvironmentConfig();

      expect(config.environment).toBe('production');
      expect(config.baseUrl).toBe('https://secure-knaight.io');
      expect(config.primaryDomain).toBe('secure-knaight.io');
      expect(config.paymentStrategy).toBe('stripe');
      expect(config.enableWeb3).toBe(true);
    });

    it('should handle EU compliance configuration', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://secure-knaight.eu';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'production';
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'crypto';
      process.env.NEXT_PUBLIC_ENABLE_WEB3 = 'false';
      process.env.NEXT_PUBLIC_EU_COMPLIANCE = 'true';
      process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED = 'true';
      process.env.NEXT_PUBLIC_DEBUG_MODE = 'false';
      process.env.NEXT_PUBLIC_VALIDATE_ENVIRONMENT = 'true';

      const config = getEnvironmentConfig();

      expect(config.primaryDomain).toBe('secure-knaight.eu');
      expect(config.euCompliance).toBe(true);
      expect(config.cookieConsentEnabled).toBe(true);
    });
  });

  describe('Invalid Configurations', () => {
    it('should throw error for invalid URL', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'invalid-url';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'development';
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'crypto';

      expect(() => getEnvironmentConfig()).toThrow('BASE_URL must be a valid URL');
    });

    it('should throw error for invalid environment', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'invalid-env';
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'crypto';

      expect(() => getEnvironmentConfig()).toThrow();
    });

    it('should throw error for invalid payment strategy', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'development';
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'invalid-strategy';

      expect(() => getEnvironmentConfig()).toThrow();
    });
  });

  describe('Validation Logic', () => {
    it('should validate production safety', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'production';
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'stripe';
      process.env.NEXT_PUBLIC_ENABLE_WEB3 = 'true';
      process.env.NEXT_PUBLIC_EU_COMPLIANCE = 'false';
      process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED = 'false';
      process.env.NEXT_PUBLIC_DEBUG_MODE = 'false';
      process.env.NEXT_PUBLIC_VALIDATE_ENVIRONMENT = 'true';

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('CRITICAL: Production cannot run with localhost as base URL');
    });

    it('should validate Stripe configuration', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'development';
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'stripe';
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = '';
      process.env.NEXT_PUBLIC_ENABLE_WEB3 = 'true';
      process.env.NEXT_PUBLIC_EU_COMPLIANCE = 'false';
      process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED = 'false';
      process.env.NEXT_PUBLIC_DEBUG_MODE = 'false';
      process.env.NEXT_PUBLIC_VALIDATE_ENVIRONMENT = 'true';

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Stripe is selected but the publishable key is missing or a placeholder');
    });

    it('should validate crypto configuration', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'development';
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'crypto';
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = '';
      process.env.NEXT_PUBLIC_ENABLE_WEB3 = 'true';
      process.env.NEXT_PUBLIC_EU_COMPLIANCE = 'false';
      process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED = 'false';
      process.env.NEXT_PUBLIC_DEBUG_MODE = 'false';
      process.env.NEXT_PUBLIC_VALIDATE_ENVIRONMENT = 'true';

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Crypto payment strategy selected, but WalletConnect project ID is missing');
    });

    it('should validate EU compliance', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'https://secure-knaight.eu';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'production';
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'crypto';
      process.env.NEXT_PUBLIC_ENABLE_WEB3 = 'true';
      process.env.NEXT_PUBLIC_EU_COMPLIANCE = 'false';
      process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED = 'false';
      process.env.NEXT_PUBLIC_DEBUG_MODE = 'false';
      process.env.NEXT_PUBLIC_VALIDATE_ENVIRONMENT = 'true';

      const config = getEnvironmentConfig();
      const result = validateEnvironment(config);

      expect(result.warnings).toContain('EU domain detected but EU compliance not enabled');
    });
  });

  describe('Default Values', () => {
    it('should use default payment strategy', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'development';
      // Don't set NEXT_PUBLIC_PAYMENT_STRATEGY to test default
      process.env.NEXT_PUBLIC_ENABLE_WEB3 = 'true';
      process.env.NEXT_PUBLIC_EU_COMPLIANCE = 'false';
      process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED = 'false';
      process.env.NEXT_PUBLIC_DEBUG_MODE = 'false';
      process.env.NEXT_PUBLIC_VALIDATE_ENVIRONMENT = 'false';

      const config = getEnvironmentConfig();

      expect(config.paymentStrategy).toBe('none');
    });

    it('should use default log level', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'development';
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'crypto';
      process.env.NEXT_PUBLIC_ENABLE_WEB3 = 'true';
      process.env.NEXT_PUBLIC_EU_COMPLIANCE = 'false';
      process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED = 'false';
      process.env.NEXT_PUBLIC_DEBUG_MODE = 'false';
      process.env.NEXT_PUBLIC_VALIDATE_ENVIRONMENT = 'false';
      // Don't set NEXT_PUBLIC_LOG_LEVEL to test default

      const config = getEnvironmentConfig();

      expect(config.logLevel).toBe('info');
    });

    it('should transform boolean values correctly', () => {
      process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
      process.env.NEXT_PUBLIC_ENVIRONMENT = 'development';
      process.env.NEXT_PUBLIC_PAYMENT_STRATEGY = 'crypto';
      process.env.NEXT_PUBLIC_ENABLE_WEB3 = 'true';
      process.env.NEXT_PUBLIC_EU_COMPLIANCE = 'true';
      process.env.NEXT_PUBLIC_COOKIE_CONSENT_ENABLED = 'true';
      process.env.NEXT_PUBLIC_DEBUG_MODE = 'true';
      process.env.NEXT_PUBLIC_VALIDATE_ENVIRONMENT = 'false';

      const config = getEnvironmentConfig();

      expect(config.euCompliance).toBe(true);
      expect(config.cookieConsentEnabled).toBe(true);
      expect(config.debugMode).toBe(true);
    });
  });
}); 