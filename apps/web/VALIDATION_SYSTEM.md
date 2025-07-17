# SCK Validation System

## Overview

The SCK validation system provides comprehensive environment and configuration validation to ensure production readiness, domain compliance, and proper feature enablement across the multi-domain architecture.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Startup Validation                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Environment     │  │ Payment         │  │ Domain      │ │
│  │ Validation      │  │ Validation      │  │ Validation  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Environment Validation (`lib/env-validation.ts`)

Validates environment configuration and enforces domain-aware settings.

**Key Functions:**
- `validateEnvironment()` - Main validation logic
- `getEnvironmentConfig()` - Load environment variables
- `logValidationResults()` - Display validation results

**Validation Rules:**
- ✅ Production safety (no localhost, HTTPS required)
- ✅ Domain compliance (EU GDPR, .org privacy)
- ✅ Payment strategy validation
- ✅ Web3 configuration validation

### 2. Payment Validation (`lib/payment-validation.ts`)

Validates payment configuration and ensures domain-specific compliance.

**Key Functions:**
- `validatePaymentConfig()` - Payment configuration validation
- `supportsPaymentMethod()` - Check specific payment support
- `getPaymentMethodConfig()` - UI-ready payment configuration

**Validation Rules:**
- ✅ Stripe key presence and format validation
- ✅ Domain-specific payment restrictions
- ✅ Crypto payment configuration
- ✅ ILP payment support

### 3. Domain Management (`lib/domains.ts`)

Handles domain configuration and validation.

**Key Functions:**
- `getCurrentDomain()` - Detect current domain
- `getDomainConfig()` - Domain-specific configuration
- `validateOrigin()` - CORS origin validation

### 4. Startup Validation (`lib/startup-validation.ts`)

Orchestrates validation on app startup.

**Key Functions:**
- `initializeEnvironmentValidation()` - Main startup validation
- `getFeatureFlags()` - Feature availability
- `supportsFeature()` - Check specific feature support

## Validation Flow

### 1. App Startup
```typescript
import { initializeEnvironmentValidation } from '@/lib/startup-validation';

// In _app.tsx or layout.tsx
initializeEnvironmentValidation();
```

### 2. Validation Process
1. **Environment Loading** - Load all environment variables
2. **Configuration Validation** - Validate against rules
3. **Payment Validation** - Check payment configuration
4. **Domain Validation** - Validate domain-specific settings
5. **Error Reporting** - Log errors, warnings, and recommendations

### 3. Production Safety
- ❌ **Critical errors** - App exits in production
- ⚠️ **Warnings** - Logged but app continues
- 💡 **Recommendations** - Suggested improvements

## Validation Rules

### Production Safety
```typescript
// ❌ Rejected in production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://secure-knaight.io

// ✅ Required in production
NEXT_PUBLIC_BASE_URL=https://secure-knaight.io
```

### Domain Compliance
```typescript
// ❌ EU domain without compliance
NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.eu
NEXT_PUBLIC_EU_COMPLIANCE=false

// ✅ EU domain with compliance
NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.eu
NEXT_PUBLIC_EU_COMPLIANCE=true
```

### Payment Strategy
```typescript
// ❌ Stripe without key
NEXT_PUBLIC_PAYMENT_STRATEGY=stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

// ✅ Stripe with valid key
NEXT_PUBLIC_PAYMENT_STRATEGY=stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_1234567890

// ❌ Stripe on EU domain
NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.eu
NEXT_PUBLIC_PAYMENT_STRATEGY=stripe

// ✅ Crypto on EU domain
NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.eu
NEXT_PUBLIC_PAYMENT_STRATEGY=crypto
```

## Feature Support Matrix

| Feature | .io | .eu | .org | localhost |
|---------|-----|-----|------|-----------|
| **Web3** | ✅ | ✅ | ❌ | ✅ |
| **Stripe** | ✅ | ❌ | ❌ | ❌ |
| **Crypto** | ✅ | ✅ | ❌ | ✅ |
| **ILP** | ✅ | ✅ | ❌ | ✅ |
| **Analytics** | ✅ | ❌ | ❌ | ❌ |
| **Sentry** | ✅ | ❌ | ❌ | ❌ |
| **Cookies** | ✅ | ❌ | ❌ | ❌ |

## Usage Examples

### Check Feature Support
```typescript
import { supportsFeature } from '@/lib/startup-validation';

if (supportsFeature('web3')) {
  // Initialize Web3
}

if (supportsFeature('payments')) {
  // Enable payment flows
}
```

### Get Payment Configuration
```typescript
import { getPaymentMethodConfig } from '@/lib/payment-validation';

const paymentConfig = getPaymentMethodConfig();

if (paymentConfig.showStripeSection) {
  // Render Stripe payment form
}

if (paymentConfig.showCryptoSection) {
  // Render crypto payment form
}
```

### Validate Payment Methods
```typescript
import { validatePaymentForDomain } from '@/lib/payment-validation';

const canUseStripe = validatePaymentForDomain('secure-knaight.io', 'stripe');
const canUseCrypto = validatePaymentForDomain('secure-knaight.eu', 'crypto');
```

## Error Handling

