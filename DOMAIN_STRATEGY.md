# 🌐 SCK Composable Trust Economy - Domain Strategy

## Strategic Vision

SCK is evolving into a **composable trust/agent economy** with clear separation between private trust credentialing and public verification infrastructure.

## Domain Architecture

### Core Platform Domains

| Domain | Purpose | Access Level | Core Function |
|--------|---------|--------------|---------------|
| **Private Trust Engine** | | | |
| `secure-knaight.io` | **SCK Platform (Primary)** | Private/Internal | Role agent creation, external signal processing, organization admin |
| `secure-knaight.eu` | **EU Compliance** | Private/Internal | GDPR-focused SCK platform, EU data residency |
| **Public Trust Infrastructure** | | | |
| `knaight.site` | **ANS Registry + Monetization** | Public/Web3 | Agent Name Service, verification APIs, micropayments, token layer |
| **Supporting Domains** | | | |
| `secure-knaight.org` | **Documentation Hub** | Public | Open source docs, community portal, developer resources |

### Legacy Support

| Domain | Status | Redirect Target | Notes |
|--------|--------|----------------|-------|
| `secure-knaight.site` | **Legacy** | `secure-knaight.io` | Deprecated, redirects to private platform |

## Strategic Partitioning

### 🔒 SCK Platform (Private/Backend-First)

**Domain**: `secure-knaight.io` / `secure-knaight.eu`

**Core Functions:**
- **Role Agent Creation**: Organizations create and manage role agents
- **External Signal Ingestion**: Process trust scores from SCW, ISACA, GitHub, etc.
- **Trust Score Business Logic**: Store and process external trust data
- **Organization Admin Panels**: NFT minting controls, role agent management
- **Internal Dashboards**: Trust analytics, compliance views
- **Backend-Controlled Blockchain**: Organizations handle wallet/gas complexity

**Architecture:**
```
Organization → SCK Platform → External Signals → Trust Processing → NFT Anchoring
```

**Access Pattern:**
- Magic Link authentication
- Traditional web interface
- Organization-controlled
- No direct wallet requirements for end users

### 🌐 ANS Registry + Monetization (Public/Web3)

**Domain**: `knaight.site`

**Core Functions:**
- **Agent Name Service (ANS)**: Public resolvable directory of Role Agents
- **Verification-as-a-Service**: APIs for third parties to validate agent trust/NFT state
- **Micropayments Layer** (Future): Web3-native payment for verification queries
- **Token Layer** (Future): Utility/governance token for access, reputation, staking

**Architecture:**
```
SCK Platform → Auto-Register → ANS Registry → Public Verification APIs → External Consumers
```

**Access Pattern:**
- Public API access
- Web3-native interactions
- Third-party integrations
- Verification and discovery services

### 📚 Developer Hub (Public/Documentation)

**Domain**: `secure-knaight.org`

**Core Functions:**
- **API Documentation**: ANS integration guides, verification API docs
- **Developer Resources**: SDKs, code examples, best practices
- **Community Portal**: Open source contributions, governance discussions
- **Trust Standards**: Documentation of trust signal formats and protocols

## Integration Flow: SCK → ANS Auto-Registration

### Automatic ANS Registration

```typescript
// When role agent is created in SCK Platform
POST /api/v1/role-agents
{
  "organizationId": "org-securecorp",
  "roleTemplateId": "role-security-engineer",
  "assignedToDid": "did:ethr:0x123...",
  "name": "L3 Security Engineer",
  "level": 3,
  "trustScore": 875
}

// SCK Platform automatically triggers ANS registration
1. Create role agent in SCK database
2. Generate ANS identifier: l3-security-engineer.securecorp.knaight
3. Register to ANS at knaight.site
4. Return ANS-enabled role agent to organization
```

### ANS Registration Payload

