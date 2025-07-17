# SCK Environment Strategy

## Overview

The SCK (Secure Code KnAIght) project uses a sophisticated multi-domain environment strategy that balances privacy, compliance, and functionality across different deployment targets.

## Domain Strategy

### Primary Domains

| Domain | Purpose | Features | Compliance |
|--------|---------|----------|------------|
| `secure-knaight.io` | Production platform | Full Web3, payments, analytics | Standard |
| `secure-knaight.eu` | EU compliance | Web3, crypto payments, GDPR strict | EU GDPR |
| `secure-knaight.org` | Documentation | Read-only, no payments, no analytics | Privacy-first |
| `secure-knaight.site` | Legacy redirect | Redirects to .io | Legacy |

### Environment Types

- **Development**: `localhost:3000` with full debugging
- **Production**: HTTPS domains with environment validation
- **Test**: CI/CD environments with mock data

## Environment Configuration

### Core Variables

```bash
# Domain Configuration
NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.io
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development

# Web3 Configuration
NEXT_PUBLIC_ENABLE_WEB3=true
NEXT_PUBLIC_PAYMENT_STRATEGY=crypto

# Compliance
NEXT_PUBLIC_EU_COMPLIANCE=false
NEXT_PUBLIC_VALIDATE_ENVIRONMENT=true
```

### Payment Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| `stripe` | Traditional payments | .io domain only |
| `crypto` | Web3 native payments | .io, .eu domains |
| `none` | No payments | .org domain |

### Privacy Levels

| Level | Analytics | Cookies | Sentry | Payments |
|-------|-----------|---------|--------|----------|
| **Standard** | ✅ | ✅ | ✅ | ✅ |
| **Privacy** | ❌ | ❌ | ❌ | ❌ |
| **EU Strict** | ❌ | ❌ | ❌ | Crypto only |

## Validation System

### Automatic Validation

The system automatically validates environment configuration on startup:

```typescript
import { initializeEnvironmentValidation } from '@/lib/startup-validation';

// In _app.tsx or layout.tsx
initializeEnvironmentValidation();
```

### Validation Rules

1. **Production Safety**
   - No localhost URLs in production
   - HTTPS required for production
   - Valid domain configuration

2. **Domain Compliance**
   - EU domains require GDPR compliance
   - .org domains disable Web3 and payments
   - Legacy domains redirect appropriately

3. **Feature Flags**
   - Analytics disabled for privacy domains
   - Sentry disabled for privacy domains
   - Cookies disabled for EU compliance

### Validation Output

```
✅ Environment configuration is valid
⚠️  Environment Validation Warnings:
  ⚠️  EU domain detected but NEXT_PUBLIC_EU_COMPLIANCE is false
💡 Environment Recommendations:
  💡 Set NEXT_PUBLIC_EU_COMPLIANCE=true for .eu domain
```

## Feature Flags

### Core Features

```typescript
import { getFeatureFlags } from '@/lib/startup-validation';

const flags = getFeatureFlags();

// Check specific features
if (flags.web3) {
  // Enable Web3 functionality
}

if (flags.payments) {
  // Enable payment flows
}

if (flags.privacyMode) {
  // Disable tracking and analytics
}
```

### Domain-Specific Features

| Feature | .io | .eu | .org | localhost |
|---------|-----|-----|------|-----------|
| Web3 | ✅ | ✅ | ❌ | ✅ |
| Payments | ✅ | Crypto | ❌ | ❌ |
| Analytics | ✅ | ❌ | ❌ | ❌ |
| Sentry | ✅ | ❌ | ❌ | ❌ |
| Cookies | ✅ | ❌ | ❌ | ❌ |

## Development Workflow

### Local Development