### Validation Errors
```typescript
// ❌ Critical errors (app exits in production)
- Production environment should not use localhost URLs
- Stripe key is required when payment strategy is "stripe"
- Invalid Stripe key format. Must start with "pk_"

// ⚠️ Warnings (logged but app continues)
- EU domain detected but NEXT_PUBLIC_EU_COMPLIANCE is false
- Web3 should be disabled for docs-only domain
- Using live Stripe key in development environment

// 💡 Recommendations (suggested improvements)
- Set NEXT_PUBLIC_EU_COMPLIANCE=true for .eu domain
- Use NEXT_PUBLIC_PAYMENT_STRATEGY=crypto for .eu domain
- Use test keys (pk_test_...) for development
```

### Error Recovery
```typescript
// 1. Fix environment variables
// 2. Restart development server
// 3. Check validation output
// 4. Address warnings before production
```

## Testing

### Run Validation Tests
```bash
npm run test:validation
```

### Test Specific Scenarios
```bash
# Test production safety
npm run test:production-safety

# Test payment validation
npm run test:payment-validation

# Test domain configuration
npm run test:domain-config
```

### Manual Testing
```typescript
import { validateEnvironment } from '@/lib/env-validation';
import { validatePaymentConfig } from '@/lib/payment-validation';

// Test environment validation
const envResult = validateEnvironment(getEnvironmentConfig());
console.log('Environment validation:', envResult);

// Test payment validation
const paymentResult = validatePaymentConfig();
console.log('Payment validation:', paymentResult);
```

## Configuration Examples

### Development Environment
```bash
# .env.local
NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.io
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_ENABLE_WEB3=true
NEXT_PUBLIC_PAYMENT_STRATEGY=crypto
NEXT_PUBLIC_VALIDATE_ENVIRONMENT=true
```

### Production (.io domain)
```bash
# .env.production
NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.io
NEXT_PUBLIC_BASE_URL=https://secure-knaight.io
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_ENABLE_WEB3=true
NEXT_PUBLIC_PAYMENT_STRATEGY=crypto
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_VALIDATE_ENVIRONMENT=true
```

### EU Compliance (.eu domain)
```bash
# .env.eu
NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.eu
NEXT_PUBLIC_BASE_URL=https://secure-knaight.eu
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_ENABLE_WEB3=true
NEXT_PUBLIC_PAYMENT_STRATEGY=crypto
NEXT_PUBLIC_EU_COMPLIANCE=true
NEXT_PUBLIC_VALIDATE_ENVIRONMENT=true
```

### Documentation (.org domain)
```bash
# .env.org
NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.org
NEXT_PUBLIC_BASE_URL=https://secure-knaight.org
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_ENABLE_WEB3=false
NEXT_PUBLIC_PAYMENT_STRATEGY=none
NEXT_PUBLIC_VALIDATE_ENVIRONMENT=true
```

## Best Practices

### 1. Environment Management
- ✅ Use `.env.example` as template
- ✅ Never commit `.env.local`
- ✅ Validate on startup
- ✅ Use domain-specific configurations

### 2. Payment Configuration
- ✅ Validate Stripe keys before production
- ✅ Use test keys in development
- ✅ Respect domain-specific restrictions
- ✅ Enable crypto payments for privacy domains

### 3. Feature Flags
- ✅ Check feature support before enabling
- ✅ Use `supportsFeature()` instead of direct env checks
- ✅ Respect domain-specific feature restrictions
- ✅ Log feature availability in development

### 4. Error Handling
- ✅ Address critical errors before production
- ✅ Monitor validation warnings
- ✅ Follow recommendations for improvements
- ✅ Test validation in CI/CD pipeline

## Troubleshooting

### Common Issues

1. **Localhost in Production**
   ```
   ❌ Production environment should not use localhost URLs
   💡 Update NEXT_PUBLIC_BASE_URL to your production domain
   ```

2. **Missing Stripe Key**
   ```
   ❌ Stripe key is required when payment strategy is "stripe"
   💡 Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your actual Stripe key
   ```

3. **EU Compliance Mismatch**
   ```
   ⚠️  EU domain detected but NEXT_PUBLIC_EU_COMPLIANCE is false
   💡 Set NEXT_PUBLIC_EU_COMPLIANCE=true for .eu domain
   ```

4. **Invalid Payment Strategy**
   ```
   ❌ Stripe payments are not allowed for EU compliance domain
   💡 Use NEXT_PUBLIC_PAYMENT_STRATEGY=crypto for .eu domain
   ```

### Debug Commands

```bash
# Check environment configuration
npm run validate:env

# Test payment configuration
npm run test:payment

# Validate domain configuration
npm run test:domain

# Run all validation tests
npm run test:validation
```

## Future Enhancements

### Planned Features
- **Real-time validation** - Validate configuration changes
- **Configuration UI** - Visual configuration editor
- **Validation metrics** - Track validation success rates
- **Auto-fix suggestions** - Automatic configuration fixes

### Monitoring
- **Validation health** - Monitor validation system health
- **Configuration drift** - Detect configuration changes
- **Error tracking** - Track validation errors
- **Performance metrics** - Monitor validation performance 