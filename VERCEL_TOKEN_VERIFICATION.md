# 🔐 Vercel Token Verification & Fix Guide

## 🚨 **Current Error**

```
Error: The specified token is not valid. Use `vercel login` to generate a new token.
```

## 🔍 **Root Cause Analysis**

The token exists but is either:
1. **Invalid format** (contains invalid characters)
2. **Wrong scope** (doesn't have access to your team/project)
3. **Expired** (token has been revoked or expired)

## ✅ **Solution: Create Team-Specific Token**

### **Step 1: Go to Team Settings**

1. **Visit [vercel.com/dashboard](https://vercel.com/dashboard)**
2. **Select your team**: `team_YsM4jHIbaZxcoGOQ1CQY6TlS`
3. **Go to Settings → Tokens**

### **Step 2: Create New Token**

1. **Click "Create Token"**
2. **Name**: `github-actions-team-deploy`
3. **Scope**: Select `Team` (not Full Account)
4. **Team**: Ensure your team is selected
5. **Permissions**: Full access to team
6. **Click "Create"**

### **Step 3: Copy Token**

1. **Copy the generated token** (should look like: `abc123def456...`)
2. **Verify format**: No spaces, no colons, no special characters

### **Step 4: Update GitHub Secret**

1. **Go to GitHub repo**: `iov-mexit/sck-plattform`
2. **Settings → Secrets and variables → Actions**
3. **Find `VERCEL_TOKEN` and click "Update"**
4. **Paste the new team token**
5. **Click "Update secret"**

## 🔧 **Alternative: Use Project-Specific Token**

If team token doesn't work:

1. **Go to [vercel.com/dashboard](https://vercel.com/dashboard)**
2. **Select project**: `sck-plattform`
3. **Settings → General → Tokens**
4. **Create project-specific token**

## 🧪 **Test Token Locally**

Before updating GitHub, test the token:

```bash
# Test token locally
VERCEL_TOKEN="your_new_token" vercel ls

# Should show your projects
```

## 📋 **Required GitHub Secrets**

Ensure these are set correctly:

```
VERCEL_TOKEN = your_new_team_token
VERCEL_ORG_ID = team_YsM4jHIbaZxcoGOQ1CQY6TlS
VERCEL_PROJECT_ID = prj_1CPyPlRgPWcYopjFbkKUUK7rAWAS
```

## 🚀 **Expected Result**

After fixing the token:
- ✅ **Token validation** should pass
- ✅ **Project linking** should work
- ✅ **Deployment** should succeed
- 🌐 **App live** at `sck-plattform.vercel.app`

## 🆘 **If Still Failing**

1. **Check token permissions** in Vercel dashboard
2. **Verify team membership** and access
3. **Try project-specific token** instead of team token
4. **Contact Vercel support** if needed

---

**The key is creating a token with the right scope (Team) and permissions for your specific project.**
