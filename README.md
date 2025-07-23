# 🛡️ Secure Code KnAIght (SCK) Platform

> **Privacy-first digital twin platform for decentralized AI-driven developer coordination**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/sck-platform)

## 🎯 Overview

SCK is a revolutionary platform that enables privacy-preserving digital twin management for developer coordination. Built with zero PII (Personally Identifiable Information) and DID (Decentralized Identifier) assignment, it provides a secure foundation for the future of decentralized development.

## ✨ Key Features

### 🔒 Privacy-First Design
- **Zero PII**: No personal names, emails, or wallet addresses stored
- **DID-Only Assignment**: Decentralized identifiers for complete privacy
- **Role-Based Identification**: Twins identified by role, not personal information
- **GDPR Compliant**: Built with privacy regulations in mind

### 🏗️ Digital Twin System
- **Security-Focused Role Templates**: Pre-configured roles for cybersecurity teams
- **Real-Time Dashboard**: Live monitoring of digital twin status
- **Mock SaaS Customer**: "SecureCorp" demonstrates real-world usage
- **Scalable Architecture**: Monorepo structure for enterprise deployment

### 🛠️ Technical Stack
- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Validation**: Zod for type-safe environment configuration
- **Database**: Prisma ORM with PostgreSQL (ready for integration)
- **Monorepo**: Turbo for efficient package management

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Git

### Local Development
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sck-platform.git
cd sck-platform

# Install dependencies
npm install

# Start development server
cd apps/web
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the platform in action.

## 📁 Project Structure

```
sck-platform/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/                # App Router pages
│       │   ├── api/           # API routes
│       │   ├── dashboard/     # Dashboard pages
│       │   ├── layout.tsx     # Root layout
│       │   └── page.tsx       # Home page
│       ├── components/        # UI components
│       │   └── ui/           # shadcn/ui components
│       ├── lib/              # Utilities & validation
│       └── public/           # Static assets
├── packages/                  # Monorepo packages
│   ├── identity/             # DID & digital twin management
│   ├── blockchain/           # Multi-chain integration
│   ├── governance/           # DAO & reputation systems
│   └── monetization/         # Payment & analytics
├── prisma/                   # Database schema & migrations
└── docs/                     # Documentation
```

## 🎮 Demo Experience

### Mock SaaS Customer: SecureCorp
The platform includes a complete demo with "SecureCorp", a cybersecurity consulting firm:

- **12 Security-Focused Role Templates**: From Security Engineers to Compliance Specialists
- **Privacy-Preserving Digital Twins**: Role-based identification with DID assignment
- **Real-Time Dashboard**: Monitor twin status, security scores, and DID coverage
- **Interactive Creation Flow**: Create new twins with role templates and DID assignment

### Key Demo Features
1. **Create Digital Twin**: Assign roles using DID-only identification
2. **Dashboard**: View all twins with privacy-preserving display
3. **Role Templates**: Select role templates for specific tasks and roles
4. **System Status**: Platform health and performance monitoring

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in `apps/web/`:

```env
# Database (for future use)
DATABASE_URL="postgresql://user:password@localhost:5432/sck_db"

# Environment
NODE_ENV="development"

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your_analytics_id"
```

### Development Scripts
```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript checks

# Database (when connected)
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database
```

## 🚀 Deployment

### Vercel (Recommended)
1. Fork this repository
2. Connect to [Vercel](https://vercel.com)
3. Import the repository
4. Set environment variables
5. Deploy!

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🔒 Security & Privacy

### Privacy Features
- ✅ **Zero PII Storage**: No personal information in digital twins
- ✅ **DID-Only Assignment**: Decentralized identifiers for privacy
- ✅ **Role-Based Identification**: Twins identified by function, not person
- ✅ **Encrypted Environment Variables**: Secure configuration management

### Security Measures
- ✅ **Type-Safe Validation**: Zod schemas for all inputs
- ✅ **Environment Validation**: Comprehensive startup checks
- ✅ **No Hardcoded Secrets**: All sensitive data in environment variables
- ✅ **CORS Protection**: Secure API endpoints

## 📊 Roadmap

### Phase 1: Core Platform ✅
- [x] Privacy-first digital twin system
- [x] DID-only assignment
- [x] Mock SaaS customer
- [x] Environment validation
- [ ] Role-based digital twin management
- [ ] Real-time dashboard
- [ ] Zero PII storage
- [ ] Role-based digital twin management
- [ ] Real-time 

### Phase 2: Database Integration
- [ ] Connect PostgreSQL database
- [ ] Implement Prisma migrations
- [ ] Add real-time data persistence

### Phase 3: Authentication
- [ ] DID-based authentication
- [ ] Web3 wallet integration
- [ ] Role-based access control

### Phase 4: Advanced Features
- [ ] Smart contract integration
- [ ] Cross-chain DID resolution
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use the established component patterns
- Maintain privacy-first design principles
- Write comprehensive tests

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Digital Twin System](./DIGITAL_TWIN_SYSTEM.md)
- [Environment Strategy](./apps/web/ENVIRONMENT_STRATEGY.md)
- [Validation System](./apps/web/VALIDATION_SYSTEM.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Vercel**: For seamless deployment
- **shadcn/ui**: For beautiful UI components
- **Prisma**: For type-safe database access
- **Zod**: For runtime type validation

---

**🛡️ Built with privacy and security in mind for the future of decentralized development.** 

## 🐘 Starting the Database with Docker Compose

To start the PostgreSQL database for local development, run:

```bash
docker-compose up -d
```

This will start a PostgreSQL instance with the correct credentials and database name. The app will be able to connect using the default `DATABASE_URL` in your `.env.local`:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/sck_database"
```

If you need to stop the database:

```bash
docker-compose down
``` 