```typescript
// Auto-sent to knaight.site/api/ans/register
{
  "ansId": "l3-security-engineer.securecorp.knaight",
  "did": "did:ethr:0x123...",
  "role": "Security Engineer",
  "level": 3,
  "qualificationLevel": "Advanced",
  "organization": "SecureCorp",
  "trustLevel": "HIGHLY_TRUSTED",
  "nftContract": "0x741619...",
  "tokenId": "42",
  "verificationEndpoint": "https://secure-knaight.io/api/v1/verify/agent-456",
  "publicMetadata": {
    "role": "Security Engineer",
    "level": 3,
    "qualificationLevel": "Advanced",
    "organization": "SecureCorp",
    "certifications": ["CISSP", "CEH"],
    "trustScore": 875,
    "lastUpdated": "2024-01-15T14:30:00Z"
  }
}
```

## Domain-Specific Implementation

### SCK Platform Implementation

```typescript
// lib/sck-domains.ts
export function getSCKConfig() {
  return {
    platform: getBaseUrl(), // secure-knaight.io
    ansRegistry: 'https://knaight.site',
    autoRegisterANS: true,
    walletRequired: false,
    authMethod: 'magic-link'
  };
}

export function buildANSRegistrationPayload(roleAgent: RoleAgent) {
  return {
    ansId: `${roleAgent.name.toLowerCase().replace(/\s+/g, '-')}.${roleAgent.organization.domain}.knaight`,
    did: roleAgent.assignedToDid,
    level: roleAgent.level,
    qualificationLevel: getQualificationLevel(roleAgent.trustScore, roleAgent.level),
    verificationEndpoint: buildApiUrl(`/verify/${roleAgent.id}`)
  };
}

export function getQualificationLevel(trustScore: number, level: number): string {
  // Map trust score and level to qualification
  if (trustScore >= 900) return 'Expert';
  if (trustScore >= 750) return 'Advanced';
  if (trustScore >= 500) return 'Intermediate'; 
  if (trustScore >= 250) return 'Basic';
  return 'Entry';
}

export function generateRoleAgentName(roleTemplate: string, level: number): string {
  // Generate level-based names for consistent qualification visibility
  return `L${level} ${roleTemplate}`;
  // Examples: "L3 Security Engineer", "L2 Frontend Developer", "L4 DevOps Engineer"
}
```

### ANS Registry Implementation

```typescript
// knaight.site/lib/ans-registry.ts
export function resolveAgent(ansId: string) {
  // l3-security-engineer.securecorp.knaight
  return fetch(`/api/ans/resolve/${ansId}`);
}

export function verifyAgent(ansId: string) {
  // Calls back to SCK platform verification endpoint
  const agent = await resolveAgent(ansId);
  return fetch(agent.verificationEndpoint);
}

export function searchAgents(query: AgentSearchQuery) {
  // Enhanced search with level-based filtering
  return fetch(`/api/ans/search`, { 
    body: JSON.stringify({
      ...query,
      // Level-based search improvements
      level: query.level,                    // Search by specific level (1-5)
      minLevel: query.minLevel,              // Minimum qualification level
      qualificationLevel: query.qualification, // Entry, Basic, Intermediate, Advanced, Expert
      trustScoreMin: query.trustScoreMin,    // NFT-eligible threshold (750+)
      role: query.role                       // Combined with level for precise matching
    })
  });
}

export function discoverByLevel(level: number, role?: string) {
  // Find all agents at specific qualification level
  // Example: discoverByLevel(4, "Security Engineer") → All L4 Security Engineers
  return searchAgents({ 
    level, 
    role,
    sort: 'trustScore',
    order: 'desc' 
  });
}

export function findEligibleAgents(role?: string) {
  // Find all NFT-eligible agents (L4+ with 750+ trust score)
  return searchAgents({ 
    minLevel: 4,
    trustScoreMin: 750,
    role,
    nftEligible: true 
  });
}
```

## Level-Based Role Agent Naming System

### Qualification-First Naming Convention

SCK uses a **level-based naming system** that provides immediate qualification visibility and enhanced searchability:

