# SCK System Analysis: Privacy-by-Design Architecture

## Executive Summary

Secure Code KnAIght (SCK) is a trust-based digital twin platform that enables organizations to create, manage, and validate digital identities without storing any Personally Identifiable Information (PII). The system uses blockchain technology, decentralized identifiers (DIDs), and zero-knowledge proofs to maintain privacy while ensuring trust and authenticity.

## Core Principles

### Privacy-by-Design (PbD)
- **Zero PII Storage**: No personal data is ever stored in the system
- **DID-Only Identifiers**: All user references use decentralized identifiers
- **Zero-Knowledge Architecture**: Server cannot access user data
- **Client-Side Encryption**: All sensitive data encrypted before transmission
- **Data Minimization**: Only collect what's absolutely necessary

### Trust-Based Credentialing
- **Trust Score Validation**: External trust scores from verified sources
- **Role-Based Thresholds**: Different trust requirements per role
- **Blockchain Verification**: Immutable trust records on-chain
- **Soulbound Tokens**: Non-transferable NFTs representing credentials

## System Architecture

### 1. Frontend Layer (Next.js 15)
```
apps/web/
├── app/                    # App Router pages
├── components/            # React components
├── lib/                   # Utilities and services
└── features/             # Feature-based organization
```

### 2. API Layer (Next.js API Routes)
```
apps/web/app/api/
├── v1/
│   ├── digital-twins/     # Digital twin management
│   ├── organizations/     # Organization management
│   ├── signals/          # Trust signal processing
│   ├── blockchain/       # Blockchain integration
│   └── trust/            # Trust score validation
```

### 3. Database Layer (PostgreSQL + Prisma)
- **Zero PII Storage**: Only DIDs, hashes, and encrypted data
- **Audit Trails**: Complete audit logging for compliance
- **Data Encryption**: At-rest encryption for all sensitive data

### 4. Blockchain Layer
- **Ethereum/Sepolia**: Smart contracts for trust verification
- **Soulbound NFTs**: Non-transferable credential tokens
- **Zero-Knowledge Proofs**: Privacy-preserving verification

## API Design Specification

### Authentication & Authorization

#### POST `/api/v1/auth/did/verify`
**Purpose**: Verify DID ownership without storing PII
```typescript
interface DIDVerificationRequest {
  did: string;
  challenge: string;
  signature: string;
  publicKey: string;
}

interface DIDVerificationResponse {
  verified: boolean;
  sessionToken: string; // JWT with DID only
  expiresAt: string;
}
```

#### POST `/api/v1/auth/session/refresh`
**Purpose**: Refresh authentication session
```typescript
interface SessionRefreshRequest {
  sessionToken: string;
}

interface SessionRefreshResponse {
  sessionToken: string;
  expiresAt: string;
}
```

### Digital Twin Management

#### POST `/api/v1/digital-twins`
**Purpose**: Create new digital twin (DID-only)
```typescript
interface CreateDigitalTwinRequest {
  organizationId: string;
  roleTemplateId: string;
  assignedToDid: string; // DID only, no PII
  trustScore?: number;
}

interface CreateDigitalTwinResponse {
  id: string;
  assignedToDid: string;
  trustScore: number;
  isEligibleForMint: boolean;
  createdAt: string;
}
```

#### GET `/api/v1/digital-twins/{id}`
**Purpose**: Retrieve digital twin by DID
```typescript
interface DigitalTwinResponse {
  id: string;
  assignedToDid: string;
  trustScore: number;
  roleTemplate: {
    id: string;
    title: string;
    category: string;
  };
  organization: {
    id: string;
    name: string;
    domain: string;
  };
  isEligibleForMint: boolean;
  blockchainAddress?: string;
  soulboundTokenId?: string;
  status: string;
  level: number;
  createdAt: string;
  updatedAt: string;
}
```

#### PUT `/api/v1/digital-twins/{id}/trust-score`
**Purpose**: Update trust score from external source
```typescript
interface UpdateTrustScoreRequest {
  trustScore: number;
  source: string; // External trust provider
  verified: boolean;
}

interface UpdateTrustScoreResponse {
  id: string;
  trustScore: number;
  isEligibleForMint: boolean;
  lastTrustCheck: string;
}
```

### Signal Management

#### POST `/api/v1/signals`
**Purpose**: Add trust signal to digital twin
```typescript
interface CreateSignalRequest {
  digitalTwinId: string;
  type: 'certification' | 'activity' | 'achievement';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  value?: number;
  source: string;
  url?: string;
}

interface CreateSignalResponse {
  id: string;
  type: string;
  title: string;
  verified: boolean;
  createdAt: string;
}
```

#### GET `/api/v1/digital-twins/{id}/signals`
**Purpose**: Get all signals for a digital twin
```typescript
interface SignalListResponse {
  signals: Array<{
    id: string;
    type: string;
    title: string;
    description?: string;
    value?: number;
    source: string;
    url?: string;
    verified: boolean;
    createdAt: string;
  }>;
  total: number;
  page: number;
  limit: number;
}
```

