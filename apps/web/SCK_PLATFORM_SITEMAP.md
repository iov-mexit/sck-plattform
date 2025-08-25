# 🗺️ SCK Platform Sitemap

## **🌐 PRODUCTION DOMAIN**
**Main Platform**: https://sck-plattform.vercel.app

---

## **🏠 MAIN NAVIGATION STRUCTURE**

### **1. Landing & Authentication**
- **`/`** - Homepage (Secure Code KnAIght Platform)
- **`/onboarding`** - Organization setup and onboarding flow
- **`/auth/*`** - Magic Link authentication system

### **2. Authenticated Dashboard (`/(authenticated)/`)**
- **`/dashboard`** - Main organization dashboard
- **`/role-agents`** - Role agent management and creation
- **`/role-templates`** - Role template library and management
- **`/loa-management`** - Level of Assurance governance
- **`/nft-minting`** - Blockchain NFT minting interface
- **`/constellation`** - Trust constellation visualization
- **`/analytics`** - Platform analytics and insights
- **`/agent-services`** - Agent service management
- **`/services/*`** - Specialized service interfaces
  - **`/services/mcp`** - Model Context Protocol services
  - **`/services/pam`** - Policy and Access Management
- **`/settings`** - Organization and platform settings

---

## **🔌 API ENDPOINTS STRUCTURE**

### **Core Platform APIs (`/api/v1/`)**

#### **Role Management**
- **`/role-agents`** - CRUD operations for role agents
- **`/role-templates`** - Role template management
- **`/organizations`** - Organization management

#### **Approval & Governance**
- **`/approvals/*`** - Approval request management
  - **`/approvals/[artifactType]/[artifactId]`** - Artifact-specific approvals
- **`/loa/*`** - Level of Assurance management
  - **`/loa/policies`** - LoA policy management
  - **`/loa/reviewer-roles`** - Reviewer role configuration

#### **MCP (Model Context Protocol)**
- **`/mcp/*`** - MCP service management
  - **`/mcp/policies`** - MCP policy configuration

#### **Blockchain & NFT**
- **`/nft/*`** - NFT management
  - **`/nft/mint`** - NFT minting operations
  - **`/nft/reset`** - NFT reset operations
- **`/blockchain-transactions`** - Transaction history

#### **Trust & Signals**
- **`/signals/*`** - External signal processing
  - **`/signals/statistics`** - Signal analytics
  - **`/signals/trust-score`** - Trust score calculation
- **`/trust/*`** - Trust validation and management
  - **`/trust/validate`** - Trust validation endpoints

#### **AI & RAG (Retrieval-Augmented Generation)**
- **`/ai/*`** - AI-powered services
  - **`/ai/policy-draft`** - AI policy drafting
- **`/rag/*`** - RAG system endpoints
  - **`/rag/search`** - Knowledge base search

#### **Knowledge Management**
- **`/knowledge/*`** - Knowledge document management
- **`/twin-import`** - Digital twin import operations

---

## **🛡️ MILESTONE 3: MCP ENFORCEMENT SYSTEM**

### **Policy Bundle Management**
- **`/enforcement/bundles/compile`** - Compile policy bundles
- **`/enforcement/bundles/publish`** - Publish compiled bundles
- **`/enforcement/bundles/activate`** - Activate published bundles
- **`/enforcement/bundles/revoke`** - Revoke active bundles
- **`/enforcement/bundles/active`** - List active bundles (OPA integration)

### **Gateway Token System**
- **`/enforcement/tokens/issue`** - Issue access tokens
- **`/enforcement/tokens/revoke`** - Revoke issued tokens
- **`/enforcement/tokens/introspect`** - Token introspection

### **Security & Verification**
- **`/enforcement/verify`** - HMAC verification for upstream calls
- **`/enforcement/status`** - OPA health and status reporting
- **`/enforcement/logs`** - OPA decision logging

---

## **🔧 ADMINISTRATIVE INTERFACES**

### **Organization Management**
- **Admin Panel** - Centralized organization control
- **User Management** - Role assignment and permissions
- **Audit Logs** - Complete system audit trail

