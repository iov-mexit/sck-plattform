# SCK Platform - Privileged Access Management (PAM) & Trust-Gated Management Control Planes (MCPs)

> **Trust-based credentialing platform with external signal funneling architecture**

<!-- CI Test: Yarn 4.0.2 fixes - $(date) -->

## 🎯 **Platform Vision**

Knaight is a **security control-plane for AI and distributed compute**, where only ANS-registered Role Agents with sufficient externally-sourced trust can invoke privileged MCP/control endpoints, with auditable and revocable decisions.

## 🚀 **Latest Update: Vercel Deployment Fixed!**

✅ **Vercel token issue resolved** - Local deployment working perfectly  
✅ **GitHub Actions ready** - All secrets properly configured  
✅ **Build process optimized** - Prisma client generation working  
🕐 **Last deployment test**: $(date) - Fresh commit to trigger workflow  
🔧 **vercel.json fixed**: Removed invalid projectId and orgId properties  
🔄 **Build configuration**: Optimized for monorepo structure with Turbo  
🔧 **Environment variables**: Configured in Vercel dashboard for Magic Link authentication  
🚀 **Fresh deployment**: Triggered to load updated Magic Link environment variables  
🔗 **RPC URL**: Configured for Ethereum Sepolia network  
🌐 **Domain allowlist**: New Vercel deployment URL needs to be added to Magic Link allowlist  
✅ **Domains updated**: Magic Link allowlist configured for new Vercel deployment

# 🛡️ Secure Code KnAIght (SCK) Platform

> **Trust-based credentialing platform for security-focused software development teams, with a vision for global decentralized trust networks.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/sck-platform)

## 🎯 Platform Overview

SCK is a trust-based credentialing platform that empowers organizations to define, assign, and verify security-focused roles.

**At its core:**

- **Role Agents** represent verifiable identities (employees, AI, systems) tied to organizational roles.
- **Signals** enrich agents with externally-provided trust scores, certifications, and compliance data.
- **Anchors (NFTs)** capture immutable snapshots of externally-determined trust via **organization-controlled backend minting**.
- **ANS (Agent Name Service)** ensures interoperability and discoverability.

### Core Value Proposition

> **"Organizations define roles, assign team members as Role Agents, and enrich them with external Signals. Each agent can be Anchored as a blockchain-verified credential through backend APIs, discoverable in the Agent Name Service."**

### Backend-First Architecture

**🎯 Key Principle**: Web3 complexity is abstracted away from end users. Organizations control all blockchain interactions through secure backend APIs.

**Signal Funneling Flow:**
```
External Signal Source → Trust Score/Data → SCK Platform → Role Agent → NFT Anchor
```

- **External Sources**: Provide trust scores, certifications, compliance data
- **SCK Platform**: Receives, stores, and processes externally-provided trust data  
- **Organizations**: Control NFT minting based on external trust signals
- **End Users**: Use traditional web interfaces (no wallet required)

## ✨ Key Features

### 🏆 Trust-Based Credentialing
- **35+ Role Templates**: Security-focused roles across Dev, QA, Security, Design, and Management.
- **Backend NFT Minting**: Organization-controlled credential issuance via secure APIs.
- **External Trust Scores**: Real-time scores from external signal sources (SCW, ISACA, GitHub, etc.).
- **Trust Thresholds**: Enforce role-based minimums (e.g., 750 for eligibility).

### 👥 Role Agents & ANS
- **Role Agents**: DID-based verifiable role identities.
- **Agent Name Service (ANS)**: Decentralized registry for trusted agents.
- **Discoverability**: Agents resolvable via ANS lookup.
- **Lifecycle Management**: Activate, idle, decouple, or transfer externally-provided trust.

### 📡 Signal System (External Trust Funneling)
- **External Signal Sources**: SCW TrustScore API, ISACA certifications, GitHub security analysis.
- **Signal Types**: Trust scores, certifications, audit results, compliance data.
- **Platform Role**: Receive, validate, store, and process external trust data.
- **Real-time Effect**: External signals update role agent trust levels and NFT eligibility.

