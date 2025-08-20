# 🔍 SCK Platform - Comprehensive System Analysis

## 🏗️ Architecture Overview

SCK is a **trust-based credentialing platform** built as a **composable trust economy** with clear separation between private trust credentialing (SCK Platform) and public verification infrastructure (ANS Registry).

### **Core Architecture Flow:**
```
External Signals → SCK Platform → Role Agents (L1-L5) → NFT Anchoring → ANS Auto-Registration → Public Verification
```

## 📁 File Structure Analysis

### **Root Level Configuration**
```
sck_1/
├── package.json                    # Monorepo root dependencies & scripts
├── turbo.json                      # Turborepo build configuration
├── tsconfig.json                   # TypeScript root configuration
├── docker-compose.yml              # Development environment setup
├── vercel.json                     # Vercel deployment configuration
└── .cursorrules                    # SCK platform development rules & architecture
```

**Purpose**: Monorepo coordination, deployment, and development standards enforcement.

---

## 🎯 **Core Application: `apps/web/`**

### **Frontend Architecture**
```
apps/web/
├── app/                            # Next.js 15 App Router
│   ├── (authenticated)/            # Protected routes with layout
│   │   ├── layout.tsx              # Authenticated layout with navigation
│   │   ├── dashboard/page.tsx      # Organization dashboard with trust metrics
│   │   ├── role-agents/page.tsx    # Role agent management (L1-L5 listing)
│   │   ├── role-templates/page.tsx # Template management for organizations
│   │   ├── constellation/page.tsx  # Trust constellation visualization
│   │   ├── analytics/page.tsx      # Trust analytics and progression tracking
│   │   ├── nft-minting/page.tsx    # NFT credential minting interface
│   │   ├── agent-services/page.tsx # Agent lifecycle management
│   │   └── settings/page.tsx       # Organization configuration
│   ├── api/                        # Backend API routes
│   ├── layout.tsx                  # Root layout with providers
│   ├── page.tsx                    # Landing page
│   ├── onboarding/page.tsx         # Organization setup flow
│   └── globals.css                 # Global styles with Tailwind
```

**Key Frontend Components:**
- **Level-Based Display**: All role agent interfaces show L1-L5 qualification levels
- **Traditional UX**: No wallet requirements for end users
- **Real-Time Updates**: Trust constellation and analytics update with external signals

### **Backend API Architecture**
```
apps/web/app/api/v1/
├── role-agents/                    # Role agent CRUD with level-based naming
│   ├── route.ts                   # GET (list), POST (create with L{level} naming)
│   ├── [id]/route.ts              # GET, PUT, DELETE individual agents
│   ├── migrate/route.ts           # Database migration utilities
│   └── update-terminology/route.ts # Terminology consistency updates
├── role-templates/route.ts        # Role template management
├── organizations/route.ts          # Organization management
├── nft/                           # NFT minting (organization-controlled)
│   └── mint/route.ts              # Backend-controlled NFT minting
├── signals/                       # External signal processing
│   ├── route.ts                   # Signal ingestion from external sources
│   ├── [id]/verify/route.ts       # Signal verification
│   ├── statistics/route.ts        # Signal analytics
│   └── trust-score/route.ts       # Trust score updates from external signals
└── trust/validate/route.ts        # Trust validation services
```

**API Design Principles:**
- **External Signal Funneling**: All trust scores come from external sources (SCW, ISACA, GitHub)
- **Level Assignment**: Trust scores automatically determine L1-L5 levels
- **ANS Auto-Registration**: Every role agent creation triggers ANS registration
- **Organization-Controlled**: Backend handles all Web3 complexity

### **Component Architecture**
```
apps/web/components/
├── auth/                          # Authentication components
│   ├── magic-link-login.tsx       # Passwordless email authentication
│   └── magic-login.tsx            # Magic Link integration
├── dashboard/                     # Dashboard components
│   ├── dashboard-overview.tsx     # Trust metrics overview
│   ├── role-agent-stats.tsx       # Level-based agent statistics
│   └── role-analytics.tsx         # Trust progression analytics
├── onboarding/                    # Organization setup flow
│   ├── welcome-step.tsx           # Introduction to SCK platform
│   ├── organization-setup-step.tsx # Organization configuration
│   ├── role-templates-step.tsx    # Template selection and customization
│   └── digital-twin-creation-step.tsx # Initial role agent creation
├── common/                        # Reusable UI components
│   ├── button.tsx, card.tsx       # Basic UI elements
│   ├── input.tsx, select.tsx      # Form components
│   └── tabs.tsx                   # Navigation components
├── navigation.tsx                 # Main navigation with role-based access
├── trust-dashboard.tsx            # Trust constellation and analytics
├── admin-panel.tsx                # Organization administration
└── nft-minting.tsx                # NFT credential interface
```