1. Copy `env.template` to `.env.local`
2. Configure for local development:
   ```bash
   NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.io
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NEXT_PUBLIC_ENVIRONMENT=development
   NEXT_PUBLIC_ENABLE_WEB3=true
   NEXT_PUBLIC_VALIDATE_ENVIRONMENT=true
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

### Production Deployment

1. Set environment variables for target domain:
   ```bash
   # For .io domain
   NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.io
   NEXT_PUBLIC_BASE_URL=https://secure-knaight.io
   NEXT_PUBLIC_ENVIRONMENT=production
   NEXT_PUBLIC_PAYMENT_STRATEGY=crypto
   
   # For .eu domain
   NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.eu
   NEXT_PUBLIC_BASE_URL=https://secure-knaight.eu
   NEXT_PUBLIC_EU_COMPLIANCE=true
   NEXT_PUBLIC_PAYMENT_STRATEGY=crypto
   ```

2. Deploy with validation enabled:
   ```bash
   NEXT_PUBLIC_VALIDATE_ENVIRONMENT=true npm run build
   ```

## Security Considerations

### Privacy-First Design

- **Analytics**: Disabled for .eu and .org domains
- **Cookies**: Disabled for EU compliance
- **Tracking**: Minimal tracking for privacy domains
- **Data**: Local storage only for privacy domains

### Compliance Features

- **GDPR**: Automatic compliance for .eu domain
- **Cookie Consent**: Configurable per domain
- **Data Retention**: Domain-specific policies
- **User Rights**: GDPR-compliant data handling

### Security Validation

- **HTTPS**: Required for production
- **CORS**: Domain-aware origin validation
- **CSP**: Domain-specific content security policies
- **HSTS**: Enabled for production domains

## Monitoring & Debugging

### Environment Warnings

```typescript
import { getEnvironmentWarnings } from '@/lib/startup-validation';

const warnings = getEnvironmentWarnings();
// Returns array of configuration warnings
```

### Client-Side Validation

```typescript
import { validateClientEnvironment } from '@/lib/startup-validation';

// In development, logs detailed environment info
validateClientEnvironment();
```

### Feature Support Checking

```typescript
import { supportsFeature } from '@/lib/startup-validation';

if (supportsFeature('web3')) {
  // Initialize Web3
}

if (supportsFeature('analytics')) {
  // Initialize analytics
}
```

## Troubleshooting

### Common Issues

1. **Localhost in Production**
   ```
   ❌ Production environment should not use localhost URLs
   💡 Update NEXT_PUBLIC_BASE_URL to your production domain
   ```

2. **EU Compliance Mismatch**
   ```
   ⚠️  EU domain detected but NEXT_PUBLIC_EU_COMPLIANCE is false
   💡 Set NEXT_PUBLIC_EU_COMPLIANCE=true for .eu domain
   ```

3. **Web3 on Docs Domain**
   ```
   ⚠️  Web3 should be disabled for docs-only domain
   💡 Set NEXT_PUBLIC_ENABLE_WEB3=false for .org domain
   ```

### Debug Commands

```bash
# Check environment configuration
npm run validate:env

# Test domain configuration
npm run test:domains

# Validate feature flags
npm run test:features
```

## Migration Guide

### From Single Domain to Multi-Domain

1. **Update Environment Variables**
   ```bash
   # Old
   NEXT_PUBLIC_BASE_URL=https://secure-knaight.io
   
   # New
   NEXT_PUBLIC_PRIMARY_DOMAIN=secure-knaight.io
   NEXT_PUBLIC_BASE_URL=https://secure-knaight.io
   ```

2. **Add Domain Validation**
   ```typescript
   import { initializeEnvironmentValidation } from '@/lib/startup-validation';
   
   // Add to app initialization
   initializeEnvironmentValidation();
   ```

3. **Update Feature Checks**
   ```typescript
   // Old
   if (process.env.NODE_ENV === 'production') {
     // Enable analytics
   }
   
   // New
   if (supportsFeature('analytics')) {
     // Enable analytics
   }
   ```

## Best Practices

### Environment Management

1. **Never commit `.env.local`** - Use `.env.example` as template
2. **Validate on startup** - Catch configuration errors early
3. **Domain-aware features** - Check support before enabling features
4. **Privacy by default** - Disable tracking unless explicitly enabled

### Security

1. **HTTPS everywhere** - Production domains must use HTTPS
2. **Domain validation** - Validate all origins and redirects
3. **Feature isolation** - Isolate features by domain requirements
4. **Compliance first** - EU compliance overrides other settings

### Development

1. **Local development** - Use localhost with validation disabled
2. **Feature flags** - Use feature flags instead of environment checks
3. **Validation warnings** - Address warnings before production
4. **Documentation** - Document domain-specific behaviors

## Future Enhancements

### Planned Features

- **Subdomain support** - `app.`, `docs.`, `admin.` subdomains
- **A/B testing** - Domain-specific feature experiments
- **Geographic routing** - Automatic domain selection by location
- **Compliance automation** - Automatic compliance checking

### Monitoring

- **Environment health** - Real-time environment validation
- **Feature usage** - Track feature adoption by domain
- **Compliance reporting** - Automated compliance reports
- **Performance metrics** - Domain-specific performance tracking 