### 🔗 Blockchain Integration (Organization-Controlled)
- **Backend Minting**: Organizations control all NFT operations via APIs.
- **Smart Contracts**: ERC-721 NFTs with dynamic metadata reflecting external trust data.
- **Soulbound Achievements**: Non-transferable badges.
- **Sepolia Testnet**: Current deployment, mainnet ready.
- **Optional Wallet Support**: Advanced users can access direct blockchain features.

### ✨ Trust Constellation Visualization
- **Interactive Graph**: All role agents visualized as stars in a constellation.
- **Size/Brightness = External Trust Level**.
- **Explorable Links**: Click agents to view signal history, external trust sources, relationships.
- **Real-Time Dashboard**: Organization-wide trust health from external sources.

## 🛠️ Technical Architecture

### System Diagram
```
┌─────────────────────────────────────────────┐
│                 SCK Platform                │
├─────────────────────────────────────────────┤
│ Frontend (Next.js 15 + Tailwind)            │
│  ├── Traditional Web UI (No Wallet Req'd)   │
│  ├── Role Agent Dashboard                   │
│  ├── Organization Admin Panel               │
│  └── Trust Constellation Visualization      │
├─────────────────────────────────────────────┤
│ Backend (Next.js API + Prisma + Zod)        │
│  ├── Role Templates (35+)                   │
│  ├── Role Agents (DIDs, ANS-registered)     │
│  ├── External Signal Processing & Storage   │
│  ├── Organization-Controlled NFT Minting    │
│  └── Blockchain Transaction Management      │
├─────────────────────────────────────────────┤
│ Database (PostgreSQL + Prisma ORM)          │
│  ├── Orgs, Role Agents, External Signals    │
│  └── Blockchain Tx Records                  │
├─────────────────────────────────────────────┤
│ Blockchain (Ethereum Sepolia)               │
│  ├── SCKDynamicNFT.sol                      │
│  ├── Organization-Owned Contracts           │
│  └── Backend-Controlled Minting             │
├─────────────────────────────────────────────┤
│ External Signal Sources                     │
│  ├── SCW TrustScore API                     │
│  ├── ISACA Certification System            │
│  ├── GitHub Security Analysis              │
│  └── Compliance & Audit Systems            │
└─────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend (Traditional Web)
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling with shadcn/ui components
- **Traditional Authentication**: Magic Link (no wallet required)

#### Backend (Blockchain Abstraction)
- **Next.js API Routes**: RESTful API endpoints
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Zod**: Runtime type validation
- **Ethers.js**: Backend blockchain interaction
- **Magic Link**: Passwordless authentication

#### Blockchain (Organization-Controlled)
- **Solidity**: Smart contract development (SCKDynamicNFT.sol)
- **Hardhat**: Development and deployment framework
- **OpenZeppelin**: Secure contract patterns
- **Sepolia Testnet**: Ethereum test network
- **Backend Wallet Management**: Organizations control private keys

## 🚀 Quick Start Guide

### Prerequisites for Organizations
- **Node.js 20+**
- **PostgreSQL**
- **Ethereum Sepolia Testnet Account** (for organization)
- **Magic Link account** for user authentication

### Prerequisites for End Users
- **Email address** (for Magic Link authentication)
- **Web browser** (no wallet required)

### Installation & Setup

```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/sck-platform.git
cd sck-platform

# Install dependencies
npm install

# Setup environment variables
cd apps/web
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Database Setup

```bash
# Start PostgreSQL database
docker-compose up -d

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed with role templates and sample data
npx prisma db seed

# (Optional) Open database browser
npx prisma studio
```

### Smart Contract Setup (Organization Admin)

```bash
# Navigate to contracts
cd packages/contracts/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add organization's PRIVATE_KEY and SEPOLIA_RPC_URL

# Compile contracts
npm run compile

# Deploy to Sepolia testnet
npm run deploy:sepolia
# Copy the deployed contract address to your frontend .env.local
```