**Component Design:**
- **Level-First Display**: All components prioritize L1-L5 qualification visibility
- **External Signal Integration**: Components show signal sources and attribution
- **Traditional Web UX**: No wallet connection UI for end users

---

## 🗄️ **Database Layer: `prisma/`**

### **Database Schema**
```
prisma/
├── schema.prisma                  # Main database schema with role_agents model
├── migrations/                    # Database version control
│   ├── 20250717151444_init/       # Initial schema creation
│   ├── 20250719174221_add_trust_based_credentialing/ # Trust system addition
│   └── 20250724123354_add_onboarding_complete/ # Onboarding flow
├── seed.ts                        # Database seeding with role templates
└── roleTemplates.seed.json        # 35+ security-focused role templates
```

### **Core Database Models**
```sql
-- Role Agents (L1-L5 qualification system)
model role_agents {
  id              String   @id
  name            String   -- Format: "L{level} {role}" (e.g., "L4 Security Engineer")
  level           Int      -- 1-5 based on trust score
  trustScore      Int      -- From external signals only
  assignedToDid   String   @unique -- Decentralized identifier
  organizationId  String   -- Organization ownership
  roleTemplateId  String   -- Role template reference
  isEligibleForMint Boolean -- L4+ with 750+ trust score
  status          String   -- active, idle, transferred
  -- ANS Integration
  ansId           String?  -- ANS identifier: l{level}-{role}.{org}.knaight
  ansRegistered   Boolean  @default(false)
  -- Timestamps
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

-- External Signals (trust data from external sources)
model signals {
  id              String   @id
  roleAgentId     String   -- Link to role agent
  signalType      String   -- SCW_TRUST_SCORE, ISACA_CERT, GITHUB_SECURITY
  source          String   -- External source attribution
  trustScore      Int?     -- Trust score from external signal
  metadata        Json     -- Signal-specific data
  verified        Boolean  @default(false)
  verificationUrl String?  -- External verification endpoint
  createdAt       DateTime @default(now())
}

-- Role Templates (35+ security-focused roles)
model role_templates {
  id                    String @id
  title                 String -- "Security Engineer", "Frontend Developer"
  category              String -- "Security", "Development", "DevOps"
  focus                 String -- Role description
  responsibilities      String[] -- Key responsibilities
  securityContributions Json   -- Security-specific contributions
  selectable            Boolean @default(true)
  organizationId        String
}
```

**Database Design Principles:**
- **Level-Based Naming**: All role agents use L{level} naming convention
- **External Signal Attribution**: Every trust score traces to external source
- **ANS Integration**: Built-in ANS registration tracking
- **Organization Control**: Clear ownership and permission boundaries

---

## ⛓️ **Blockchain Layer: `packages/contracts/backend/`**

### **Smart Contract Architecture**
```
packages/contracts/backend/
├── SCKDynamicNFT.sol              # Main NFT contract for role agents
├── SCKNFT.sol                     # Legacy NFT contract
├── hardhat.config.ts              # Hardhat configuration for deployment
├── scripts/
│   ├── deploy.js                  # Contract deployment script
│   └── deploy-sck-dynamic.js      # Dynamic NFT deployment
├── test/
│   ├── SCKDynamicNFT.test.js      # Contract testing
│   └── SCKNFT.test.js             # Legacy contract tests
└── archive/                       # Archived contracts
    └── SCKNFTDynamic.sol          # Previous implementation
```

### **Smart Contract Features**
```solidity
// SCKDynamicNFT.sol - Main contract
contract SCKDynamicNFT is ERC721, Ownable, AccessControl {
    struct RoleAgent {
        string did;                 // Decentralized identifier
        string role;               // "Security Engineer"
        uint8 level;               // 1-5 qualification level
        string organization;       // Organization name
        uint256 trustScore;        // From external signals
        uint256 createdAt;         // Creation timestamp
        uint256 updatedAt;         // Last update timestamp
    }
    
    // Organization-controlled minting (onlyOwner)
    function mintRoleAgent(
        address to,
        string memory did,
        string memory role,
        uint8 level,
        string memory organization,
        uint256 trustScore
    ) public onlyOwner returns (uint256)
    
    // Dynamic trust score updates from external signals
    function updateTrustScore(uint256 tokenId, uint256 newScore) public onlyOwner
    
    // Achievement system for certifications
    function addAchievement(uint256 tokenId, string memory achievement) public onlyOwner
}
```