```typescript
// Level-based naming pattern
"L{level} {role}" 
// Examples:
"L1 Security Engineer"    // Entry level, 0-249 trust score
"L2 Frontend Developer"   // Basic level, 250-499 trust score  
"L3 DevOps Engineer"      // Intermediate level, 500-749 trust score
"L4 Security Architect"   // Advanced level, 750-899 trust score
"L5 Principal Engineer"   // Expert level, 900-1000 trust score
```

### Level-to-Trust Score Mapping

| Level | Qualification | Trust Score Range | NFT Eligible | Typical Experience |
|-------|---------------|-------------------|--------------|-------------------|
| **L1** | Entry | 0-249 | ❌ | 0-2 years, learning fundamentals |
| **L2** | Basic | 250-499 | ❌ | 2-4 years, solid foundation |
| **L3** | Intermediate | 500-749 | ❌ | 4-7 years, proven competency |
| **L4** | Advanced | 750-899 | ✅ | 7-12 years, senior expertise |
| **L5** | Expert | 900-1000 | ✅ | 12+ years, industry leadership |

### ANS Search Benefits

The level-based naming enables powerful search patterns:

```typescript
// Search by qualification level
searchAgents({ qualificationLevel: "Advanced" })        // Returns all L4 agents
searchAgents({ level: 3 })                             // Returns all L3 agents
searchAgents({ role: "Security Engineer", level: 4 })  // L4 Security Engineers

// Search by trust score range
searchAgents({ trustScoreMin: 750 })                   // NFT-eligible agents
searchAgents({ trustScoreMax: 499 })                   // Entry-Basic agents

// Search by ANS identifier patterns
resolveAgent("l4-security-architect.*.knaight")        // All L4 Security Architects
resolveAgent("*.securecorp.knaight")                   // All SecureCorp agents
```

### Automatic Level Assignment

```typescript
export function assignLevel(trustScore: number): number {
  if (trustScore >= 900) return 5;  // Expert
  if (trustScore >= 750) return 4;  // Advanced  
  if (trustScore >= 500) return 3;  // Intermediate
  if (trustScore >= 250) return 2;  // Basic
  return 1;                         // Entry
}

export function canPromoteLevel(currentLevel: number, newTrustScore: number): boolean {
  const suggestedLevel = assignLevel(newTrustScore);
  return suggestedLevel > currentLevel;
}
```

### Organization Benefits

#### **Immediate Qualification Recognition**
- **Hiring Managers**: Instantly see "L4 Security Engineer" vs "Security Engineer"
- **Team Leads**: Understand capability levels at a glance
- **HR Systems**: Easy integration with existing level-based compensation

#### **Enhanced Discovery**
- **Project Staffing**: "Find all L3+ Frontend Developers"
- **Skill Verification**: "Show me Expert-level Security Architects"
- **Team Composition**: "List all agents by level for this project"

#### **Progression Tracking**
- **Career Paths**: Clear progression from L1 → L2 → L3 → L4 → L5
- **Promotion Triggers**: Automatic level suggestions based on trust score increases
- **Performance Reviews**: Objective level assessment tied to trust signals

### Implementation Examples

```typescript
// lib/sck-domains.ts
export function getSCKConfig() {
  return {
    platform: getBaseUrl(), // secure-knaight.io
    ansRegistry: 'https://knaight.site',
    autoRegisterANS: true,
    walletRequired: false,
    authMethod: 'magic-link'
  };
}

export function buildANSRegistrationPayload(roleAgent: RoleAgent) {
  return {
    ansId: `${roleAgent.name.toLowerCase().replace(/\s+/g, '-')}.${roleAgent.organization.domain}.knaight`,
    did: roleAgent.assignedToDid,
    level: roleAgent.level,
    qualificationLevel: getQualificationLevel(roleAgent.trustScore, roleAgent.level),
    verificationEndpoint: buildApiUrl(`/verify/${roleAgent.id}`)
  };
}

export function getQualificationLevel(trustScore: number, level: number): string {
  // Map trust score and level to qualification
  if (trustScore >= 900) return 'Expert';
  if (trustScore >= 750) return 'Advanced';
  if (trustScore >= 500) return 'Intermediate'; 
  if (trustScore >= 250) return 'Basic';
  return 'Entry';
}

export function generateRoleAgentName(roleTemplate: string, level: number): string {
  // Generate level-based names for consistent qualification visibility
  return `L${level} ${roleTemplate}`;
  // Examples: "L3 Security Engineer", "L2 Frontend Developer", "L4 DevOps Engineer"
}
```