### Start Development

```bash
# Return to web app
cd ../../apps/web

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the platform.

## 🔧 Environment Configuration

Create `.env.local` in `apps/web/`:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/sck_database"

# Magic Link Authentication (https://magic.link)
MAGIC_SECRET_KEY="sk_live_..."
MAGIC_PUBLISHABLE_KEY="pk_live_..."

# Blockchain (Organization-Controlled)
NEXT_PUBLIC_SCK_NFT_ADDRESS="0x741619748382c07566BefCC986d8fBbB8EC7168e"
ETHEREUM_PRIVATE_KEY="0xOrganizationPrivateKey"
ETHEREUM_RPC_URL="https://sepolia.infura.io/v3/your-project-id"

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
NODE_ENV="development"
```

## 📁 Project Structure

```
sck-platform/
├── apps/web/              # Next.js frontend + API routes
│   ├── app/
│   │   ├── (authenticated)/           # Protected pages (Magic Link)
│   │   │   ├── dashboard/             # Main dashboard
│   │   │   ├── role-agents/           # Role agent management
│   │   │   ├── role-templates/        # Role template library
│   │   │   ├── nft-minting/           # Organization NFT controls
│   │   │   └── constellation/         # Trust constellation view
│   │   ├── api/v1/                    # Backend APIs
│   │   │   ├── role-agents/           # Role agent CRUD
│   │   │   ├── role-templates/        # Template management
│   │   │   ├── signals/               # Signal processing
│   │   │   └── nft/                   # Organization NFT operations
│   │   └── onboarding/                # Initial setup flow
│   ├── components/                    # Reusable UI components
│   ├── lib/                           # Utilities & services
│   ├── prisma/                        # Database schema & migrations
│   └── generated/                     # Prisma client
├── prisma/                # Database schema & seeds
├── packages/contracts/    # Smart contracts (Organization-deployed)
│   ├── SCKDynamicNFT.sol             # Main NFT contract
│   ├── scripts/deploy-sck-dynamic.js # Deployment script
│   └── test/SCKDynamicNFT.test.js    # Contract tests
```

## 📊 API Overview

### Core API Endpoints

#### Role Management (Backend-Controlled)
- `GET /api/v1/role-templates` → List roles
- `POST /api/v1/role-agents` → Create role agent
- `PUT /api/v1/role-agents/[id]` → Update role agent
- `DELETE /api/v1/role-agents/[id]` → Remove role agent

#### Signal Processing (External Sources Welcome)
- `GET /api/v1/signals` → Retrieve external signals
- `POST /api/v1/signals` → Submit external signal (trust score, certification, etc.)
- `PUT /api/v1/signals/[id]/verify` → Verify external signal

#### NFT Operations (Organization-Controlled)
- `POST /api/v1/nft/mint` → Backend mint NFT credential
- `POST /api/v1/nft/reset` → Reset minting status
- `GET /api/v1/nft/status/[id]` → Check NFT status

#### Organizations (Admin Functions)
- `GET /api/v1/organizations` → List organizations
- `POST /api/v1/organizations` → Create organization

### Example API Usage

