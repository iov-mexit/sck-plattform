# SCK (Secure Code KnAIght) - Workspace Structure

## 📁 Root Directory Structure

```
sck_1/
├── app/                                    # Root app directory
│   ├── api/
│   │   ├── test/
│   │   │   └── route.ts
│   │   └── v1/
│   │       └── digital-twins/
│   │           └── [id]/
├── apps/                                   # Monorepo applications
│   └── web/                               # Main web application
│       ├── app/                           # Next.js App Router
│       │   ├── api/                       # API routes
│       │   │   ├── metadata/
│       │   │   │   └── [tokenId]/
│       │   │   ├── test/
│       │   │   ├── test-db/
│       │   │   └── v1/
│       │   │       ├── blockchain-transactions/
│       │   │       ├── digital-twins/
│       │   │       │   └── [id]/
│       │   │       ├── mock-data/
│       │   │       ├── organizations/
│       │   │       ├── role-templates/
│       │   │       ├── role-trust-thresholds/
│       │   │       ├── signals/
│       │   │       │   ├── [id]/
│       │   │       │   │   └── verify/
│       │   │       │   └── statistics/
│       │   │       ├── statistics/
│       │   │       ├── test/
│       │   │       │   └── [id]/
│       │   │       ├── trust/
│       │   │       │   └── validate/
│       │   │       └── twin-import/
│       │   ├── dashboard/
│       │   │   └── page.tsx
│       │   ├── digital-twin/
│       │   │   ├── import/
│       │   │   │   └── page.tsx
│       │   │   └── overview/
│       │   │       └── page.tsx
│       │   ├── error.tsx
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   ├── not-found.tsx
│       │   └── page.tsx
│       ├── components/                     # React components
│       │   ├── admin-panel.tsx
│       │   ├── common/                    # Common UI components
│       │   │   ├── badge.tsx
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── input.tsx
│       │   │   ├── label.tsx
│       │   │   ├── select.tsx
│       │   │   ├── tabs.tsx
│       │   │   └── textarea.tsx
│       │   ├── connection-status.tsx
│       │   ├── digital-twin-flow.tsx
│       │   ├── icons/
│       │   ├── layouts/
│       │   ├── trust-dashboard.tsx
│       │   ├── ui/                        # UI components (duplicate of common)
│       │   │   ├── badge.tsx
│       │   │   ├── button.tsx
│       │   │   ├── card.tsx
│       │   │   ├── input.tsx
│       │   │   ├── label.tsx
│       │   │   ├── select.tsx
│       │   │   ├── tabs.tsx
│       │   │   └── textarea.tsx
│       │   ├── wallet-connect.tsx
│       │   └── wallet-provider.tsx
│       ├── env.example
│       ├── env.template
│       ├── ENVIRONMENT_STRATEGY.md
│       ├── features/                      # Feature-based organization
│       │   ├── command-palette/
│       │   │   └── components/
│       │   │       └── command-palette.tsx
│       │   ├── signal-stream/
│       │   │   ├── components/
│       │   │   │   └── signal-stream.tsx
│       │   │   ├── signal-analytics.tsx
│       │   │   └── signal-collection.tsx
│       │   └── trust-constellation/
│       │       ├── admin-panel.tsx
│       │       ├── components/
│       │       │   └── trust-constellation.tsx
│       │       ├── organization-dashboard.tsx
│       │       └── trust-dashboard.tsx
│       ├── FRONTEND_STRATEGY.md
│       ├── GAP_ANALYSIS.md
│       ├── generated/
│       ├── lib/                           # Utility libraries
│       │   ├── __tests__/                 # Test files
│       │   │   ├── signal-collection.test.ts
│       │   │   ├── validation.test.ts
│       │   │   └── zod-validation.test.ts
│       │   ├── blockchain-service.ts
│       │   ├── contracts/                 # Smart contract interfaces
│       │   │   ├── organizational-nft.ts
│       │   │   ├── sck-nft-dynamic.ts
│       │   │   └── sck-nft.ts
│       │   ├── database.ts
│       │   ├── domains.ts
│       │   ├── env-validation.ts
│       │   ├── hooks/
│       │   ├── integrations/
│       │   │   └── signal-to-nft.ts
│       │   ├── mock-customer.ts
│       │   ├── payment-validation.ts
│       │   ├── privacy-config.ts
│       │   ├── providers/
│       │   ├── signal-collection.ts
│       │   ├── startup-validation.ts
│       │   ├── types/                     # TypeScript type definitions
│       │   │   ├── role-templates.ts
│       │   │   └── vis-network.d.ts
│       │   └── utils.ts
│       ├── next-env.d.ts
│       ├── next.config.js
│       ├── package.json
│       ├── postcss.config.js
│       ├── prisma/                        # Database schema and migrations
│       │   ├── migrations/
│       │   │   ├── 20250717151444_init/
│       │   │   │   └── migration.sql
│       │   │   ├── 20250717160558_add_url_to_signals/
│       │   │   │   └── migration.sql
│       │   │   ├── 20250719174221_add_trust_based_credentialing/
│       │   │   │   └── migration.sql
│       │   │   └── migration_lock.toml
│       │   ├── roleTemplates.seed.json
│       │   ├── schema.prisma
│       │   └── seed.ts
│       ├── README.md
│       ├── seed-comprehensive-roles.ts
│       ├── seed-comprehensive-trust-thresholds.ts
│       ├── seed-data.ts
│       ├── seed-trust-thresholds.ts
│       ├── setup-database.sh
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       ├── tsconfig.tsbuildinfo
│       ├── VALIDATION_SUMMARY.md
│       ├── VALIDATION_SYSTEM.md
│       ├── vercel.json
│       └── ZOD_VALIDATION.md
├── check-duplicates.ts
├── clean-duplicates.sh
├── DEPLOYMENT_GUIDE.md
├── DIGITAL_TWIN_SYSTEM.md
├── docker-compose.yml
├── DOMAIN_STRATEGY.md
├── DUPLICATE_FILE_SOLUTION.md
├── DYNAMIC_NFT_ACHIEVEMENTS.md
├── ENHANCED_HARDHAT_CONFIG.md
├── FIRST_SAAS_CUSTOMER.md
├── FRONTEND_TESTING_GUIDE.md
├── lib/                                   # Root level libraries
│   └── contracts/
│       └── organizational-nft.ts
├── METAMASK_TESTING_GUIDE.md
├── MVP_STRATEGY.md
├── next-env.d.ts
├── NFT_CONTRACT_IMPLEMENTATION.md
├── ORGANIZATIONAL_NFT_FLOW.md
├── package-lock.json
├── package.json
├── packages/                              # Monorepo packages
│   ├── ans/
│   │   └── tsconfig.tsbuildinfo
│   ├── blockchain/
│   │   └── tsconfig.tsbuildinfo
│   ├── contracts/                         # Smart contract package
│   │   └── backend/
│   │       ├── env.template
│   │       ├── hardhat.config.js
│   │       ├── hardhat.config.ts
│   │       ├── package.json
│   │       ├── README.md
│   │       ├── SCKNFT.sol
│   │       ├── SCKNFTDynamic.sol
│   │       ├── scripts/
│   │       │   └── deploy.js
│   │       ├── test/
│   │       │   └── SCKNFT.test.js
│   │       └── tsconfig.json
│   ├── governance/
│   │   └── tsconfig.tsbuildinfo
│   ├── identity/
│   ├── monetization/
│   │   └── tsconfig.tsbuildinfo
│   └── schema/                            # Schema definitions
│       └── src/
│           ├── digital-twin.d.ts
│           ├── digital-twin.d.ts.map
│           ├── index.d.ts
│           └── index.d.ts.map
├── prisma/                                # Root database schema
│   ├── migrations/
│   │   ├── 20250717151444_init/
│   │   │   └── migration.sql
│   │   ├── 20250717160558_add_url_to_signals/
│   │   │   └── migration.sql
│   │   ├── 20250719174221_add_trust_based_credentialing/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   ├── roleTemplates.seed.json
│   ├── schema.prisma
│   └── seed.ts
├── README.md
├── seed-comprehensive-roles.ts
├── SIGNAL_COLLECTION_IMPROVEMENTS.md
├── SIGNAL_COLLECTION_SYSTEM.md
├── SIGNAL_COLLECTION_V1.md
├── SYSTEM_ANALYSIS.md
├── test-db.js
├── test-prisma.js
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── turbo.json
```

