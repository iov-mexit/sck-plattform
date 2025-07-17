# 🌐 SCK Domain Strategy

## Overview

SCK uses a multi-domain strategy to support different use cases and compliance requirements while maintaining a unified brand experience.

## Domain Architecture

### Primary Domains

| Domain | Purpose | Features | Compliance |
|--------|---------|----------|------------|
| `secure-knaight.io` | **Primary Production** | Full platform features, global reach | Standard |
| `secure-knaight.eu` | **EU Compliance** | GDPR-focused, EU data residency | GDPR, EU-specific |
| `secure-knaight.org` | **Open Source** | Documentation, community portal | Open source |

### Legacy Support

| Domain | Status | Redirect Target | Notes |
|--------|--------|----------------|-------|
| `secure-knaight.site` | **Legacy** | `secure-knaight.io` | Deprecated, redirects to primary |

## Implementation Guidelines

### ✅ Correct Usage

```typescript
// ✅ Use centralized domain utilities
import { 
  getBaseUrl, 
  buildApiUrl, 
  getDomainConfig, 
  buildWalletCallbackUrl 
} from '@/lib/domains';

// API calls
const response = await fetch(buildApiUrl('/users'));

// Wallet callbacks
const callbackUrl = buildWalletCallbackUrl('metamask');

// Environment detection
const config = getDomainConfig(hostname);
if (config.isEU) {
  // EU-specific logic
}
```

### ❌ Avoid Hardcoding

```typescript
// ❌ Never hardcode domains
const apiUrl = 'https://secure-knaight.io/api/v1/users';
const callbackUrl = 'http://localhost:3000/api/auth/callback';
const isProd = hostname === 'secure-knaight.io';
```

## Environment Configuration

### Local Development

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_API_VERSION=v1
```

### Production

```bash
# .env.production
NEXT_PUBLIC_BASE_URL=https://secure-knaight.io
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_EU_COMPLIANCE=false
```

### EU-Specific

```bash
# .env.production.eu
NEXT_PUBLIC_BASE_URL=https://secure-knaight.eu
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_EU_COMPLIANCE=true
```

## Domain-Specific Features

### Primary Domain (.io)
- Full platform functionality
- Global analytics and monitoring
- Standard compliance
- All features enabled

### EU Domain (.eu)
- GDPR compliance by default
- EU data residency
- Privacy-first features
- EU-specific legal notices

### Org Domain (.org)
- Documentation and guides
- Community portal
- Open source resources
- Foundation-style branding

## Redirect Strategy

### Automatic Redirects

```typescript
// Legacy domain → Primary
secure-knaight.site → secure-knaight.io

// Org domain → Docs subdomain
secure-knaight.org → docs.secure-knaight.io

// EU domain → Primary (unless EU compliance needed)
secure-knaight.eu → secure-knaight.io
```

### Conditional Redirects

```typescript
// EU domain redirects only if EU compliance not required
if (fromDomain === 'secure-knaight.eu' && !requiresEUCompliance) {
  redirectTo('secure-knaight.io');
}
```

## Security & Validation

### CORS Configuration

```typescript
// Allowed origins per environment
const corsOrigins = getCorsOrigins();
// Development: ['http://localhost:3000', 'http://localhost:3001']
// Production: ['https://secure-knaight.io', 'https://secure-knaight.eu', 'https://secure-knaight.org']
```

### Origin Validation

```typescript
// Validate all incoming requests
if (!validateOrigin(request.headers.get('origin'))) {
  return new Response('Forbidden', { status: 403 });
}
```

## SEO & Metadata

### Canonical URLs

```typescript
// Always use primary domain for canonical
const canonicalUrl = getCanonicalUrl('/dashboard');
// Returns: https://secure-knaight.io/dashboard
```

### Alternate URLs

```typescript
// Provide alternate language/region URLs
const alternates = getAlternateUrls('/dashboard');
// Returns: { 'en': 'https://secure-knaight.io/dashboard', 'en-EU': 'https://secure-knaight.eu/dashboard' }
```

## Theme & Branding

### Domain-Specific Themes

```typescript
const theme = getDomainTheme(hostname);
// Returns: 'default' | 'eu' | 'org'