```bash
# Create a role agent (no wallet required)
curl -X POST http://localhost:3000/api/v1/role-agents \
  -H "Content-Type: application/json" \
  -d '{
    "organizationId": "org-123",
    "roleTemplateId": "role-security-engineer", 
    "assignedToDid": "did:ethr:0x123...",
    "name": "Security Engineer Agent",
    "trustScore": 0
  }'

# Submit external signal with trust score (external systems provide the score)
curl -X POST http://localhost:3000/api/v1/signals \
  -H "Content-Type: application/json" \
  -d '{
    "roleAgentId": "agent-456",
    "signalType": "EXTERNAL_TRUST_SCORE",
    "source": "SCW_TRUSTSCORE_API",
    "trustScore": 850,
    "metadata": {"provider": "SecureCodeWarrior", "assessment_id": "scw_123"}
  }'

# Submit external certification signal
curl -X POST http://localhost:3000/api/v1/signals \
  -H "Content-Type: application/json" \
  -d '{
    "roleAgentId": "agent-456",
    "signalType": "CERTIFICATION_EARNED",
    "source": "ISACA",
    "trustScore": 95,
    "metadata": {"cert": "CISA", "score": 95, "verified": true}
  }'

# Backend mint NFT credential (organization-controlled, based on external trust data)
curl -X POST http://localhost:3000/api/v1/nft/mint \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer org-api-key" \
  -d '{
    "roleAgentId": "agent-456",
    "recipientAddress": "0x123..."
  }'
```

## 🔗 Smart Contract Integration

### Backend-Controlled Architecture

**Organization Responsibilities:**
- Deploy and own smart contracts
- Manage private keys and gas fees
- Control NFT minting permissions
- Handle blockchain infrastructure

**Platform Responsibilities:**
- Provide clean APIs for external signal ingestion
- Store and process externally-provided trust data
- Manage role agent data and external signal history
- Generate NFT metadata from external trust sources

### Contract Details
- **Contract**: `SCKDynamicNFT.sol`
- **Network**: Sepolia Testnet
- **Deployment**: Organization-controlled
- **Standard**: ERC-721 with dynamic metadata

### Key Features
- **Backend Minting**: Organizations mint via API calls
- **External Trust Processing**: Backend receives and stores external trust signals
- **Achievement System**: Award achievements to eligible agents (≥750 external trust score)
- **Soulbound Support**: Non-transferable achievement tokens
- **Organization Analytics**: Trust metrics aggregated from external sources

### Trust System
```solidity
enum TrustLevel {
    UNVERIFIED,     // 0-249 (from external sources)
    BASIC,          // 250-499 (from external sources)
    TRUSTED,        // 500-749 (from external sources)
    HIGHLY_TRUSTED, // 750-899 (from external sources)
    ELITE           // 900-1000 (from external sources)
}
```

## 🗄️ Database Schema

### Core Tables
- **organizations**: Multi-tenant organization management
- **role_templates**: 35+ predefined security-focused roles
- **role_agents**: Individual role assignments with DID-based identity
- **signals**: External trust signals and certifications from third-party sources
- **certifications**: Verified credentials from external providers
- **blockchain_transactions**: NFT minting records (organization-controlled)

### Key Relationships
- Organizations → Role Agents (1:N)
- Role Templates → Role Agents (1:N)
- Role Agents → Signals (1:N)
- Role Agents → Certifications (1:N)

## 🌍 Strategic Vision

SCK extends beyond software teams:

- **Governments & eIDAS**: EU wallet integration for trusted credentials.
- **AI Registries**: Portable AI agent trust anchors.
- **Supply Chains**: Vendor trust and compliance verification.
- **Compliance**: GDPR, SOC2, ISO-ready automation.

The **Agent Name Service (ANS)** is the backbone for global interoperability: every Role Agent registered, resolvable, and policy-compliant.

**Backend-first approach enables**:
- Organizations maintain control and compliance
- Users get seamless experiences without Web3 complexity
- Platform scales without wallet connectivity issues

## 🛠️ Roadmap

### Phase 1 (MVP – Now)
**Goal**: Functional trust-based credentialing platform

#### ✅ Completed
- Role templates
- Role agents
- External trust signal processing
- Backend NFT minting
- Organization dashboards

#### 🔧 Current Tasks
- [ ] **Enhanced External Signal Integration**: More external signal sources
- [ ] **Signal Validation APIs**: Verify external signal authenticity  
- [ ] **Organization Admin Tools**: Advanced external signal monitoring

### Phase 2 (Q2 2024)
**Goal**: Enhanced visualization and registry integration