---

**🌐 SCK's composable architecture enables a thriving trust economy: private trust credentialing + public verification infrastructure.**

## Implementation Guidelines

### ✅ Correct Cross-Domain Usage

```typescript
// ✅ Use centralized domain utilities
import { 
  getBaseUrl, 
  buildApiUrl, 
  getDomainConfig,
  buildANSRegistrationPayload 
} from '@/lib/domains';

// SCK Platform API calls
const response = await fetch(buildApiUrl('/role-agents'));

// ANS Registry integration
const ansPayload = buildANSRegistrationPayload(roleAgent);
await fetch(`${getDomainConfig().ansRegistry}/api/ans/register`, {
  method: 'POST',
  body: JSON.stringify(ansPayload)
});

// Environment detection
const config = getDomainConfig(hostname);
if (config.isEU) {
  // EU-specific compliance logic
}
if (config.isANSRegistry) {
  // Public ANS registry features
}
```

### ❌ Avoid Hardcoding

```typescript
// ❌ Never hardcode domains in cross-domain integration
const apiUrl = 'https://secure-knaight.io/api/v1/role-agents';
const ansUrl = 'https://knaight.site/api/ans/register';
const isProd = hostname === 'secure-knaight.io';
```

## Environment Configuration

### SCK Platform (Private) - Local Development

```bash
# .env.local - secure-knaight.io development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_ANS_REGISTRY_URL=http://localhost:3001
NEXT_PUBLIC_AUTO_REGISTER_ANS=true
NEXT_PUBLIC_WALLET_REQUIRED=false
```

### SCK Platform (Private) - Production

```bash
# .env.production - secure-knaight.io
NEXT_PUBLIC_BASE_URL=https://secure-knaight.io
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_ANS_REGISTRY_URL=https://knaight.site
NEXT_PUBLIC_AUTO_REGISTER_ANS=true
NEXT_PUBLIC_EU_COMPLIANCE=false
MAGIC_SECRET_KEY=sk_live_...
ETHEREUM_PRIVATE_KEY=0x... # Organization controlled
```

### SCK Platform (Private) - EU Compliance

```bash
# .env.production.eu - secure-knaight.eu
NEXT_PUBLIC_BASE_URL=https://secure-knaight.eu
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_ANS_REGISTRY_URL=https://knaight.site
NEXT_PUBLIC_EU_COMPLIANCE=true
NEXT_PUBLIC_AUTO_REGISTER_ANS=true
```

### ANS Registry (Public) - Production

```bash
# .env.production - knaight.site
NEXT_PUBLIC_BASE_URL=https://knaight.site
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_SCK_PLATFORM_URL=https://secure-knaight.io
NEXT_PUBLIC_WEB3_ENABLED=true
NEXT_PUBLIC_MICROPAYMENTS_ENABLED=true
WALLET_CONNECT_PROJECT_ID=... # Public Web3 interactions
```

## Domain-Specific Features

### SCK Platform (.io) - Private Features
- **Full Platform Functionality**: Role agent creation, signal processing, NFT minting
- **Organization Controls**: Admin panels, backend blockchain operations
- **Traditional Authentication**: Magic Link, no wallet required
- **External Signal Integration**: SCW, ISACA, GitHub APIs
- **ANS Auto-Registration**: Automatic registration to knaight.site

