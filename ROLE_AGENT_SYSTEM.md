# 🎯 SCK Role Agent System

## Overview

The SCK Role Agent System is a comprehensive platform that allows SaaS clients to define their organizational structure using security-aware role templates, assign humans to those roles, and create role agents that collect signals and certifications to mint soulbound NFTs.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Role Agent System                     │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │ Organization│  │ Role        │  │ Role Agent      │ │
│  │   Setup     │  │ Templates   │  │  Management     │ │
│  │             │  │             │  │                 │ │
│  │ • Company   │  │ • Security  │  │ • DID Assignment│ │
│  │ • Domain    │  │ • Frontend  │  │ • Trust Scores  │ │
│  │ • Members   │  │ • Backend   │  │ • NFT Minting   │ │
│  │             │  │ • QA/Test   │  │ • Signals       │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Core Components

- **Organizations**: SaaS client companies with their domain and team structure
- **Role Templates**: Pre-defined security-focused roles (35+ available)
- **Role Agents**: Individual role assignments with blockchain integration
- **Trust Scores**: Real-time credibility validation system
- **NFT Credentials**: Blockchain-verified role certificates

## Getting Started

### Prerequisites

1. **Database**: PostgreSQL with Prisma ORM
2. **Blockchain**: Ethereum Sepolia testnet access
3. **Environment**: Node.js 20+ with Next.js 15

### Quick Setup

1. Clone and install dependencies
2. Start PostgreSQL database: `docker-compose up -d`
3. Setup environment variables in `.env.local`
4. Initialize database: `npx prisma migrate dev`
5. Seed with sample data: `npx prisma db seed`
6. Start development: `npm run dev`

Visit `http://localhost:3000/dashboard` to see the role agent system in action.

## API Reference

### Organizations

```bash
# Create organization
POST /api/v1/organizations
{
  "name": "SecureCodeCorp",
  "domain": "securecodecorp.com",
  "description": "Cybersecurity consulting firm"
}

# Get organizations
GET /api/v1/organizations
```

### Role Templates

```bash
# Get all role templates
GET /api/v1/role-templates

# Get templates by category
GET /api/v1/role-templates?category=Developer

# Create custom template
POST /api/v1/role-templates
{
  "title": "Senior Security Engineer",
  "category": "Security",
  "focus": "Advanced security architecture",
  "responsibilities": [...],
  "securityContributions": [...]
}
```

### Role Agents

```bash
# Create role agent
POST /api/v1/role-agents
{
  "organizationId": "org-123",
  "roleTemplateId": "role-security-engineer",
  "assignedToDid": "did:ethr:0x...",
  "name": "Security Engineer Agent",
  "trustScore": 850
}

# Get role agents for organization
GET /api/v1/role-agents?organizationId=org-123

# Update role agent
PUT /api/v1/role-agents/agent-123
{
  "trustScore": 920,
  "isEligibleForMint": true
}
```

### NFT Credentials

```bash
# Mint NFT credential
POST /api/v1/nft/mint
{
  "roleAgentId": "agent-123",
  "contractAddress": "0x...",
  "recipientAddress": "0x..."
}

# Reset minting status
POST /api/v1/nft/reset
```

## Key Features

1. **Trust-Based System**: Real-time credibility scoring
2. **Blockchain Integration**: NFT credentials on Sepolia testnet
3. **API Endpoints**: RESTful APIs for organizations, role templates, role agents
4. **Frontend Dashboard**: Complete UI for role agent management
5. **Seed Data**: Sample organization with role agents and signals

## Database Schema

### Core Tables

```sql
-- Organizations
organizations (
  id, name, domain, isActive, onboardingComplete, 
  createdAt, updatedAt
)

-- Role Templates (35+ predefined)
role_templates (
  id, title, focus, category, selectable,
  responsibilities, securityContributions,
  organizationId, createdAt, updatedAt
)

-- Role Agents
role_agents (
  id, name, description, assignedToDid,
  trustScore, isEligibleForMint, status, level,
  organizationId, roleTemplateId,
  soulboundTokenId, blockchainAddress, blockchainNetwork,
  createdAt, updatedAt
)

-- Trust Signals
signals (
  id, type, title, description, value, source, url,
  verified, roleAgentId, createdAt, updatedAt
)

-- Certifications
certifications (
  id, type, name, issuer, issuedAt, expiresAt,
  credentialUrl, verified, roleAgentId,
  createdAt, updatedAt
)

-- Blockchain Transactions
blockchain_transactions (
  id, transactionHash, blockNumber, gasUsed, gasPrice,
  network, status, roleAgentId, createdAt, updatedAt
)
```

## File Structure

```
apps/web/
├── app/
│   ├── (authenticated)/
│   │   ├── dashboard/              # Main dashboard
│   │   ├── role-agents/            # Role agent management
│   │   ├── role-templates/         # Template library
│   │   ├── nft-minting/           # NFT credential minting
│   │   └── settings/              # Organization settings
│   ├── api/v1/
│   │   ├── role-agents/           # Role agent CRUD
│   │   ├── role-templates/        # Template management
│   │   ├── organizations/         # Organization management
│   │   └── nft/                   # NFT operations
│   └── onboarding/                # Initial setup flow
├── components/                    # UI components
├── lib/                          # Utilities and services
├── prisma/                       # Database schema
└── ROLE_AGENT_SYSTEM.md          # This documentation
```

## Future Enhancements

### Phase 1: Enhanced Trust Scoring
1. **External Verification**: GitHub, LinkedIn integration
2. **Machine Learning**: Advanced trust algorithms
3. **Role Agent Creation**: Automatically create role agents for each assignment

### Phase 2: Advanced Features
1. **Multi-Chain Support**: Deploy to multiple blockchains
2. **DAO Integration**: Governance for role template approval
3. **Mobile App**: React Native application

### Phase 3: Enterprise Features
1. **Career Growth**: Level up role agents through signal collection
2. **Advanced Analytics**: Comprehensive reporting dashboard
3. **Third-Party Integrations**: Slack, Teams, Jira

## Current Status

✅ **Completed Features**:
- Trust-based role credentialing system
- 35+ security-focused role templates
- Role agent management with trust scoring
- NFT credential minting on Sepolia testnet
- Magic Link authentication
- Organization multi-tenancy
- Complete API infrastructure
- Real-time dashboard

🚧 **In Progress**:
- Advanced trust score algorithms
- Enhanced analytics and reporting
- Mobile application support

🎯 **Roadmap**:
- Mainnet deployment
- Cross-chain credential verification
- Advanced compliance features

---

**Next Steps**: The system is ready for MVP deployment. Focus on blockchain integration and signal collection to complete the role agent lifecycle. 