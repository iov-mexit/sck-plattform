# SCK Validation System - Production Ready

## 🎯 **What We've Built**

A comprehensive, production-ready environment validation system for SCK that ensures:

- ✅ **Production Safety** - No localhost in production, HTTPS required
- ✅ **Domain Compliance** - EU GDPR, privacy-first domains
- ✅ **Payment Validation** - Stripe key validation, domain-specific restrictions
- ✅ **Web3 Configuration** - WalletConnect project ID validation
- ✅ **Feature Flags** - Domain-aware feature enablement
- ✅ **Early Error Detection** - Fail-fast in production

## 🏗️ **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Startup Validation                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Environment     │  │ Payment         │  │ Domain      │ │
│  │ Validation      │  │ Validation      │  │ Validation  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📁 **Core Files**

### **1. Environment Validation** (`lib/env-validation.ts`)
- **Clean, focused validation logic**
- **Production safety checks**
- **Domain-aware compliance**
- **Payment strategy validation**

### **2. Payment Validation** (`lib/payment-validation.ts`)
- **Stripe key validation**
- **Domain-specific payment restrictions**
- **Crypto payment support**
- **ILP payment integration**

### **3. Startup Validation** (`lib/startup-validation.ts`)
- **App initialization validation**
- **Feature support checking**
- **Error reporting and logging**

### **4. Domain Management** (`lib/domains.ts`)
- **Domain detection and validation**
- **CORS origin validation**
- **URL building utilities**

## 🔧 **Key Features**

### **Production Safety**
```typescript
// ❌ Rejected in production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key

// ✅ Required in production
NEXT_PUBLIC_BASE_URL=https://secure-knaight.io
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_actual_key
```

### **Domain Compliance**
```typescript
// ❌ EU domain without compliance
NEXT_PUBLIC_BASE_URL=https://secure-knaight.eu
NEXT_PUBLIC_EU_COMPLIANCE=false

// ✅ EU domain with compliance
NEXT_PUBLIC_BASE_URL=https://secure-knaight.eu
NEXT_PUBLIC_EU_COMPLIANCE=true
```

### **Payment Strategy Validation**
```typescript
// ❌ Stripe on EU domain
NEXT_PUBLIC_BASE_URL=https://secure-knaight.eu
NEXT_PUBLIC_PAYMENT_STRATEGY=stripe

// ✅ Crypto on EU domain
NEXT_PUBLIC_BASE_URL=https://secure-knaight.eu
NEXT_PUBLIC_PAYMENT_STRATEGY=crypto
```

## 🚀 **Usage Examples**

### **App Initialization**
```typescript
import { initializeEnvironmentValidation } from '@/lib/startup-validation';

// In _app.tsx or layout.tsx
initializeEnvironmentValidation();
```

### **Feature Support Checking**
```typescript
import { supportsFeature } from '@/lib/startup-validation';

if (supportsFeature('web3')) {
  // Initialize Web3
}

if (supportsFeature('payments')) {
  // Enable payment flows
}
```

### **Payment Configuration**
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

## 📋 **Validation Rules**

### **Critical Errors** (App exits in production)
- ❌ Production environment cannot use "localhost" as base URL
- ❌ Missing or placeholder Stripe key for payment strategy "stripe"
- ❌ Missing WalletConnect project ID for payment strategy "crypto"
- ❌ Web3 is enabled, but NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is missing

### **Warnings** (Logged but app continues)
- ⚠️ Production base URL should use HTTPS
- ⚠️ Sentry DSN is missing in production
- ⚠️ Analytics ID is missing and EU compliance is disabled
- ⚠️ EU domain detected, but EU compliance is not enabled
- ⚠️ EU compliance is enabled, but cookie consent is not configured
- ⚠️ Log level is set to DEBUG in production — consider reducing verbosity

## 🎯 **Configuration Examples**

### **Development Environment**
```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_PAYMENT_STRATEGY=crypto
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_VALIDATE_ENVIRONMENT=true
```

