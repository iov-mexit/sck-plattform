# 🚀 SCK Platform Vercel Deployment Guide

## 📋 **Pre-Deployment Checklist**

### ✅ **Code Ready for Production**
- [x] ANS Integration implemented and tested
- [x] Cross-domain configuration updated for Vercel
- [x] Environment variables configured
- [x] Database schema with ANS fields
- [x] Authentication flow working
- [x] Role agent management functional

### 🔧 **Required Environment Variables**

Set these in Vercel Dashboard → Settings → Environment Variables:

#### **Core Configuration**
```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_MAGIC_API_KEY=pk_live_A9411297CC00BA0D
```

#### **ANS Integration**
```bash
NEXT_PUBLIC_ANS_REGISTRY_URL=https://knaight.site
NEXT_PUBLIC_AUTO_REGISTER_ANS=true
NEXT_PUBLIC_ENABLE_ANS_INTEGRATION=true
```

#### **Web3 & Blockchain (Optional)**
```bash
WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
INFURA_KEY=your_infura_key
SCK_NFT_ADDRESS=your_nft_contract_address
SCK_NFT_DYNAMIC_ADDRESS=your_dynamic_nft_contract_address
```

#### **Monitoring (Optional)**
```bash
SENTRY_DSN=your_sentry_dsn
ANALYTICS_ID=your_analytics_id
```

## 🚀 **Deployment Steps**

### 1. **Connect to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link
```

### 2. **Set Environment Variables**
```bash
# Set production environment variables
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_MAGIC_API_KEY production
vercel env add NEXT_PUBLIC_ANS_REGISTRY_URL production
vercel env add NEXT_PUBLIC_AUTO_REGISTER_ANS production
vercel env add NEXT_PUBLIC_ENABLE_ANS_INTEGRATION production
```

### 3. **Deploy to Production**
```bash
# Deploy to production
vercel --prod

# Or deploy from GitHub
# Push to main branch triggers automatic deployment
```

## 🌐 **Domain Configuration**

### **Production URLs**
- **SCK Platform**: `https://sck-plattform.vercel.app`
- **ANS Registry**: `https://knaight.site` (separate deployment)

### **Custom Domain Setup**
1. Go to Vercel Dashboard → Domains
2. Add custom domain: `secure-knaight.io`
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_BASE_URL` environment variable

## 🔗 **ANS Integration in Production**

### **Cross-Domain Communication**
- SCK Platform → ANS Registry: `https://knaight.site/api/v1/register`
- Public Verification: `https://knaight.site/api/v1/verify/:ansIdentifier`

### **Auto-Registration Flow**
1. Role agent created in SCK Platform
2. Automatic ANS registration triggered
3. Agent appears in knaight.site registry
4. Public verification available

## 🗄️ **Database Setup**

### **Vercel Postgres**
1. Create Postgres database in Vercel Dashboard
2. Copy connection string to `DATABASE_URL`
3. Run migrations:
```bash
# Local migration (before deployment)
npx prisma db push

# Or use Vercel CLI
vercel env pull .env.production.local
npx prisma db push --schema=apps/web/prisma/schema.prisma
```

### **Database Schema**
```sql
-- ANS Integration fields already added
ALTER TABLE role_agents ADD COLUMN ans_identifier TEXT;
ALTER TABLE role_agents ADD COLUMN ans_registration_status TEXT DEFAULT 'not_registered';
ALTER TABLE role_agents ADD COLUMN ans_registration_error TEXT;
ALTER TABLE role_agents ADD COLUMN ans_verification_url TEXT;
```

## 🔍 **Post-Deployment Verification**

### **Health Checks**
```bash
# SCK Platform Health
curl https://sck-plattform.vercel.app/api/v1/health

# ANS Registry Health
curl https://knaight.site/health
```

### **Feature Testing**
1. **Authentication**: Magic Link login
2. **Role Agents**: Create and manage agents
3. **ANS Registration**: Register agents to ANS
4. **Cross-Domain**: Verify agents on knaight.site

### **Monitoring**
- Check Vercel Analytics
- Monitor Sentry for errors
- Verify database connections
- Test ANS integration endpoints

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Check build logs
vercel logs

# Local build test
npm run build
```

#### **Database Connection Issues**
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
npx prisma db push --schema=apps/web/prisma/schema.prisma
```

#### **ANS Integration Issues**
```bash
# Test ANS registration
curl -X POST https://knaight.site/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### **Environment Variable Debugging**
```javascript
// Add to any page for debugging
console.log('Environment:', {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  ansRegistry: process.env.NEXT_PUBLIC_ANS_REGISTRY_URL,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT
});
```

## 📊 **Performance Optimization**

### **Vercel Optimizations**
- Edge Functions for API routes
- Image optimization enabled
- Automatic static optimization
- CDN distribution

### **Database Optimization**
- Connection pooling
- Query optimization
- Indexes on ANS fields

## 🔒 **Security Considerations**

### **Production Security**
- HTTPS enforced
- CORS properly configured
- Environment variables secured
- Magic Link authentication
- Rate limiting on APIs

### **ANS Security**
- Cross-domain authentication
- Payload validation
- Error handling
- Audit logging

## 📈 **Scaling Strategy**

### **Vercel Scaling**
- Automatic scaling based on traffic
- Edge functions for global performance
- CDN for static assets

### **Database Scaling**
- Vercel Postgres with connection pooling
- Read replicas for high traffic
- Backup and recovery procedures

## 🎯 **Next Steps After Deployment**

1. **Monitor Performance**: Use Vercel Analytics
2. **Set Up Alerts**: Configure Sentry notifications
3. **Test ANS Integration**: Verify cross-domain communication
4. **User Onboarding**: Test complete user flows
5. **Documentation**: Update user and developer docs

## 📞 **Support**

- **Vercel Support**: https://vercel.com/support
- **SCK Documentation**: Check project README
- **ANS Integration**: Review `lib/domains.ts`

---

**🚀 Ready for Production Deployment!**

The SCK Platform is now configured for Vercel deployment with full ANS integration support. 