# SCK Platform Sitemap & Testing Guide

## 🌐 Platform Overview
**Base URL**: Your Vercel deployment domain  
**Architecture**: Next.js API routes + React frontend  
**Package Manager**: Yarn (Vercel) + npm (local dev)  

---

## 🏠 Core Pages & Navigation

### Public Pages
- **`/`** - Landing page
- **`/onboarding`** - Organization setup wizard
- **`/error`** - Error handling page

### Authenticated Dashboard (`/(authenticated)/`)
- **`/dashboard`** - Main dashboard overview
- **`/role-agents`** - Role agent management
- **`/role-templates`** - Role template library
- **`/constellation`** - Trust constellation visualization
- **`/analytics`** - Platform analytics & insights
- **`/nft-minting`** - NFT creation & management
- **`/loa-management`** - Letter of Authority governance
- **`/agent-services`** - Agent service marketplace
- **`/settings`** - Organization & user settings

---

## 🔌 API Endpoints (`/api/`)

### Health & Status
- **`GET /api/health`** - Basic health check
- **`GET /api/test`** - Test endpoint
- **`GET /api/test-db`** - Database connectivity test

### Core Platform APIs (`/api/v1/`)

#### Role Management
- **`GET /api/v1/role-agents`** - List all role agents
- **`POST /api/v1/role-agents`** - Create new role agent
- **`GET /api/v1/role-agents/[id]`** - Get specific role agent
- **`PUT /api/v1/role-agents/[id]`** - Update role agent
- **`DELETE /api/v1/role-agents/[id]`** - Delete role agent
- **`POST /api/v1/role-agents/[id]/register-ans`** - Register to ANS
- **`POST /api/v1/role-agents/migrate`** - Bulk migration
- **`POST /api/v1/role-agents/update-terminology`** - Update naming

#### Role Templates
- **`GET /api/v1/role-templates`** - List role templates
- **`POST /api/v1/role-templates`** - Create template

#### Organizations
- **`GET /api/v1/organizations`** - List organizations
- **`POST /api/v1/organizations`** - Create organization

#### NFT Management
- **`POST /api/v1/nft/mint`** - Mint new NFT
- **`POST /api/v1/nft/reset`** - Reset NFT state

#### Blockchain Transactions
- **`GET /api/v1/blockchain-transactions`** - List transactions

#### Approvals System
- **`GET /api/v1/approvals/[artifactType]/[artifactId]`** - Get approvals
- **`POST /api/v1/approvals/[artifactType]/[artifactId]`** - Create approval

#### LOA Governance
- **`GET /api/v1/loa/policies`** - List LOA policies
- **`GET /api/v1/loa/reviewer-roles`** - List reviewer roles

#### MCP (Model Context Protocol)
- **`GET /api/v1/mcp/policies`** - List MCP policies

#### Trust & Validation
- **`POST /api/v1/trust/validate`** - Validate trust scores

#### Signals & Trust Scores
- **`GET /api/v1/signals/statistics`** - Signal statistics
- **`GET /api/v1/signals/trust-score`** - Get trust scores
- **`GET /api/v1/signals/[id]`** - Get specific signal
- **`POST /api/v1/signals/[id]/verify`** - Verify signal

#### Statistics
- **`GET /api/v1/statistics`** - Platform statistics

#### Twin Import
- **`POST /api/v1/twin-import`** - Import digital twins

### Advanced Features (`/api/v1/`)

#### Policy Management
- **`POST /api/v1/policy/compose`** - Compose policies
- **`POST /api/v1/policy/optimize`** - Optimize policies
- **`GET /api/v1/policy/analytics`** - Policy analytics

#### Trust Economy
- **`POST /api/v1/trust-economy/tokens/initialize`** - Initialize tokens
- **`POST /api/v1/trust-economy/rewards/award`** - Award tokens
- **`POST /api/v1/trust-economy/marketplace/list`** - List credentials

#### AI & MCP Layer
- **`POST /api/v1/ai/decide`** - AI decision service

#### RAG (Retrieval-Augmented Generation)
- **`POST /api/rag/search`** - Advanced RAG search with Supabase

#### Enforcement & OPA
- **`GET /api/v1/enforcement/bundles/active`** - Active policy bundles
- **`GET /api/v1/enforcement/status`** - OPA status
- **`POST /api/v1/enforcement/logs`** - Decision logs

### Metadata & Discovery
- **`GET /api/metadata/[tokenId]`** - NFT metadata

---

## 🧪 Testing Paths & Workflows

### 1. Basic Platform Health
```bash
# Test basic connectivity
curl https://your-domain.vercel.app/api/health
curl https://your-domain.vercel.app/api/test
curl https://your-domain.vercel.app/api/test-db
```

### 2. Role Agent Lifecycle
```bash
# 1. Create role agent
POST /api/v1/role-agents
{
  "name": "L3 Security Engineer",
  "organizationId": "org_id",
  "roleTemplateId": "template_id"
}

# 2. List all agents
GET /api/v1/role-agents

# 3. Get specific agent
GET /api/v1/role-agents/[agent_id]

# 4. Update agent
PUT /api/v1/role-agents/[agent_id]

# 5. Register to ANS
POST /api/v1/role-agents/[agent_id]/register-ans
```