### **Blockchain Operations**
- **Contract Management** - Smart contract deployment and management
- **Transaction Monitoring** - Real-time blockchain transaction tracking
- **Gas Fee Management** - Organization-controlled gas fee handling

---

## **📊 DATA & ANALYTICS**

### **Trust Metrics**
- **Trust Scores** - External signal-based trust calculations
- **Trust History** - Historical trust progression
- **Trust Constellation** - Visual trust network representation

### **Performance Monitoring**
- **API Usage** - Endpoint usage statistics
- **Response Times** - Performance metrics
- **Error Rates** - System health monitoring

---

## **🔐 SECURITY & COMPLIANCE**

### **Authentication & Authorization**
- **Magic Link Auth** - Passwordless authentication
- **Role-Based Access Control (RBAC)** - Granular permission management
- **Multi-Factor Authentication** - Enhanced security layers

### **Data Protection**
- **Encryption** - Data encryption at rest and in transit
- **Audit Trails** - Complete data access logging
- **Compliance** - SOC2, GDPR, ISO framework support

---

## **🌍 INTEGRATION POINTS**

### **External Systems**
- **SCW TrustScore API** - Security training integration
- **ISACA Certifications** - Professional certification validation
- **GitHub Security** - Repository security analysis
- **Compliance Systems** - SOC2, GDPR, ISO automation

### **Blockchain Networks**
- **Ethereum** - Primary blockchain network
- **Polygon** - Layer 2 scaling solution
- **Custom Networks** - Organization-specific deployments

---

## **📱 USER EXPERIENCE FEATURES**

### **Responsive Design**
- **Desktop** - Full-featured web interface
- **Tablet** - Optimized tablet experience
- **Mobile** - Mobile-responsive design

### **Accessibility**
- **Screen Reader Support** - WCAG compliance
- **Keyboard Navigation** - Full keyboard accessibility
- **High Contrast** - Visual accessibility options

---

## **🚀 DEPLOYMENT & INFRASTRUCTURE**

### **Platform Deployment**
- **Frontend** - Vercel (Next.js 15)
- **Backend** - Vercel Edge Functions
- **Database** - Supabase (PostgreSQL + pgvector)
- **Blockchain** - Ethereum/Polygon networks

### **Environment Management**
- **Production** - Live platform environment
- **Staging** - Pre-production testing
- **Development** - Local development environment

---

## **📈 FEATURE STATUS**

### **✅ FULLY IMPLEMENTED**
- Core role agent management
- Organization setup and onboarding
- Magic Link authentication
- Basic dashboard and navigation
- Role template system
- LoA management framework
- NFT minting infrastructure
- Blockchain transaction tracking
- **Milestone 3: Complete MCP enforcement system**

### **🔄 IN PROGRESS**
- Trust constellation visualization
- Advanced analytics dashboard
- OPA sidecar integration (deployment pending)

### **📋 PLANNED**
- Advanced policy management
- Trust economy integration
- Micropayment systems
- Advanced AI/ML capabilities

---

## **🎯 PLATFORM ARCHITECTURE**

### **Frontend Layer**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Query** - Data fetching and caching

### **Backend Layer**
- **API Routes** - Next.js API endpoints
- **Prisma ORM** - Database abstraction
- **JWT Authentication** - Token-based security
- **HMAC Verification** - Cryptographic validation

### **Data Layer**
- **PostgreSQL** - Primary database
- **pgvector** - Vector similarity search
- **Redis** - Caching and session storage
- **Supabase** - Database hosting and management

### **Blockchain Layer**
- **Smart Contracts** - Solidity-based contracts
- **Web3 Integration** - Blockchain interaction
- **Transaction Management** - Gas optimization

---

## **🔍 SEARCH & DISCOVERY**

### **Internal Search**
- **Role Agent Search** - Find specific agents
- **Policy Search** - Locate policies and templates
- **Document Search** - Knowledge base queries

### **External Discovery**
- **ANS Registry** - Public agent discovery
- **Verification APIs** - Third-party verification
- **Integration Directory** - Available integrations

---

**Last Updated**: January 25, 2025  
**Platform Version**: Milestone 3 Complete  
**Status**: Production Ready with OPA Integration Pending