## 🏗️ Architecture Overview

### **Monorepo Structure**
- **Root Level**: Configuration files, documentation, and shared utilities
- **Apps**: Main web application (`apps/web/`)
- **Packages**: Shared packages for contracts, governance, identity, etc.

### **Main Web Application (`apps/web/`)**
- **Next.js App Router**: Modern Next.js with TypeScript
- **API Routes**: RESTful API endpoints organized by version (`v1/`)
- **Components**: React components with feature-based organization
- **Features**: Domain-specific feature modules
- **Lib**: Utility functions, services, and type definitions

### **Key Features**
1. **Digital Twin System**: Core functionality for managing digital twins
2. **Signal Collection**: Real-time signal processing and analytics
3. **Trust Constellation**: Trust-based credentialing system
4. **Blockchain Integration**: NFT and smart contract integration
5. **Command Palette**: Advanced navigation and search

### **Database & Schema**
- **Prisma ORM**: Type-safe database access
- **Migrations**: Version-controlled database schema changes
- **Seed Data**: Initial data population scripts

### **Smart Contracts**
- **SCKNFT.sol**: Base NFT contract
- **SCKNFTDynamic.sol**: Dynamic NFT with achievements
- **Organizational NFT**: Organization-specific NFT functionality

## 📋 File Type Enforcement
- **TypeScript Only**: All source code uses `.ts`/`.tsx` files
- **No JavaScript**: No `.js`/`.jsx` files for source code
- **Strict Enforcement**: Prevents duplicate file types

## 🔧 Development Tools
- **Turbo**: Monorepo build system
- **Tailwind CSS**: Utility-first CSS framework
- **Prisma**: Database ORM
- **Hardhat**: Ethereum development environment
- **Vercel**: Deployment platform

## 📚 Documentation
Comprehensive documentation covering:
- System architecture and design
- Deployment strategies
- Frontend testing guidelines
- Validation systems
- Signal collection systems
- NFT implementation details

This workspace represents a sophisticated blockchain-enabled digital twin platform with a modern, scalable architecture built on Next.js, TypeScript, and Ethereum smart contracts. 