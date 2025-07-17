# SCK Zod-Enhanced Validation System

## 🎯 **Overview**

The SCK validation system has been upgraded to use **Zod** for robust, type-safe environment variable parsing and validation. This provides:

- ✅ **Strong type inference** - Automatic TypeScript types from schema
- ✅ **Safer parsing** - Runtime validation with clear error messages
- ✅ **Developer-friendly tooling** - Autocomplete, IDE feedback
- ✅ **Early error detection** - Fail-fast with detailed context

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    Zod Schema                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ URL Validation  │  │ Enum Validation │  │ Transform   │ │
│  │                 │  │                 │  │ Functions   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Environment Config                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Type-safe       │  │ Validated       │  │ Transformed │ │
│  │ Environment     │  │ Values          │  │ Booleans    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Domain          │  │ Payment         │  │ Compliance  │ │
│  │ Validation      │  │ Validation      │  │ Validation  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📋 **Zod Schema Definition**

```typescript
const EnvSchema = z.object({
  // Required fields with validation
  NEXT_PUBLIC_BASE_URL: z.string().url({ message: 'BASE_URL must be a valid URL' }),
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'production']),
  
  // Optional fields with defaults
  NEXT_PUBLIC_PAYMENT_STRATEGY: z.enum(['stripe', 'crypto', 'none']).default('none'),
  NEXT_PUBLIC_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional().default('info'),
  
  // Optional fields with transforms
  NEXT_PUBLIC_EU_COMPLIANCE: z.string().optional().transform(v => v === 'true'),
  NEXT_PUBLIC_COOKIE_CONSENT_ENABLED: z.string().optional().transform(v => v === 'true'),
  NEXT_PUBLIC_DEBUG_MODE: z.string().optional().transform(v => v === 'true'),
  NEXT_PUBLIC_VALIDATE_ENVIRONMENT: z.string().optional().transform(v => v !== 'false'),
  
  // Optional fields without transforms
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
});
```

## 🔧 **Key Features**

### **1. Type-Safe Parsing**
```typescript
// Zod automatically infers types
export type RawEnv = z.infer<typeof EnvSchema>;

// TypeScript knows exactly what types are available
const config: EnvironmentConfig = getEnvironmentConfig();
// config.environment is 'development' | 'production'
// config.paymentStrategy is 'stripe' | 'crypto' | 'none'
```

### **2. Automatic Validation**
```typescript
// Zod validates at parse time
const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  // Detailed error messages with field names
  const formatted = parsed.error.format();
  // NEXT_PUBLIC_BASE_URL: BASE_URL must be a valid URL
  // NEXT_PUBLIC_ENVIRONMENT: Invalid enum value
}
```

### **3. Smart Transforms**
```typescript
// String to boolean transforms
NEXT_PUBLIC_EU_COMPLIANCE: z.string().optional().transform(v => v === 'true'),
NEXT_PUBLIC_DEBUG_MODE: z.string().optional().transform(v => v === 'true'),

// String to enum with defaults
NEXT_PUBLIC_PAYMENT_STRATEGY: z.enum(['stripe', 'crypto', 'none']).default('none'),
NEXT_PUBLIC_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional().default('info'),
```

### **4. URL Validation**
```typescript
// Automatic URL validation
NEXT_PUBLIC_BASE_URL: z.string().url({ message: 'BASE_URL must be a valid URL' }),
NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

// Automatic hostname extraction
primaryDomain: new URL(env.NEXT_PUBLIC_BASE_URL).hostname,
```

## 🚀 **Usage Examples**

### **Basic Usage**
```typescript
import { getEnvironmentConfig, validateEnvironment } from '@/lib/env-validation';

// Parse and validate environment
const config = getEnvironmentConfig();
const result = validateEnvironment(config);

if (!result.isValid) {
  console.error('Validation failed:', result.errors);
}
```

### **Error Handling**
```typescript
try {
  const config = getEnvironmentConfig();
  // Use config...
} catch (error) {
  // Zod parsing errors with detailed messages
  console.error('Environment configuration error:', error.message);
  // ❌ Invalid environment variables:
  // NEXT_PUBLIC_BASE_URL: BASE_URL must be a valid URL
  // NEXT_PUBLIC_ENVIRONMENT: Invalid enum value
}
```

### **Type-Safe Access**
```typescript
const config = getEnvironmentConfig();

// TypeScript knows these are the correct types
if (config.environment === 'production') {
  // config.environment is guaranteed to be 'production'
}

if (config.paymentStrategy === 'stripe') {
  // config.paymentStrategy is guaranteed to be 'stripe'
  // config.stripeKey is string | undefined
}
```

## 📋 **Validation Rules**

### **Zod Schema Validation**
- ✅ **URL validation** - BASE_URL must be valid URL
- ✅ **Enum validation** - Environment must be 'development' | 'production'
- ✅ **Payment strategy** - Must be 'stripe' | 'crypto' | 'none'
- ✅ **Log level** - Must be 'debug' | 'info' | 'warn' | 'error'
- ✅ **Optional fields** - Sentry DSN, analytics ID, etc.