**Blockchain Design:**
- **Organization-Controlled**: Only organization admins can mint NFTs
- **Dynamic Updates**: Trust scores update from external signals
- **Level Integration**: NFT metadata includes L1-L5 qualification level
- **Soulbound Features**: Non-transferable tokens for certain achievements

---

## 🔧 **Service Layer: `apps/web/lib/`**

### **Core Services**
```
apps/web/lib/
├── auth/                          # Authentication services
│   ├── auth-context.tsx           # React context for authentication state
│   ├── auth-types.ts              # TypeScript types for authentication
│   └── magic-config.ts            # Magic Link configuration
├── services/                      # Business logic services
│   ├── organization-service.ts    # Organization management
│   └── mock-organization.ts       # Development mock data
├── contracts/                     # Smart contract interaction
│   ├── organizational-nft.ts      # NFT contract wrapper
│   └── sck-nft.ts                 # Legacy contract wrapper
├── integrations/                  # External integrations
│   └── signal-to-nft.ts          # External signal to NFT mapping
├── types/                         # TypeScript definitions
│   ├── role-templates.ts          # Role template types
│   ├── ethereum.d.ts              # Ethereum/Web3 types
│   └── vis-network.d.ts           # Visualization types
├── hooks/                         # React hooks
├── providers/                     # React providers
│   └── query-client-provider.tsx  # React Query setup
├── domains.ts                     # Cross-domain utilities (CRITICAL)
├── database.ts                    # Database interaction layer
├── signal-collection.ts           # External signal processing
├── blockchain-service.ts          # Blockchain interaction service
├── sck-dynamic-nft-service.ts     # Dynamic NFT management
└── utils.ts                       # General utilities
```

### **Critical Service: Domain Management**
```typescript
// lib/domains.ts - Cross-domain integration
export interface DomainConfig {
  baseUrl: string;                 // SCK Platform URL
  ansRegistry: string;             // ANS Registry URL (knaight.site)
  autoRegisterANS: boolean;        // Auto-register to ANS
  isEU: boolean;                   // EU compliance mode
  walletRequired: boolean;         // Wallet requirement for users
  authMethod: 'magic-link' | 'web3'; // Authentication method
}

export function getDomainConfig(hostname?: string): DomainConfig
export function buildANSRegistrationPayload(roleAgent: RoleAgent)
export function generateRoleAgentName(roleTemplate: string, level: number): string
export function assignLevel(trustScore: number): number
export function getQualificationLevel(trustScore: number, level: number): string
```

**Service Layer Principles:**
- **Domain Isolation**: Clear separation between SCK Platform and ANS Registry
- **External Signal Processing**: All trust data comes from external sources
- **Level-Based Logic**: Automatic level assignment based on trust scores
- **ANS Integration**: Automatic registration and verification services

---

## 📊 **Features & Visualizations**

### **Trust Constellation**
```
features/trust-constellation/
├── components/
│   └── trust-constellation.tsx    # Interactive graph visualization
├── trust-dashboard.tsx            # Trust metrics dashboard
├── organization-dashboard.tsx     # Organization-wide trust view
└── admin-panel.tsx                # Administrative controls
```

**Visualization Features:**
- **Level-Based Display**: Agents appear as stars, size = qualification level
- **Real-Time Updates**: Constellation updates with external signal changes
- **Interactive Exploration**: Click agents to view history and progression
- **ANS Integration Status**: Visual indicators for ANS registration

### **Signal Stream Processing**
```
features/signal-stream/
├── components/
│   └── signal-stream.tsx          # Real-time signal display
├── signal-analytics.tsx           # Signal processing analytics
└── signal-collection.tsx          # External signal ingestion
```

**Signal Processing:**
- **External Source Attribution**: Clear display of signal sources
- **Real-Time Processing**: Immediate trust score updates
- **Verification Pipeline**: Signal authenticity validation
- **Level Impact Analysis**: How signals affect L1-L5 progression

---

## 🔄 **Data Flow Architecture**

### **1. External Signal Ingestion**
```
External Source → POST /api/v1/signals → Signal Validation → Trust Score Update → Level Recalculation → ANS Update
```

