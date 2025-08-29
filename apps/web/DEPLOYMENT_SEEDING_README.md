# 🌱 SCK Platform Post-Deployment Seeding Guide

## Overview

The SCK Platform now uses **post-deployment seeding** to ensure all essential data is populated after successful deployment. This approach fixes the build-time seeding issues and ensures the platform is fully functional from the moment it's deployed.

## 🚀 How Post-Deployment Seeding Works

### **Build Phase (No Seeding)**
- **Build succeeds** without database dependency
- **Application deploys** to Vercel successfully
- **No seeding attempts** during build time

### **Post-Deployment Phase (Seeding Happens)**
- **Automatic seeding** via Vercel cron jobs
- **Webhook-triggered seeding** after deployment success
- **Manual seeding** via API endpoints
- **Database fully accessible** when seeding runs

## 🔧 Post-Deployment Seeding Methods

### **Method 1: Vercel Cron Jobs (Automatic)**
```json
// vercel.json
"crons": [
  {
    "path": "/api/v1/deploy/seed",
    "schedule": "0 0 * * *"
  }
]
```
- **Runs daily at midnight** to ensure data is populated
- **Automatic and reliable** seeding
- **No manual intervention** required

### **Method 2: Post-Deployment Webhooks (Automatic)**
```json
// Configure in Vercel Dashboard
Webhook URL: https://sck-plattform.vercel.app/api/v1/deploy/webhook
Events: deployment.success
```
- **Triggers immediately** after successful deployment
- **Ensures fresh data** for each deployment
- **Real-time seeding** after deployment

### **Method 3: Manual API Triggering**
```bash
# Trigger seeding manually
npm run deploy:seed:api

# Check seeding status
npm run deploy:status

# Or use curl directly
curl -X POST https://sck-plattform.vercel.app/api/v1/deploy/seed
```

## 📊 API Endpoints for Seeding

### **POST /api/v1/deploy/seed**
- **Triggers comprehensive seeding**
- **Body**: `{ "force": false, "organizationId": "optional" }`
- **Response**: Seeding status and results

### **GET /api/v1/deploy/seed**
- **Returns endpoint information**
- **Usage instructions and examples**
- **Current endpoint status**

### **POST /api/v1/deploy/webhook**
- **Vercel webhook endpoint**
- **Automatically triggered** after deployment
- **Runs seeding** for successful deployments

### **GET /api/v1/deploy/status**
- **Deployment and seeding status**
- **Database connectivity check**
- **Data population counts** for all categories

## 🎯 What Gets Seeded (All 10 Categories)

### **Phase 1: Foundation Data (Critical)**
- **Organizations**: SecureCodeCorp with compliance tags
- **Role Templates**: 26+ security-focused roles
- **Basic Trust Thresholds**: Role qualification requirements
- **LoA Policies**: Governance framework

### **Phase 2: Governance & Compliance (Important)**
- **Comprehensive Trust Thresholds**: Detailed trust requirements
- **MCP Policies**: AI governance and access control

### **Phase 3: Demonstration & Knowledge (Enhancement)**
- **Sample Role Agents**: L4 Security Engineer, L3 DevOps Engineer
- **Sample Signals**: Certifications, training, activities
- **Sample Certifications**: Professional credentials
- **RAG Knowledge Base**: Security framework knowledge

## 🔄 Deployment Workflow

### **Step 1: Build & Deploy**
```bash
# Build succeeds without seeding
npm run build

# Deploy to Vercel
vercel --prod
```

### **Step 2: Automatic Seeding**
```bash
# Seeding happens automatically via:
# 1. Post-deployment webhook (immediate)
# 2. Vercel cron job (daily backup)
```

### **Step 3: Verify Seeding**
```bash
# Check seeding status
npm run deploy:status

# Verify role templates page loads
# Check dashboard functionality
```

## 🛠️ Troubleshooting

### **Build Still Fails**
```bash
# Ensure seeding is removed from build command
# Check vercel.json buildCommand
# Should be: "npm run prisma:generate && npm run build"
```

### **Seeding Not Triggered**
```bash
# Check webhook configuration in Vercel
# Verify cron job is active
# Test manual seeding: npm run deploy:seed:api
```

### **Partial Data After Seeding**
```bash
# Check seeding logs in Vercel function logs
# Verify database connectivity
# Re-run seeding: npm run deploy:seed:api
```

### **Database Connection Issues**
```bash
# Verify environment variables in Vercel
# Check DATABASE_URL is set correctly
# Test connection via status endpoint
```

## 📁 File Structure

```
app/api/v1/deploy/
├── seed/route.ts           # Manual seeding endpoint
├── webhook/route.ts        # Vercel webhook handler
└── status/route.ts         # Deployment status monitoring

scripts/
├── deploy-seed.js          # Comprehensive seeding logic
└── deploy-production.js    # Production deployment script

vercel.json                 # Build config + cron jobs
```

## 🎯 Expected Results

### **After Next Deployment**
1. **Build succeeds** without database dependency
2. **Application deploys** to Vercel successfully
3. **Seeding runs automatically** after deployment
4. **All data gets populated** in production environment
5. **Role templates page loads** with populated data

### **Verification Steps**
1. **Check build logs**: Should show successful build
2. **Monitor function logs**: Should show seeding progress
3. **Visit role templates page**: Should display 26+ roles
4. **Check dashboard**: Should show sample data
5. **Verify API endpoints**: Should return populated data

## 🚀 Next Steps

### **Immediate Actions**
1. **Deploy these changes** to Vercel
2. **Monitor build process** - should succeed now
3. **Check automatic seeding** via webhooks/cron
4. **Verify data population** via status endpoint

### **Future Enhancements**
1. **Add authentication** to seeding endpoints
2. **Implement seeding progress** tracking
3. **Add rollback capabilities** for failed seeding
4. **Create seeding dashboard** for monitoring

---

**🎉 The SCK Platform now uses post-deployment seeding, ensuring builds succeed and data gets populated at the right time in the deployment lifecycle!**