#### Core Features
- [ ] **Trust Constellation Visualization**: Interactive graph of role agents as stars
- [ ] **ANS Registry Integration**: Decentralized agent name service
- [ ] **External Signal APIs**: GitHub, SCW API, ISACA integration
- [ ] **Advanced Organization Controls**: Fine-grained external signal management

### Phase 3 (Q3 2024)
**Goal**: Compliance automation and advanced analytics

#### Enterprise Features
- [ ] **Compliance Automation**: SOC2, GDPR, ISO automation
- [ ] **External Signal Marketplace**: Third-party trust data providers
- [ ] **Multi-chain Support**: Cross-chain NFT anchoring
- [ ] **Signal Analytics**: Trends and insights from external trust data

### Phase 4 (Q4 2024)
**Goal**: Global interoperability and market leadership

#### Advanced Capabilities
- [ ] **Global Interoperability**: EU Wallet, AI registries, marketplaces
- [ ] **White-label SaaS Offering**: Platform-as-a-Service for signal processing
- [ ] **Partner Ecosystem**: Enterprise signal source integrations
- [ ] **Optional Direct Wallet Support**: Advanced user features

## 👥 Developer Onboarding

### Quick Start for New Developers

1. **Day 1**: Setup env, create role agents via web interface.
2. **Day 2–3**: Explore DB + API with Prisma Studio, understand external signal flow.
3. **Day 4–5**: Test external signal APIs and backend NFT minting.
4. **Week 2+**: Build features from roadmap (external signal sources, ANS, visualization).

### Development Resources
- **Codebase Search**: Use semantic search for "role agent", "external signals", "signal funneling"
- **Database Browser**: `npx prisma studio` to explore external signal data
- **API Testing**: Use provided curl examples for external signal submission
- **Smart Contract Testing**: Full test suite in `packages/contracts/backend/test/`

### Development Commands

```bash
# Frontend Development (Traditional Web)
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database Operations  
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Run database migrations
npx prisma db seed      # Seed with role templates
npx prisma studio       # Open database browser

# Smart Contract Development (Organization-Controlled)
cd packages/contracts/backend
npm run compile         # Compile contracts
npm run test           # Run contract tests
npm run deploy:sepolia  # Deploy to Sepolia testnet
```

## 🚀 Deployment Guide

### For Organizations

#### Backend Infrastructure
1. Deploy Next.js application to Vercel/AWS
2. Setup PostgreSQL database
3. Configure environment variables
4. Deploy smart contracts to desired network

#### User Access
- Users access via traditional web URLs
- No wallet setup required for end users
- Magic Link handles authentication

### Vercel Deployment (Recommended)
1. Fork this repository
2. Connect to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Smart Contract Deployment (Organization Admin)
```bash
cd packages/contracts/backend

# Configure environment (organization credentials)
cp .env.example .env
# Add organization's PRIVATE_KEY and RPC_URL

# Deploy to Sepolia
npm run deploy:sepolia

# Update backend environment with contract address
# NEXT_PUBLIC_SCK_NFT_ADDRESS
```

## 🔒 Security Features

### Data Protection
- ✅ **Minimal Personal Data**: Only essential information stored
- ✅ **DID-Based Identity**: Privacy-preserving role assignment
- ✅ **Organization-Controlled Keys**: Backend key management
- ✅ **External Signal Validation**: Verify authenticity of trust data sources

### Authentication & Authorization
- ✅ **Magic Link**: Secure passwordless authentication (no wallet required)
- ✅ **Multi-Tenant**: Organization-isolated data
- ✅ **API Protection**: Organization-controlled access
- ✅ **Signal Source Authentication**: Secure external signal ingestion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Follow development guidelines in `.cursorrules`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain backend-first architecture
- Keep Web3 complexity in backend layer
- Design for external signal processing
- Focus on signal funneling, not trust calculation
- Write comprehensive tests
- Update this README for major changes

## 📄 License

MIT License.

## 🙏 Acknowledgments