const themeConfig = getDomainThemeConfig(hostname);
// Returns: { primaryColor, secondaryColor, logo, favicon }
```

### Visual Differentiation

| Domain | Primary Color | Use Case |
|--------|---------------|----------|
| `.io` | Purple (#7c3aed) | Main platform |
| `.eu` | Blue (#2563eb) | EU compliance |
| `.org` | Green (#059669) | Open source |

## Development Workflow

### Local Development

1. **Start with localhost**: `http://localhost:3000`
2. **Use domain utilities**: All URLs through `lib/domains.ts`
3. **Test redirects**: Verify legacy domain handling
4. **Validate CORS**: Test with different origins

### Staging Environment

1. **Use subdomains**: `staging.secure-knaight.io`
2. **Test all domains**: Verify .eu and .org behavior
3. **Validate redirects**: Ensure proper domain routing
4. **Check analytics**: Verify domain-specific tracking

### Production Deployment

1. **Primary domain**: Deploy to `secure-knaight.io`
2. **EU domain**: Deploy to `secure-knaight.eu`
3. **Org domain**: Deploy to `secure-knaight.org`
4. **Legacy redirects**: Configure redirects for `.site`

## Monitoring & Analytics

### Domain-Specific Tracking

```typescript
// Track domain usage
analytics.track('domain_accessed', {
  domain: hostname,
  domainType: getDomainType(hostname),
  isProduction: isProductionDomain(hostname),
});
```

### Error Monitoring

```typescript
// Tag errors with domain context
Sentry.setTag('domain', hostname);
Sentry.setTag('domain_type', getDomainType(hostname));
```

## Compliance & Legal

### GDPR (EU Domain)

- Data residency in EU
- Privacy-first defaults
- Enhanced consent management
- Right to be forgotten

### Standard (Primary Domain)

- Global compliance
- Standard privacy policy
- Standard data handling

### Open Source (Org Domain)

- Community guidelines
- Open source licensing
- Contributor agreements

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check `getCorsOrigins()` configuration
2. **Redirect Loops**: Verify `shouldRedirect()` logic
3. **Analytics Issues**: Ensure domain-specific tracking
4. **Theme Problems**: Check `getDomainTheme()` implementation

### Debug Tools

```typescript
// Enable domain logging in development
logDomainInfo(hostname);
// Logs: { hostname, domainType, config, baseUrl, apiBaseUrl, environment }
```

## Migration Guide

### From Single Domain

1. **Update environment variables**: Use `NEXT_PUBLIC_BASE_URL`
2. **Replace hardcoded URLs**: Use domain utilities
3. **Test all domains**: Verify functionality across domains
4. **Configure redirects**: Set up legacy domain handling

### From Legacy Domain

1. **Implement redirects**: Redirect `.site` to `.io`
2. **Update DNS**: Point legacy domain to new infrastructure
3. **Monitor traffic**: Track redirect success rates
4. **Update references**: Replace all `.site` references

## Best Practices

### ✅ Do

- Use `lib/domains.ts` utilities for all URL construction
- Test on all domains before production deployment
- Implement proper redirects for legacy domains
- Use domain-specific themes and branding
- Monitor domain-specific metrics and errors

### ❌ Don't

- Hardcode any domain names in code
- Assume localhost for development
- Skip domain validation in production
- Mix domain-specific logic without proper abstraction
- Forget to test redirects and CORS

## Configuration Files

### Required Files

- `lib/domains.ts` - Domain utilities
- `.env.local` - Local development
- `.env.production` - Production settings
- `.cursor-config.ts` - IDE rules

### Optional Files

- `.env.production.eu` - EU-specific settings
- `next.config.js` - Next.js domain configuration
- `vercel.json` - Vercel redirects

---

**Remember**: All domain logic must go through `lib/domains.ts`. Never hardcode URLs! 