### **Business Logic Validation**
- ✅ **Production safety** - No localhost in production
- ✅ **HTTPS requirement** - Production must use HTTPS
- ✅ **Payment validation** - Stripe key required for Stripe strategy
- ✅ **Web3 validation** - WalletConnect ID required for crypto/Web3
- ✅ **EU compliance** - EU domain requires compliance settings

## 🧪 **Testing**

### **Valid Configurations**
```typescript
// Development
{
  NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_ENVIRONMENT: 'development',
  NEXT_PUBLIC_PAYMENT_STRATEGY: 'crypto',
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: 'test_project_id',
}

// Production
{
  NEXT_PUBLIC_BASE_URL: 'https://secure-knaight.io',
  NEXT_PUBLIC_ENVIRONMENT: 'production',
  NEXT_PUBLIC_PAYMENT_STRATEGY: 'stripe',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_valid_key',
  NEXT_PUBLIC_SENTRY_DSN: 'https://sentry.io/project',
  NEXT_PUBLIC_ANALYTICS_ID: 'UA-XXXXX-Y',
}
```

### **Invalid Configurations**
```typescript
// ❌ Invalid URL
{
  NEXT_PUBLIC_BASE_URL: 'invalid-url',
  NEXT_PUBLIC_ENVIRONMENT: 'development',
}
// Error: BASE_URL must be a valid URL

// ❌ Invalid environment
{
  NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_ENVIRONMENT: 'invalid',
}
// Error: Invalid enum value

// ❌ Invalid payment strategy
{
  NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_ENVIRONMENT: 'development',
  NEXT_PUBLIC_PAYMENT_STRATEGY: 'invalid',
}
// Error: Invalid enum value
```

## 🎯 **Benefits**

### **For Developers**
- ✅ **Type safety** - No more guessing environment variable types
- ✅ **Autocomplete** - IDE knows all available fields and types
- ✅ **Clear errors** - Detailed error messages with field names
- ✅ **Default values** - Automatic defaults for optional fields
- ✅ **Transforms** - Automatic string-to-boolean conversion

### **For Production**
- ✅ **Early validation** - Fail-fast with clear error messages
- ✅ **Type guarantees** - Runtime type safety for all config
- ✅ **URL validation** - Automatic URL format validation
- ✅ **Enum validation** - Guaranteed valid enum values
- ✅ **Transform safety** - Safe boolean transformations

### **For Security**
- ✅ **Input validation** - All environment variables validated
- ✅ **Type safety** - No undefined behavior from invalid types
- ✅ **URL safety** - Validated URLs prevent injection attacks
- ✅ **Enum safety** - Only valid enum values accepted

## 🔍 **Error Examples**

### **Zod Parsing Errors**
```
❌ Invalid environment variables:
NEXT_PUBLIC_BASE_URL: BASE_URL must be a valid URL
NEXT_PUBLIC_ENVIRONMENT: Invalid enum value
NEXT_PUBLIC_PAYMENT_STRATEGY: Invalid enum value
```

### **Business Logic Errors**
```
❌ Environment Validation Failed
ERROR: CRITICAL: Production cannot run with localhost as base URL
ERROR: Stripe is selected but the publishable key is missing or a placeholder
ERROR: Crypto payment strategy selected, but WalletConnect project ID is missing
```

### **Warnings**
```
✅ Environment Validation Passed
⚠️ Warning: Production should use HTTPS base URLs
⚠️ Warning: Sentry DSN missing in production
⚠️ Warning: EU domain detected but EU compliance not enabled
```

## 🚀 **Integration**

### **App Initialization**
```typescript
import { initializeEnvironmentValidation } from '@/lib/startup-validation';

// In _app.tsx or layout.tsx
initializeEnvironmentValidation();
```

### **Feature Checking**
```typescript
import { supportsFeature } from '@/lib/startup-validation';

if (supportsFeature('web3')) {
  // Initialize Web3 with type-safe config
}

if (supportsFeature('payments')) {
  // Enable payment flows
}
```

## 📚 **Migration Guide**

### **From Manual Validation**
```typescript
// Old way
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT as 'development' | 'production';

// New way
const config = getEnvironmentConfig();
// config.baseUrl is guaranteed to be a valid URL
// config.environment is guaranteed to be 'development' | 'production'
```

### **From String Parsing**
```typescript
// Old way
const euCompliance = process.env.NEXT_PUBLIC_EU_COMPLIANCE === 'true';
const debugMode = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

// New way
const config = getEnvironmentConfig();
// config.euCompliance is already boolean
// config.debugMode is already boolean
```

## 🎉 **Summary**

The Zod-enhanced validation system provides:

1. **Type Safety** - Automatic TypeScript types from schema
2. **Runtime Validation** - Clear error messages for invalid configs
3. **Developer Experience** - Autocomplete, IDE feedback, clear errors
4. **Production Safety** - Fail-fast with detailed error context
5. **Maintainability** - Single source of truth for environment schema

This creates a robust, type-safe foundation for the SCK platform that catches configuration errors early and provides clear guidance for developers! 🚀 