### **2. Role Agent Creation**
```
Organization → Create Role Agent → Assign Level → Generate ANS ID → Auto-Register to ANS → Return Confirmation
```

### **3. NFT Minting (Organization-Controlled)**
```
Organization Admin → Select L4+ Agent → Backend Minting → Blockchain Transaction → NFT Creation → ANS Metadata Update
```

### **4. Public Verification**
```
Third Party → ANS Query → Agent Resolution → SCK Verification Endpoint → Trust Status Response
```

---

## 🌐 **Cross-Domain Integration**

### **SCK Platform (secure-knaight.io)**
- **Private Role Agent Management**: L1-L5 qualification system
- **External Signal Processing**: Trust data from SCW, ISACA, GitHub
- **Organization Controls**: Backend-controlled NFT minting
- **Traditional Authentication**: Magic Link, no wallet required

### **ANS Registry (knaight.site)**
- **Public Agent Directory**: Searchable L1-L5 qualification database
- **Verification APIs**: Third-party trust verification services
- **Level-Based Search**: Find agents by qualification level
- **Monetization Layer**: Future micropayments and token integration

### **Auto-Registration Flow**
```typescript
// Every role agent creation triggers ANS registration
1. Create role agent with level: "L4 Security Engineer"
2. Generate ANS ID: "l4-security-engineer.securecorp.knaight"
3. Register to ANS with verification endpoint
4. Enable public discovery and verification
```

---

## 🔒 **Security & Compliance**

### **Authentication & Authorization**
- **Magic Link Authentication**: Passwordless email-based login
- **Organization-Based Access**: Clear role-based permissions
- **API Key Management**: Secure external signal source authentication
- **Cross-Domain Validation**: CORS and origin validation

### **Data Privacy**
- **EU Compliance Mode**: GDPR-compliant data handling
- **Selective Public Data**: Only verified metadata exposed via ANS
- **Encryption**: Sensitive data encrypted at rest and in transit
- **Right to be Forgotten**: Complete data deletion capabilities

---

## 🚀 **Development & Deployment**

### **Development Workflow**
```bash
# Local development
npm install                        # Install dependencies
npm run db:push                    # Update database schema
npm run db:seed                    # Seed with role templates
npm run dev                        # Start development server
npm run test                       # Run test suites
```

### **Deployment Architecture**
- **SCK Platform**: Deployed to secure-knaight.io (primary) and secure-knaight.eu (EU)
- **ANS Registry**: Deployed to knaight.site (public)
- **Database**: PostgreSQL with Prisma ORM
- **Blockchain**: Sepolia testnet (development), mainnet (production)
- **CDN**: Vercel for global distribution

---

## 📈 **Current Implementation Status**

### **✅ Implemented Features**
- **Role Agent System**: L1-L5 qualification naming convention
- **External Signal Integration**: Trust score processing from external sources
- **Database Schema**: Complete role_agents and signals models
- **API Architecture**: CRUD operations with level-based logic
- **Authentication**: Magic Link passwordless authentication
- **Smart Contracts**: Organization-controlled NFT minting
- **Trust Constellation**: Interactive visualization

### **🚧 In Development**
- **ANS Auto-Registration**: Automatic registration to knaight.site
- **Level-Based Search**: Enhanced discovery by qualification level
- **Signal Verification**: External source authenticity validation
- **Cross-Domain Integration**: Secure SCK Platform ↔ ANS Registry communication

### **📋 Planned Features**
- **Public ANS Registry**: knaight.site deployment
- **Verification-as-a-Service**: Third-party API access
- **Micropayments Layer**: Web3-native payment for verification queries
- **Token Economy**: Utility/governance token for platform access

---

## 🎯 **Strategic Architecture Impact**

The SCK platform represents a **composable trust economy** with:

1. **Private Trust Engine** (SCK Platform): Organization-controlled role agent creation and external signal processing
2. **Public Verification Infrastructure** (ANS Registry): Global agent discovery and verification services
3. **Level-Based Qualification System**: L1-L5 immediate qualification recognition
4. **External Signal Funneling**: Trust scores from authoritative external sources
5. **Organization-Controlled Blockchain**: Web3 complexity abstracted from end users

This architecture enables **professional trust verification at scale** while maintaining **privacy**, **usability**, and **interoperability** across the global trust economy.

---

**🌐 The file structure reflects SCK's composable trust economy: clear separation between private credentialing and public verification, with level-based qualification as the foundation for professional trust at scale.** 