### EU Compliance (.eu) - Enhanced Privacy
- **GDPR Compliance**: Data residency in EU, privacy-first defaults
- **Enhanced Consent Management**: Granular privacy controls
- **Right to be Forgotten**: Complete data deletion capabilities
- **EU-Specific Legal Notices**: GDPR-compliant terms and privacy policy

### ANS Registry (.site) - Public Features
- **Public Agent Directory**: Searchable registry of verified agents
- **Verification APIs**: Third-party trust verification services
- **Rate-Limited Access**: Public API with usage controls
- **Future Web3 Features**: Micropayments, token integration
- **Developer Tools**: SDKs, documentation, integration guides

### Documentation (.org) - Community Hub
- **API Documentation**: Integration guides, code examples
- **Community Portal**: Open source contributions, governance
- **Developer Resources**: SDKs, best practices, standards
- **Foundation Branding**: Non-profit, community-focused design

## Security & Cross-Domain Validation

### CORS Configuration

```typescript
// SCK Platform CORS (secure-knaight.io)
const corsOrigins = [
  'https://knaight.site',              // Allow ANS registry
  'https://secure-knaight.eu',         // EU compliance domain
  'https://secure-knaight.org',        // Documentation
  ...(isDevelopment ? ['http://localhost:3000', 'http://localhost:3001'] : [])
];

// ANS Registry CORS (knaight.site)
const corsOrigins = [
  'https://secure-knaight.io',         // SCK platform callbacks
  'https://secure-knaight.eu',         // EU platform callbacks
  '*'                                  // Public API access (rate-limited)
];
```

### Origin Validation

```typescript
// Validate cross-domain requests
export function validateOrigin(origin: string): boolean {
  const allowedOrigins = getCorsOrigins();
  return allowedOrigins.includes(origin) || 
         (isDevelopment && origin?.includes('localhost'));
}

// API route protection
if (!validateOrigin(request.headers.get('origin'))) {
  return new Response('Forbidden', { status: 403 });
}
```

## Development Workflow

### Local Development Setup

1. **SCK Platform (Primary)**:
   ```bash
   cd /path/to/sck-platform
   cp .env.example .env.local
   # Configure for localhost:3000
   npm run dev
   ```

2. **ANS Registry (Parallel)**:
   ```bash
   cd /path/to/ans-registry
   cp .env.example .env.local
   # Configure for localhost:3001
   npm run dev
   ```

3. **Test Cross-Domain Integration**:
   - Create role agent in SCK Platform
   - Verify auto-registration to ANS Registry
   - Test verification API callbacks

### Staging Environment

1. **Use subdomains**: `staging.secure-knaight.io`, `staging.knaight.site`
2. **Test all domains**: Verify cross-domain communication
3. **Validate redirects**: Ensure proper domain routing
4. **Check ANS flow**: Test auto-registration and verification

### Production Deployment

1. **SCK Platform**: Deploy to `secure-knaight.io` and `secure-knaight.eu`
2. **ANS Registry**: Deploy to `knaight.site`
3. **Documentation**: Deploy to `secure-knaight.org`
4. **Legacy redirects**: Configure redirects for `secure-knaight.site`

## Troubleshooting

### Common Cross-Domain Issues

1. **CORS Errors**:
   ```bash
   ❌ Access to fetch at 'https://knaight.site/api/ans/register' blocked by CORS
   💡 Check getCorsOrigins() configuration in both domains
   ```

2. **ANS Registration Failures**:
   ```bash
   ❌ Failed to auto-register role agent to ANS
   💡 Verify NEXT_PUBLIC_ANS_REGISTRY_URL and network connectivity
   ```

3. **Authentication Mismatch**:
   ```bash
   ❌ Magic Link auth failing on cross-domain requests
   💡 Ensure proper auth headers and domain validation
   ```

4. **Environment Mismatches**:
   ```bash
   ❌ localhost detected in production ANS registry URL
   💡 Update environment variables for production deployment
   ```

### Debug Tools