### Organization Management

#### POST `/api/v1/organizations`
**Purpose**: Create new organization
```typescript
interface CreateOrganizationRequest {
  name: string;
  description?: string;
  domain: string;
}

interface CreateOrganizationResponse {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
}
```

#### GET `/api/v1/organizations/{id}/trust-thresholds`
**Purpose**: Get trust thresholds for organization
```typescript
interface TrustThresholdResponse {
  thresholds: Array<{
    id: string;
    roleTitle: string;
    minTrustScore: number;
    isActive: boolean;
  }>;
}
```

#### PUT `/api/v1/organizations/{id}/trust-thresholds`
**Purpose**: Update trust thresholds
```typescript
interface UpdateTrustThresholdRequest {
  thresholds: Array<{
    roleTitle: string;
    minTrustScore: number;
  }>;
}
```

### Blockchain Integration

#### POST `/api/v1/blockchain/mint-nft`
**Purpose**: Mint soulbound NFT for eligible digital twin
```typescript
interface MintNFTRequest {
  digitalTwinId: string;
  network: 'ethereum' | 'sepolia' | 'flare';
}

interface MintNFTResponse {
  transactionHash: string;
  tokenId: string;
  network: string;
  status: 'pending' | 'confirmed' | 'failed';
}
```

#### GET `/api/v1/blockchain/transactions/{hash}`
**Purpose**: Get blockchain transaction status
```typescript
interface BlockchainTransactionResponse {
  transactionHash: string;
  network: string; // "ethereum", "sepolia", "flare"
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
  status: string;
  createdAt: string;
}
```

### Trust Score Validation

#### POST `/api/v1/trust/validate`
**Purpose**: Validate trust score against role requirements
```typescript
interface TrustValidationRequest {
  digitalTwinId: string;
  roleTitle: string;
  trustScore: number;
}

interface TrustValidationResponse {
  isValid: boolean;
  requiredScore: number;
  currentScore: number;
  isEligibleForMint: boolean;
  recommendations?: string[];
}
```

## Database Strategy

### Privacy-by-Design Schema

#### Core Tables (Zero PII)
```sql
-- Organizations (no PII)
CREATE TABLE organizations (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  domain VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Digital Twins (DID-only)
CREATE TABLE digital_twins (
  id VARCHAR PRIMARY KEY,
  assigned_to_did VARCHAR NOT NULL, -- DID only, no PII
  organization_id VARCHAR REFERENCES organizations(id),
  role_template_id VARCHAR REFERENCES role_templates(id),
  trust_score DECIMAL(5,2),
  is_eligible_for_mint BOOLEAN DEFAULT FALSE,
  blockchain_address VARCHAR,
  soulbound_token_id VARCHAR,
  status VARCHAR DEFAULT 'active',
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Signals (encrypted metadata)
CREATE TABLE signals (
  id VARCHAR PRIMARY KEY,
  digital_twin_id VARCHAR REFERENCES digital_twins(id),
  type VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  metadata_encrypted TEXT, -- Encrypted JSON
  value DECIMAL(10,2),
  source VARCHAR NOT NULL,
  url VARCHAR,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Encryption Strategy

#### Client-Side Encryption
```typescript
// All sensitive data encrypted before transmission
interface EncryptedData {
  encrypted: string;
  iv: string;
  algorithm: 'AES-256-GCM';
}

// Server never sees plaintext
const encryptData = (data: any, publicKey: string): EncryptedData => {
  // Client-side encryption implementation
};
```

#### Database Encryption
```sql
-- Encrypted columns use application-level encryption
ALTER TABLE signals 
ADD COLUMN metadata_encrypted TEXT;

