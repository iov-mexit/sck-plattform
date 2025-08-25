# 🚀 Milestone 3: Environment Setup Guide

## **PHASE A: Environment Configuration (CRITICAL)**

### **Step 1: Set Production Environment Variables**

You need to set these **3 CRITICAL SECRETS** in your production environment:

```bash
# Milestone 3: MCP Enforcement System - CRITICAL SECRETS
JWT_SECRET="sck-milestone3-jwt-secret-2025-production-key-$(openssl rand -hex 32)"
BUNDLE_SIGNING_SECRET="sck-bundle-signing-secret-2025-production-$(openssl rand -hex 32)"
HMAC_SHARED_SECRET="sck-hmac-shared-secret-2025-production-$(openssl rand -hex 32)"
```

### **Step 2: Where to Set These Variables**

#### **Option A: Vercel Dashboard (Recommended)**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `sck-plattform` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - `JWT_SECRET` = [generate with openssl rand -hex 32]
   - `BUNDLE_SIGNING_SECRET` = [generate with openssl rand -hex 32]
   - `HMAC_SHARED_SECRET` = [generate with openssl rand -hex 32]

#### **Option B: Local .env.production File**
Create `apps/web/.env.production` with:
```bash
JWT_SECRET="your-generated-jwt-secret"
BUNDLE_SIGNING_SECRET="your-generated-bundle-secret"
HMAC_SHARED_SECRET="your-generated-hmac-secret"
```

### **Step 3: Generate Secure Secrets**

Run these commands to generate secure secrets:

```bash
# Generate JWT Secret
echo "JWT_SECRET=sck-jwt-$(openssl rand -hex 32)"

# Generate Bundle Signing Secret
echo "BUNDLE_SIGNING_SECRET=sck-bundle-$(openssl rand -hex 32)"

# Generate HMAC Shared Secret
echo "HMAC_SHARED_SECRET=sck-hmac-$(openssl rand -hex 32)"
```

### **Step 4: Verify Configuration**

After setting the variables, verify they're loaded:

```bash
# Check if variables are loaded
echo "JWT_SECRET: $JWT_SECRET"
echo "BUNDLE_SIGNING_SECRET: $BUNDLE_SIGNING_SECRET"
echo "HMAC_SHARED_SECRET: $HMAC_SHARED_SECRET"
```

## **✅ PHASE A COMPLETION CHECKLIST**

- [ ] JWT_SECRET set and verified
- [ ] BUNDLE_SIGNING_SECRET set and verified
- [ ] HMAC_SHARED_SECRET set and verified
- [ ] Environment variables loaded in application
- [ ] No more "missing environment variable" errors

## **🚀 NEXT: PHASE B - Database Deployment**

Once Phase A is complete, we'll move to:
- **Phase B**: Database Migration (30 minutes)
- **Phase C**: Basic Functionality (1 hour)
- **Phase D**: OPA Integration (2 hours)

**Complete Phase A first, then let me know to proceed with Phase B!**