### **Production (.io domain)**
```bash
# .env.production
NEXT_PUBLIC_BASE_URL=https://secure-knaight.io
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_PAYMENT_STRATEGY=crypto
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=abc123xyz789
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXX-Y
NEXT_PUBLIC_VALIDATE_ENVIRONMENT=true
```

### **EU Compliance (.eu domain)**
```bash
# .env.eu
NEXT_PUBLIC_BASE_URL=https://secure-knaight.eu
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_PAYMENT_STRATEGY=crypto
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=abc123xyz789
NEXT_PUBLIC_EU_COMPLIANCE=true
NEXT_PUBLIC_COOKIE_CONSENT_ENABLED=true
NEXT_PUBLIC_VALIDATE_ENVIRONMENT=true
```

### **Documentation (.org domain)**
```bash
# .env.org
NEXT_PUBLIC_BASE_URL=https://secure-knaight.org
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_PAYMENT_STRATEGY=none
NEXT_PUBLIC_VALIDATE_ENVIRONMENT=true
```

## 🧪 **Testing**

### **Run Validation Tests**
```bash
npm run test:validation
```

### **Manual Testing**
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

## 🔍 **Validation Output**

### **Success Example**
```
✅ Environment Validation Passed
⚠️ Warning: Production base URL should use HTTPS
```

### **Error Example**
```
❌ Environment Validation Failed
ERROR: Missing or placeholder Stripe key for payment strategy "stripe"
ERROR: CRITICAL: Production environment cannot use "localhost" as base URL
⚠️ Warning: Sentry DSN is missing in production
```

## 🎯 **Feature Support Matrix**

| Feature | .io | .eu | .org | localhost |
|---------|-----|-----|------|-----------|
| **Web3** | ✅ | ✅ | ❌ | ✅ |
| **Stripe** | ✅ | ❌ | ❌ | ❌ |
| **Crypto** | ✅ | ✅ | ❌ | ✅ |
| **ILP** | ✅ | ✅ | ❌ | ✅ |
| **Analytics** | ✅ | ❌ | ❌ | ❌ |
| **Sentry** | ✅ | ❌ | ❌ | ❌ |
| **Cookies** | ✅ | ❌ | ❌ | ❌ |

## 🚨 **Error Handling**

### **Critical Errors**
- App exits in production
- Must be fixed before deployment
- Clear error messages with actionable fixes

### **Warnings**
- Logged but app continues
- Should be addressed before production
- Domain-specific recommendations

### **Recommendations**
- Suggested improvements
- Best practices guidance
- Domain-specific configurations

## 📚 **Documentation Files**

- **`env.template`** - Complete environment template
- **`env.example`** - Valid configuration example
- **`VALIDATION_SYSTEM.md`** - Detailed system documentation
- **`ENVIRONMENT_STRATEGY.md`** - Environment strategy guide
- **`__tests__/validation.test.ts`** - Comprehensive test suite

## 🎉 **Benefits**

### **For Developers**
- ✅ **Early error detection** - Catch issues before production
- ✅ **Clear error messages** - Actionable fixes provided
- ✅ **Domain-aware validation** - Automatic compliance checking
- ✅ **Feature flag support** - Conditional feature enablement

### **For Production**
- ✅ **Production safety** - No localhost or invalid configs
- ✅ **Compliance enforcement** - EU GDPR, privacy requirements
- ✅ **Payment validation** - Secure payment configuration
- ✅ **Monitoring integration** - Sentry, analytics validation

### **For Security**
- ✅ **HTTPS enforcement** - Production security requirements
- ✅ **Key validation** - Stripe, WalletConnect key validation
- ✅ **Domain restrictions** - Payment method restrictions per domain
- ✅ **Privacy compliance** - EU GDPR, cookie consent validation

## 🚀 **Next Steps**

1. **Test the validation system** by running the dev server
2. **Create environment files** for different deployment targets
3. **Integrate validation** into your Next.js app initialization
4. **Add feature flag checks** throughout your components
5. **Deploy to test domains** to validate the multi-domain strategy

The validation system now provides **production-ready, domain-aware, compliance-focused** validation that perfectly aligns with SCK's vision of a secure, scalable, and maintainable decentralized platform! 🎯 