```typescript
// Enable cross-domain logging in development
export function logDomainInfo(hostname: string) {
  if (isDevelopment) {
    console.log('🌐 Domain Debug Info:', {
      hostname,
      domainType: getDomainType(hostname),
      config: getDomainConfig(hostname),
      baseUrl: getBaseUrl(),
      ansRegistry: getDomainConfig().ansRegistry,
      autoRegisterANS: getDomainConfig().autoRegisterANS
    });
  }
}

// Test ANS integration
export async function testANSIntegration() {
  try {
    const testAgent = {
      id: 'agent-test-123',
      name: 'L4 Security Engineer',
      level: 4,
      trustScore: 825,
      assignedToDid: 'did:ethr:0xtest123...',
      organization: { domain: 'testcorp' },
      roleTemplate: { title: 'Security Engineer' }
    };
    const payload = buildANSRegistrationPayload(testAgent);
    console.log('🔗 Testing ANS registration:', payload);
    console.log('🎯 Expected ANS ID:', 'l4-security-engineer.testcorp.knaight');
    console.log('📊 Qualification Level:', getQualificationLevel(testAgent.trustScore, testAgent.level));
    // Test registration call
  } catch (error) {
    console.error('❌ ANS integration test failed:', error);
  }
}

export function debugLevelAssignment(trustScore: number) {
  const level = assignLevel(trustScore);
  const qualification = getQualificationLevel(trustScore, level);
  console.log(`🎯 Trust Score ${trustScore} → Level ${level} (${qualification})`);
  return { level, qualification };
}
```

## Best Practices

### ✅ Do

- **Use domain utilities** for all cross-domain communication
- **Test ANS integration** thoroughly before production
- **Implement proper error handling** for cross-domain failures
- **Monitor ANS registration success rates** in production
- **Design APIs for third-party integration** from day one
- **Maintain security isolation** between private and public domains

### ❌ Don't

- **Hardcode domain URLs** in cross-domain integration
- **Expose sensitive organization data** through ANS
- **Mix private and public authentication** methods
- **Skip rate limiting** on public ANS APIs
- **Forget to handle ANS registration failures** gracefully
- **Deploy without testing** cross-domain flows

## Configuration Files

### Required Files

- `lib/domains.ts` - Domain utilities and cross-domain integration
- `.env.local` - Local development configuration
- `.env.production` - Production settings for SCK Platform
- `.env.production.eu` - EU compliance settings
- `ans-registry/.env.production` - ANS Registry production settings

### Domain Utility Example

```typescript
// lib/domains.ts
export interface DomainConfig {
  baseUrl: string;
  ansRegistry: string;
  autoRegisterANS: boolean;
  isEU: boolean;
  isANSRegistry: boolean;
  walletRequired: boolean;
  authMethod: 'magic-link' | 'web3';
}

export function getDomainConfig(hostname?: string): DomainConfig {
  const host = hostname || window?.location?.hostname || 'localhost';
  
  if (host.includes('secure-knaight.eu')) {
    return {
      baseUrl: 'https://secure-knaight.eu',
      ansRegistry: 'https://knaight.site',
      autoRegisterANS: true,
      isEU: true,
      isANSRegistry: false,
      walletRequired: false,
      authMethod: 'magic-link'
    };
  }
  
  if (host.includes('knaight.site')) {
    return {
      baseUrl: 'https://knaight.site',
      ansRegistry: 'https://knaight.site',
      autoRegisterANS: false,
      isEU: false,
      isANSRegistry: true,
      walletRequired: true,
      authMethod: 'web3'
    };
  }
  
  // Default: secure-knaight.io
  return {
    baseUrl: getBaseUrl(),
    ansRegistry: 'https://knaight.site',
    autoRegisterANS: true,
    isEU: false,
    isANSRegistry: false,
    walletRequired: false,
    authMethod: 'magic-link'
  };
}
```

---

**Remember**: All cross-domain integration must go through `lib/domains.ts`. Never hardcode URLs! Test ANS auto-registration thoroughly! 