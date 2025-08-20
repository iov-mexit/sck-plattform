# 🧹 Vercel Cleanup Guide - Fix Multiple Deployment Issues

## 🚨 **Problem Identified**

You currently have **3 different Vercel deployments** causing continuous failures:

1. **`sck-plattform`** - Main project (keep this one)
2. **`sck-plattform-bh7n`** - Auto-generated project (delete)
3. **`sck_1`** - Local workspace project (delete)

## ✅ **Solution: Single Deployment Target**

### **Step 1: Clean Up Vercel Projects**

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Delete these projects:**
   - ❌ `sck-plattform-bh7n` 
   - ❌ `sck_1`
3. **Keep only:** ✅ `sck-plattform`

### **Step 2: Verify Single Project**

1. **Ensure only ONE Vercel project exists**
2. **Project name should be:** `sck-plattform`
3. **Repository should point to:** `iov-mexit/sck-plattform`

### **Step 3: Update GitHub Repository Settings**

1. **Go to your GitHub repo:** `iov-mexit/sck-plattform`
2. **Settings → Integrations & services**
3. **Remove any duplicate Vercel integrations**
4. **Keep only ONE Vercel integration**

### **Step 4: Verify Deployment Configuration**

1. **Single `vercel.json` in root directory** ✅
2. **No duplicate Vercel configs** ✅
3. **Proper monorepo build commands** ✅

## 🔧 **Current Configuration**

Your `vercel.json` is now properly configured:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": "apps/web/.next"
}
```

## 🚀 **Deploy Commands**

After cleanup, use these commands:

```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel

# Check deployment status
vercel ls
```

## 📋 **Checklist**

- [ ] Delete `sck-plattform-bh7n` project
- [ ] Delete `sck_1` project  
- [ ] Keep only `sck-plattform` project
- [ ] Remove duplicate GitHub integrations
- [ ] Verify single `vercel.json` configuration
- [ ] Test deployment with `vercel --prod`

## 🎯 **Expected Result**

After cleanup, you should have:
- ✅ **1 Vercel project** (`sck-plattform`)
- ✅ **1 deployment target**
- ✅ **Successful deployments**
- ✅ **No more conflicts**

## 🆘 **If Issues Persist**

1. **Clear Vercel cache:** `vercel --clear-cache`
2. **Re-link project:** `vercel link`
3. **Force redeploy:** `vercel --force`

---

**This will fix your continuous deployment failures once and for all!** 🚀