-- Indexes on encrypted data use hash values
CREATE INDEX idx_signals_metadata_hash 
ON signals (md5(metadata_encrypted));
```

### Audit Trail
```sql
CREATE TABLE audit_logs (
  id VARCHAR PRIMARY KEY,
  action VARCHAR NOT NULL,
  entity VARCHAR NOT NULL,
  entity_id VARCHAR NOT NULL,
  user_did VARCHAR, -- DID only
  metadata_hash VARCHAR, -- Hash of encrypted metadata
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Storage Strategy

### 1. Primary Database (PostgreSQL)
- **Purpose**: Core application data, relationships, audit trails
- **Encryption**: Application-level encryption for sensitive fields
- **Backup**: Daily encrypted backups with point-in-time recovery
- **Compliance**: GDPR, SOC 2, ISO 27001 ready

### 2. Blockchain Storage
- **Purpose**: Immutable trust records, soulbound NFTs
- **Networks**: Ethereum mainnet, Sepolia testnet, Flare
- **Smart Contracts**: 
  - `SCKNFT.sol`: Soulbound NFT contract
  - `TrustRegistry.sol`: Trust score verification
  - `RoleVerifier.sol`: Role-based validation

### 3. External Trust Providers
- **Purpose**: Trust score validation without data storage
- **APIs**: 
  - GitHub contribution analysis
  - LinkedIn professional verification
  - Certifications validation
  - Code quality metrics

### 4. CDN & Static Assets
- **Purpose**: Frontend assets, documentation
- **Provider**: Vercel Edge Network
- **Caching**: Aggressive caching with privacy headers

## Security Architecture

### 1. Authentication & Authorization
```typescript
// DID-based authentication
interface AuthContext {
  did: string;
  sessionToken: string;
  permissions: string[];
  organizationId?: string;
}

// Zero-knowledge session management
const createSession = (did: string): SessionToken => {
  // JWT with DID only, no PII
  return jwt.sign({ did, type: 'session' }, secret);
};
```

### 2. Data Protection
- **Encryption at Rest**: AES-256 for database
- **Encryption in Transit**: TLS 1.3 for all communications
- **Client-Side Encryption**: Sensitive data encrypted before transmission
- **Zero-Knowledge Proofs**: Privacy-preserving verification

### 3. Access Control
```typescript
// Role-based access control
enum Permission {
  READ_DIGITAL_TWIN = 'read:digital-twin',
  WRITE_DIGITAL_TWIN = 'write:digital-twin',
  MANAGE_ORGANIZATION = 'manage:organization',
  MINT_NFT = 'mint:nft',
  VIEW_AUDIT_LOGS = 'view:audit-logs'
}

// DID-based permissions
const checkPermission = (did: string, permission: Permission): boolean => {
  // Check permissions without storing user data
};
```

### 4. Privacy Controls
- **Data Minimization**: Only collect necessary data
- **Purpose Limitation**: Clear data usage purposes
- **Retention Policies**: Automatic data deletion
- **Right to Deletion**: Complete data removal capability

## Compliance & Governance

### 1. GDPR Compliance
- **Right to Access**: Users can access their DID data
- **Right to Deletion**: Complete data removal
- **Data Portability**: Export capability
- **Consent Management**: Transparent consent tracking

### 2. Privacy Impact Assessment
- **Data Flow Mapping**: Clear data flow documentation
- **Risk Assessment**: Regular privacy risk assessments
- **Mitigation Strategies**: Proactive privacy protection

### 3. Audit & Monitoring
```typescript
// Comprehensive audit logging
interface AuditLog {
  action: string;
  entity: string;
  entityId: string;
  userDid?: string; // DID only
  metadataHash: string; // Hash of encrypted metadata
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}
```

## Performance & Scalability

### 1. Database Optimization
- **Indexing Strategy**: Optimized for DID-based queries
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Minimal query complexity

### 2. Caching Strategy
- **Redis Cache**: Session management, rate limiting
- **CDN Caching**: Static assets, API responses
- **Browser Caching**: Client-side caching with privacy

### 3. Scalability
- **Horizontal Scaling**: Stateless API design
- **Microservices**: Feature-based service decomposition
- **Event-Driven**: Asynchronous processing for blockchain operations

## Monitoring & Observability

### 1. Application Monitoring
- **Error Tracking**: Sentry integration (privacy-compliant)
- **Performance Monitoring**: Response time tracking
- **Health Checks**: Comprehensive health monitoring

### 2. Privacy Monitoring
- **Data Access Logs**: Track all data access
- **Encryption Verification**: Ensure data encryption
- **Audit Trail Validation**: Verify audit log integrity

### 3. Blockchain Monitoring
- **Transaction Tracking**: Monitor blockchain operations
- **Gas Optimization**: Efficient transaction management
- **Network Health**: Multi-chain monitoring (Ethereum, Sepolia, Flare)

## Implementation Roadmap

### Phase 1: Core Infrastructure
1. **Database Setup**: PostgreSQL with privacy schema
2. **API Development**: Core CRUD operations
3. **Authentication**: DID-based auth system
4. **Basic Frontend**: Digital twin management

### Phase 2: Trust Integration
1. **Trust Providers**: External trust score APIs
2. **Signal Processing**: Trust signal management
3. **Validation Logic**: Role-based trust validation
4. **Blockchain Integration**: Smart contract deployment

### Phase 3: Advanced Features
1. **NFT Minting**: Soulbound token creation
2. **Analytics**: Privacy-preserving analytics
3. **Advanced UI**: Trust constellation visualization
4. **Mobile Support**: Progressive web app

### Phase 4: Enterprise Features
1. **Multi-tenant**: Organization management
2. **Advanced Security**: Zero-knowledge proofs
3. **Compliance**: Full GDPR/SOC 2 compliance
4. **Scalability**: Enterprise-grade scaling

## Conclusion

The SCK platform represents a paradigm shift in digital identity management, prioritizing privacy while maintaining trust and authenticity. By using DIDs, zero-knowledge proofs, and blockchain technology, we create a system that protects user privacy while enabling verifiable credentials and trust-based credentialing.

The architecture ensures that:
- **No PII is ever stored** in the system
- **Privacy is built-in** from the ground up
- **Trust is verifiable** through blockchain technology
- **Compliance is automatic** through design choices
- **Scalability is achieved** through modern architecture

This system provides a foundation for the future of privacy-preserving digital identity management. 