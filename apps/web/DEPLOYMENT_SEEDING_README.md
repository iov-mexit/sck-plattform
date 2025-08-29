# 🌱 SCK Platform Deployment Seeding Guide

## Overview

The SCK Platform now includes **comprehensive database seeding** that ensures all essential data is populated during deployment. This eliminates the "empty database" issue and ensures the platform is fully functional from the moment it's deployed.

## 🚀 What Gets Seeded

### **Phase 1: Foundation Data (Critical)**
- **Organizations**: Default organization with compliance tags
- **Role Templates**: 26+ security-focused roles (Security, DevOps, Development, QA)
- **Basic Trust Thresholds**: Minimum trust scores for each role type
- **LoA Policies**: Level of Assurance governance policies

### **Phase 2: Governance & Compliance (Important)**
- **Comprehensive Trust Thresholds**: Detailed trust requirements per role
- **MCP Policies**: AI governance and access control policies
- **Approval Workflows**: Review requirements and validation processes

### **Phase 3: Demonstration & Knowledge (Enhancement)**
- **Sample Role Agents**: Example agents with trust scores and ANS integration
- **Sample Signals**: External trust data (certifications, training, activities)
- **Sample Certifications**: Professional credentials and verifications
- **RAG Knowledge Base**: Security framework knowledge for AI features

## 🔧 Deployment Commands

### **Automatic Seeding (Recommended)**
```bash
# During Vercel deployment, seeding happens automatically
# The buildCommand in vercel.json includes: npm run deploy:seed
```

### **Manual Seeding**
```bash
# Seed the database manually
npm run deploy:seed

# Run complete production deployment
npm run deploy:production

# Check seeding status
npm run check:db
```

### **Development Seeding**
```bash
# Seed for local development
npm run db:push
npx prisma db seed

# Or use the comprehensive script
npx tsx seed-comprehensive-26.ts
```

## 📊 Expected Data After Seeding

### **Role Templates Page**
- ✅ 26+ security-focused roles displayed
- ✅ Categories: Security, DevOps, Development, QA, Architecture, Design
- ✅ Each role has responsibilities and security contributions
- ✅ Search and filtering functional

### **Dashboard**
- ✅ Organization information displayed
- ✅ Trust constellation visualization working
- ✅ Sample role agents visible
- ✅ Trust scores and levels shown

### **ANS Integration**
- ✅ Role agents automatically registered to ANS
- ✅ Public verification endpoints available
- ✅ Cross-domain communication functional

### **Governance Features**
- ✅ LoA policies for different artifact types
- ✅ Trust thresholds for role qualification
- ✅ MCP policies for AI governance
- ✅ Approval workflows functional

## 🛠️ Troubleshooting

### **Seeding Fails During Deployment**
```bash
# Check deployment logs in Vercel dashboard
# Verify DATABASE_URL environment variable
# Check if database is accessible

# Manual seeding after deployment
npm run deploy:seed
```

### **Partial Data After Seeding**
```bash
# Check seeding logs for specific failures
# Verify all seed files exist and are accessible
# Run individual seed scripts if needed

# Re-run comprehensive seeding
npm run deploy:seed
```

### **Database Connection Issues**
```bash
# Verify environment variables
echo $DATABASE_URL
echo $NEXT_PUBLIC_SUPABASE_URL

# Test database connection
npx prisma db pull
```

## 🔄 Seeding Process Details

### **Idempotent Operations**
- All seeding operations check if data already exists
- No duplicate data is created
- Safe to run multiple times

### **Dependency Management**
- Organizations created before role templates
- Role templates created before role agents
- Trust thresholds depend on role templates
- LoA policies need organizations and roles

### **Fallback Mechanisms**
- If comprehensive seeding fails, basic data is created
- Graceful degradation ensures platform functionality
- Error logging for debugging

### **Environment Awareness**
- Production: Uses Supabase from environment variables
- Development: Falls back to local database if needed
- Automatic environment detection and configuration

## 📁 File Structure

```
scripts/
├── deploy-seed.js              # Main seeding script
├── deploy-production.js         # Complete deployment script
└── seed-comprehensive-26.ts    # Role template data

prisma/
├── schema.prisma               # Database schema
└── migrations/                 # Database migrations

seed-*.ts                       # Individual seed files
```

## 🎯 Next Steps

### **Immediate Actions**
1. **Deploy to Vercel**: Seeding happens automatically
2. **Verify Data**: Check role templates page loads
3. **Test Features**: Ensure all platform features work

### **Future Enhancements**
1. **Custom Seeding**: Organization-specific data
2. **External Sources**: Integration with HR systems
3. **Real-time Updates**: Live data synchronization
4. **Advanced Analytics**: Seeding performance metrics

## 📞 Support

If you encounter issues with deployment seeding:

1. **Check Vercel deployment logs**
2. **Verify environment variables**
3. **Run manual seeding**: `npm run deploy:seed`
4. **Review this documentation**
5. **Check database connectivity**

---

**🎉 The SCK Platform now ensures complete data population during deployment, eliminating the "empty database" issue and providing a fully functional platform from day one!**