### 3. RAG Search Testing
```bash
# Test knowledge retrieval
POST /api/rag/search
{
  "query": "What does ISO 27001 require for key rotation?",
  "limit": 5
}

# Expected: Returns relevant security framework chunks
```

### 4. AI Decision Service
```bash
# Test AI decision making
POST /api/v1/ai/decide
{
  "agentId": "agent_id",
  "context": "Request to access production database",
  "endpointRequested": "/api/v1/database/access",
  "payload": {...}
}

# Expected: Returns policy-based decision with justification
```

### 5. Trust Economy Flow
```bash
# 1. Initialize trust tokens
POST /api/v1/trust-economy/tokens/initialize

# 2. Award tokens for good behavior
POST /api/v1/trust-economy/rewards/award

# 3. List credentials in marketplace
POST /api/v1/trust-economy/marketplace/list
```

### 6. Policy Management
```bash
# 1. Compose new policy
POST /api/v1/policy/compose
{
  "components": ["access_control", "audit_logging"],
  "constraints": {...}
}

# 2. Optimize existing policy
POST /api/v1/policy/optimize
{
  "policyId": "policy_id",
  "optimizationGoals": ["performance", "security"]
}

# 3. Get policy analytics
GET /api/v1/policy/analytics
```

---

## 🔍 Frontend Testing Paths

### Dashboard Flow
1. **Login** → Magic Link authentication
2. **Dashboard** → Overview of organization status
3. **Role Agents** → Create/manage role agents
4. **Constellation** → Visualize trust relationships
5. **Analytics** → View platform metrics

### Role Agent Creation
1. **Role Templates** → Select from predefined templates
2. **Create Agent** → Fill in agent details
3. **Trust Assignment** → Set initial trust level
4. **ANS Registration** → Register to public registry
5. **NFT Minting** → Create blockchain identity

### Policy Enforcement
1. **Policy Creation** → Define access rules
2. **Agent Assignment** → Apply policies to agents
3. **Monitoring** → Track policy compliance
4. **Enforcement** → Automatic policy application

---

## 🚨 Error Handling & Debugging

### Common Issues
- **404 Errors**: Check if API route exists in correct location
- **500 Errors**: Check server logs and database connectivity
- **CORS Issues**: Verify headers in vercel.json
- **Rate Limiting**: Should be resolved with Yarn deployment

### Debug Endpoints
- **`/api/health`** - Basic system status
- **`/api/test-db`** - Database connectivity
- **`/api/test`** - General API testing

### Log Locations
- **Vercel**: Dashboard → Functions → Logs
- **Local**: Terminal output during development
- **Database**: Check Prisma connection

---

## 📱 Mobile & Responsiveness

### Test on Different Devices
- **Desktop**: Full dashboard experience
- **Tablet**: Responsive layout adjustments
- **Mobile**: Touch-friendly navigation

### Key Mobile Features
- **Responsive Constellation**: Touch-friendly trust visualization
- **Mobile Dashboard**: Optimized for small screens
- **Touch Navigation**: Swipe gestures for navigation

---

## 🔐 Security & Authentication

### Authentication Flow
1. **Magic Link** → Email-based login
2. **Session Management** → Secure token handling
3. **Role-Based Access** → Policy enforcement
4. **Audit Logging** → All actions logged

### Security Headers
- **CORS**: Configured in vercel.json
- **Content Security Policy**: Next.js defaults
- **HTTPS**: Enforced by Vercel

---

## 📊 Performance Monitoring

### Key Metrics
- **API Response Times** → Monitor endpoint performance
- **Database Queries** → Track Prisma performance
- **Frontend Load Times** → Page performance
- **Error Rates** → System reliability

### Monitoring Tools
- **Vercel Analytics** → Built-in performance tracking
- **Custom Logging** → Application-specific metrics
- **Database Monitoring** → Query performance

---

## 🚀 Deployment & CI/CD

### Current Setup
- **Package Manager**: Yarn (Vercel) + npm (local)
- **Build Command**: `yarn build`
- **Install Command**: `yarn install --immutable`
- **Framework**: Next.js

### Deployment Flow
1. **Local Development** → npm for stability
2. **Git Push** → Triggers Vercel deployment
3. **Vercel Build** → Uses Yarn to avoid npm rate limits
4. **Automatic Deployment** → Live on Vercel domain

---

## 📝 Next Steps & Roadmap

### Immediate Testing
- [ ] Test all API endpoints
- [ ] Verify RAG search functionality
- [ ] Test role agent lifecycle
- [ ] Validate policy enforcement

### Short Term
- [ ] Enhance error handling
- [ ] Add comprehensive logging
- [ ] Improve mobile experience
- [ ] Add performance monitoring

### Long Term
- [ ] Advanced AI integration
- [ ] Enhanced trust economy
- [ ] Policy optimization
- [ ] Cross-organization features

---

## 🆘 Support & Troubleshooting

### Getting Help
1. **Check this sitemap** for endpoint locations
2. **Review API documentation** for request formats
3. **Check Vercel logs** for deployment issues
4. **Test locally** with npm for development

### Common Commands
```bash
# Local development
npm run dev

# Build locally
npm run build

# Database operations
npx prisma generate
npx prisma db push

# Check deployment status
git status
git log --oneline -5
```

---

**Last Updated**: August 26, 2025  
**Version**: 1.0  
**Status**: ✅ Deployed and Live