- **Next.js Team**: Amazing React framework
- **Vercel**: Seamless deployment platform
- **Prisma**: Type-safe database toolkit
- **Magic**: Passwordless authentication
- **Ethereum**: Decentralized blockchain platform
- **OpenZeppelin**: Secure smart contract patterns

---

**🛡️ Built for trust, security, and transparency in modern software development teams.**

**External signal funneling architecture ensures reliable trust data from verified sources.**

For questions or support, please open an issue or contact the development team.
 
## 🔐 Privileged Access Management (PAM) via Trust‑Gated MCP

### Problem Context
- MCPs (model/control planes) and agent control endpoints are high‑impact targets. Breaches cascade into supply‑chain failures.
- Unregistered or low‑trust agents (ghost identities) often retain excessive privileges.

### SCK/Knaight Answer
- **ANS (Agent Name Service)**: DNS‑like registry; no “dark” agents. Role Agents are globally addressable.
- **External Signals → Trust Levels (L1–L5)**: Trust is sourced from external systems (SCW, ISACA, GitHub, compliance) and mapped to levels.
- **Trust‑Gated MCP Gateway**: Only ANS‑registered agents with sufficient trust can invoke privileged endpoints; all decisions are audited.

### Level → Privilege Mapping (baseline)
- L1: Read‑only, sandbox
- L2: Staging R/W, no secrets
- L3: Staging admin, limited prod read
- L4: Prod change ops (guarded), key rotations (scoped)
- L5: Full prod SRE/break‑glass (dual‑control)

### MVP Scope (Demo‑oriented)
- Auto‑register Role Agent → ANS
- Ingest external trust signal(s) → compute level
- Call MCP via trust‑gated proxy; block if not registered/insufficient trust, allow otherwise
- Log every allow/deny with reason and trust snapshot

### New APIs (to add)
- POST `/api/v1/mcp/gateway`: trust‑gated proxy
  - Body: `{ agentId, endpoint, method, payload?, headers? }`
  - Enforces: ANS registered, trust ≥ threshold, endpoint allowed
  - Returns: proxied response or `401/403` with reason
- GET `/api/v1/agents/{id}/trust`: trust and ANS summary for UX/policy

### Policy Storage
- Reuse `role_trust_thresholds` for L1–L5 baselines
- Add `mcp_policies` (role_template_id, environment, min_trust_level, allowed_endpoints[], constraints JSON)

### Security by Design (MVP checks)
- Admin UI protected via Magic Link (no wallet requirement)
- Server‑to‑server HMAC signing to upstream MCP (`X-Knaight-Agent`, timestamp, HMAC)
- Strict CORS/origin validation (see `apps/web/lib/domains.ts`)
- Short‑lived tokens; immediate revocation on trust drop/ANS change
- Comprehensive auditing in `audit_logs`

### Step‑by‑Step Implementation Plan
1) Backend
   - Implement `/api/v1/mcp/gateway` and `/api/v1/agents/[id]/trust`
   - Add `mcp_policies` model + seed a baseline policy per role
   - Wire trust checks to existing `signals` and `role_trust_thresholds`
2) Frontend
   - Dashboard card: “MCP Gateway Demo” with allow/deny visualization
   - Services hub tile: “Trust‑Gated MCP Proxy”
3) Testing
   - Unit: policy evaluation, trust level assignment, HMAC signer
   - Integration: deny before trust, allow after trust ≥ threshold
   - Security: CORS/origin tests, replay protection (timestamp drift)
4) Operations
   - `.env.local`: `MCP_GATEWAY_SIGNING_SECRET`, `ALLOWED_MCP_DOMAINS`
   - Docs: runbook + threat model checklist

### Branching & Workspace
- Continue in this repository. Create feature branch `feat/pam-mcp-gateway`.
- Add detailed spec in `docs/STRATEGY_PAM_MCP.md` (plan, policies, test matrix).
- Keep “no mock data” rule: all trust sourced from external signals or DB.