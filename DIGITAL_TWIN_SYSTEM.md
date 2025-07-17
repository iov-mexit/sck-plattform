# 🎯 SCK Digital Twin System

## Overview

The SCK Digital Twin System is a comprehensive platform that allows SaaS clients to define their organizational structure using security-aware role templates, assign humans to those roles, and create digital twins that collect signals and certifications to mint soulbound NFTs.

## 🏗️ Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Digital Twin System                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Organization│  │ Role        │  │ Digital Twin        │ │
│  │ Management  │  │ Templates   │  │ Management          │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │ Signal      │  │ Certification│  │ Blockchain          │ │
│  │ Collection  │  │ Management  │  │ Integration         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

The system uses PostgreSQL with Prisma ORM and includes:

- **Organizations**: Multi-tenant organization management
- **Role Templates**: Predefined security-aware roles (12 total)
- **Digital Twins**: Individual role assignments with blockchain integration
- **Signals**: Real-time activity and achievement tracking
- **Certifications**: Verified credential management
- **Humans**: User management with DID support
- **Audit Logs**: Comprehensive activity tracking

## 🚀 Quick Start

### 1. Database Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/web/env.template apps/web/.env.local
# Edit .env.local with your database URL

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with role templates
npm run db:seed
```

### 2. Environment Configuration

```bash
# .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/sck_database"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_ENVIRONMENT="development"
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/dashboard` to see the digital twin system in action.

## 📊 Role Templates

### Product Roles (3)

| Role | Focus | Security Contributions |
|------|-------|----------------------|
| **Product Manager** | Product strategy | Security as feature, compliance awareness |
| **Product Owner** | Sprint planning | Security prioritization, risk escalation |
| **Project Manager** | Delivery management | Security governance, milestone planning |

### Architecture Roles (5)

| Role | Focus | Security Contributions |
|------|-------|----------------------|
| **Frontend Developer** | UI/UX with accessibility | XSS prevention, CSP, secure storage |
| **Backend Developer** | API and logic layer | Input validation, rate limiting, access controls |
| **DevSecOps Engineer** | CI/CD and infrastructure | SAST/DAST, container scanning, policy-as-code |
| **Mobile Developer** | Native app development | Certificate pinning, OWASP MASVS, obfuscation |
| **Security Engineer** | Risk assessment | Threat modeling, penetration testing, SDL |

### QA Roles (2)

| Role | Focus | Security Contributions |
|------|-------|----------------------|
| **QA Automation Engineer** | Test automation | Security test integration, OWASP ZAP |
| **QA Analyst** | Test strategy | Security-aware testing, edge case coverage |

### Solution Design Roles (2)

| Role | Focus | Security Contributions |
|------|-------|----------------------|
| **Business Analyst** | Requirements | Access control design, compliance capture |
| **Data Analyst** | Data insights | Data anonymization, fraud detection |

## 🔧 API Endpoints

### Organizations

```typescript
// Create organization
POST /api/v1/organizations
{
  "name": "CyberLab AD",
  "description": "Advanced cybersecurity research",
  "domain": "cyberlab-ad.com"
}

// Get organization by domain
GET /api/v1/organizations?domain=cyberlab-ad.com
```

### Role Templates

```typescript
// Get role templates for organization
GET /api/v1/role-templates?organizationId=org-123
```

### Digital Twins

```typescript
// Create digital twin
POST /api/v1/digital-twins
{
  "name": "Alice Frontend Developer Twin",
  "description": "Digital twin for Alice",
  "organizationId": "org-123",
  "roleTemplateId": "frontend-developer",
  "assignedToId": "human-456",
  "blockchainAddress": "0x1234...",
  "blockchainNetwork": "ethereum"
}

// Get digital twins for organization
GET /api/v1/digital-twins?organizationId=org-123
```

## 🎯 MVP Features

### ✅ Implemented

1. **Database Schema**: Complete PostgreSQL schema with Prisma ORM
2. **Role Templates**: 12 security-aware roles with detailed specifications
3. **API Endpoints**: RESTful APIs for organizations, role templates, digital twins
4. **Dashboard UI**: React dashboard with organization overview
5. **Seed Data**: Sample organization with digital twin and signals
6. **Type Safety**: Full TypeScript support with Zod validation

### 🚧 Next Steps

1. **Authentication**: DID-based authentication with verifiable credentials
2. **Blockchain Integration**: Smart contract deployment for soulbound NFTs
3. **Signal Collection**: Real-time signal aggregation from various sources
4. **Certification Verification**: Automated credential verification
5. **Advanced UI**: Role assignment workflow and twin management
6. **Analytics**: Signal analysis and twin performance metrics

## 🛠️ Development Commands

```bash
# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes
npm run db:migrate     # Run migrations
npm run db:seed        # Seed database
npm run db:studio      # Open Prisma Studio

# Development
npm run dev            # Start development server
npm run build          # Build for production
npm run lint           # Run ESLint
npm run type-check     # TypeScript type checking
```

## 📁 Project Structure

```
sck_1/
├── prisma/
│   ├── schema.prisma              # Database schema
│   ├── seed.ts                    # Database seeding
│   └── roleTemplates.seed.json    # Role template data
├── apps/web/
│   ├── app/
│   │   ├── api/v1/               # API routes
│   │   │   ├── organizations/
│   │   │   ├── digital-twins/
│   │   │   └── role-templates/
│   │   └── dashboard/            # Dashboard page
│   └── lib/
│       ├── database.ts           # Database service layer
│       └── env-validation.ts     # Environment validation
└── DIGITAL_TWIN_SYSTEM.md        # This documentation
```

## 🔒 Security Features

### Data Protection

- **Encryption at rest**: Database encryption for sensitive data
- **Input validation**: Zod schemas for all API inputs
- **SQL injection prevention**: Prisma ORM with parameterized queries
- **Audit logging**: Comprehensive activity tracking

### Access Control

- **Organization isolation**: Multi-tenant data separation
- **Role-based permissions**: Template-based access control
- **DID integration**: Decentralized identity support
- **Blockchain verification**: Immutable credential storage

## 🎯 Use Cases

### For SaaS Clients

1. **Organization Setup**: Define company structure with security-aware roles
2. **Role Assignment**: Assign humans to specific roles within the organization
3. **Digital Twin Creation**: Automatically create digital twins for each assignment
4. **Signal Collection**: Track activities, certifications, and achievements
5. **NFT Minting**: Generate soulbound NFTs based on collected signals

### For Individuals

1. **Role Discovery**: Explore available security-aware roles
2. **Skill Development**: Understand security requirements for each role
3. **Achievement Tracking**: Monitor progress and certifications
4. **Portfolio Building**: Create verifiable digital credentials
5. **Career Growth**: Level up digital twins through signal collection

## 🚀 Deployment

### Production Setup

1. **Database**: Set up PostgreSQL with encryption
2. **Environment**: Configure production environment variables
3. **Migrations**: Run database migrations
4. **Seeding**: Seed with role templates
5. **Monitoring**: Set up logging and monitoring

### Environment Variables

```bash
# Required
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# Optional
NEXT_PUBLIC_ENVIRONMENT="production"
NEXT_PUBLIC_SENTRY_DSN="..."
NEXT_PUBLIC_ANALYTICS_ID="..."
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests**
5. **Submit a pull request**

## 📄 License

This project is part of the SCK (Secure Code KnAIght) platform.

---

**Next Steps**: The system is ready for MVP deployment. Focus on blockchain integration and signal collection to complete the digital twin lifecycle. 