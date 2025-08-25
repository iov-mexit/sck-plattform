# 🚀 Manual Deployment: Milestone 3 to Supabase

Since the automated deployment had some constraint conflicts, here's how to deploy Milestone 3 manually:

## **📋 Step 1: Open Supabase SQL Editor**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `vqftrdxexmsdvhbbyjff`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

## **📝 Step 2: Copy and Paste SQL**

Copy the entire contents of this file:
```
prisma/migrations/milestone3_clean_deployment.sql
```

## **▶️ Step 3: Execute SQL**

1. Paste the SQL into the query editor
2. Click **Run** button
3. Wait for execution to complete

## **✅ Step 4: Verify Deployment**

You should see:
- **PolicyBundle** table created
- **GatewayToken** table created  
- **EnforcementCall** table created
- All indexes and constraints applied
- Success message: "Milestone 3: MCP Enforcement System deployed successfully!"

## **🔧 Alternative: Use Prisma Migration**

If you prefer, you can also run:

```bash
# Set your Supabase database URL
export DATABASE_URL="postgres://postgres.vqftrdxexmsdvhbbyjff:CPGQ3DOml9iD3QID@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require"

# Push schema changes
npx prisma db push --accept-data-loss
```

## **🎯 What Gets Deployed**

- **Policy Bundle Management**: Complete lifecycle management
- **Gateway Token System**: JWT-based access control
- **HMAC + ANS Verification**: Cryptographic upstream call validation
- **Enforcement Call Logging**: Complete audit trail
- **Performance Indexes**: Optimized for production use

## **🚀 After Deployment**

Your enforcement system will be live at:
- Bundle API: `/api/v1/enforcement/bundles/*`
- Token API: `/api/v1/enforcement/tokens/*`
- Verify API: `/api/v1/enforcement/verify`

## **🔍 Troubleshooting**

If you get errors:
1. **Check table names**: Ensure existing tables match expected names
2. **Constraint conflicts**: Drop conflicting constraints first
3. **Permissions**: Ensure you have admin access to the database

**Ready to deploy? Copy the SQL and run it in your Supabase SQL Editor!** 🎯
