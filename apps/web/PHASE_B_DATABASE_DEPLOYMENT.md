# 🗄️ PHASE B: Database Deployment Guide

## **Overview**
Deploy the Milestone 3 enforcement tables to your Supabase instance.

**Estimated Time**: 30 minutes
**Prerequisites**: Phase A completed (environment variables set)

## **Step 1: Access Supabase SQL Editor**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `vqftrdxexmsdvhbbyjff`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

## **Step 2: Execute Migration Script**

Copy and paste this entire SQL script:

```sql
-- Milestone 3: MCP Enforcement System - Clean Deployment
-- This script safely adds the new enforcement tables without conflicts

-- 1. Create PolicyBundle table
CREATE TABLE IF NOT EXISTS "PolicyBundle" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "version" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "bundleHash" TEXT NOT NULL,
  "signature" TEXT,
  "signerId" TEXT,
  "storageUrl" TEXT NOT NULL,
  "bundleSize" INTEGER NOT NULL,
  "buildLogs" TEXT,
  "metadata" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "publishedAt" TIMESTAMP(3),
  "activatedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  CONSTRAINT "PolicyBundle_pkey" PRIMARY KEY ("id")
);

-- 2. Create GatewayToken table
CREATE TABLE IF NOT EXISTS "GatewayToken" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "tokenId" TEXT NOT NULL,
  "artifactId" TEXT NOT NULL,
  "artifactType" TEXT NOT NULL,
  "loaLevel" INTEGER NOT NULL,
  "scope" TEXT[] NOT NULL,
  "bundleVersion" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "issuedBy" TEXT NOT NULL,
  "issuedFor" TEXT,
  CONSTRAINT "GatewayToken_pkey" PRIMARY KEY ("id")
);

-- 3. Create EnforcementCall table
CREATE TABLE IF NOT EXISTS "EnforcementCall" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "tokenId" TEXT,
  "upstreamId" TEXT NOT NULL,
  "method" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "result" TEXT NOT NULL,
  "decisionReason" TEXT,
  "metadata" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EnforcementCall_pkey" PRIMARY KEY ("id")
);

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS "idx_policy_bundle_org" ON "PolicyBundle"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_policy_bundle_status" ON "PolicyBundle"("status");
CREATE INDEX IF NOT EXISTS "idx_policy_bundle_version" ON "PolicyBundle"("version");
CREATE INDEX IF NOT EXISTS "idx_policy_bundle_hash" ON "PolicyBundle"("bundleHash");

CREATE INDEX IF NOT EXISTS "idx_gateway_token_org" ON "GatewayToken"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_gateway_token_id" ON "GatewayToken"("tokenId");
CREATE INDEX IF NOT EXISTS "idx_gateway_token_artifact" ON "GatewayToken"("artifactId");
CREATE INDEX IF NOT EXISTS "idx_gateway_token_expires" ON "GatewayToken"("expiresAt");
CREATE INDEX IF NOT EXISTS "idx_gateway_token_revoked" ON "GatewayToken"("revokedAt");

CREATE INDEX IF NOT EXISTS "idx_enforcement_call_org" ON "EnforcementCall"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_enforcement_call_token" ON "EnforcementCall"("tokenId");
CREATE INDEX IF NOT EXISTS "idx_enforcement_call_upstream" ON "EnforcementCall"("upstreamId");
CREATE INDEX IF NOT EXISTS "idx_enforcement_call_result" ON "EnforcementCall"("result");
CREATE INDEX IF NOT EXISTS "idx_enforcement_call_created" ON "EnforcementCall"("createdAt");

-- 5. Add unique constraints
ALTER TABLE "PolicyBundle" ADD CONSTRAINT "PolicyBundle_bundleHash_key" UNIQUE ("bundleHash");
ALTER TABLE "GatewayToken" ADD CONSTRAINT "GatewayToken_tokenId_key" UNIQUE ("tokenId");

-- 6. Add check constraints
ALTER TABLE "PolicyBundle" ADD CONSTRAINT "PolicyBundle_status_check" 
  CHECK ("status" IN ('DRAFT', 'PUBLISHED', 'ACTIVE', 'REVOKED'));

ALTER TABLE "EnforcementCall" ADD CONSTRAINT "EnforcementCall_result_check" 
  CHECK ("result" IN ('ALLOW', 'DENY', 'ERROR'));

-- 7. Add foreign key constraints (only if tables exist)
DO $$
BEGIN
  -- PolicyBundle foreign keys
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Organization') THEN
    ALTER TABLE "PolicyBundle" ADD CONSTRAINT "PolicyBundle_organizationId_fkey" 
      FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'RoleAgent') THEN
    ALTER TABLE "PolicyBundle" ADD CONSTRAINT "PolicyBundle_signerId_fkey" 
      FOREIGN KEY ("signerId") REFERENCES "RoleAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  
  -- GatewayToken foreign keys
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Organization') THEN
    ALTER TABLE "GatewayToken" ADD CONSTRAINT "GatewayToken_organizationId_fkey" 
      FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'RoleAgent') THEN
    ALTER TABLE "GatewayToken" ADD CONSTRAINT "GatewayToken_issuedBy_fkey" 
      FOREIGN KEY ("issuedBy") REFERENCES "RoleAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  
  -- EnforcementCall foreign keys
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Organization') THEN
    ALTER TABLE "EnforcementCall" ADD CONSTRAINT "EnforcementCall_organizationId_fkey" 
      FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'GatewayToken') THEN
    ALTER TABLE "EnforcementCall" ADD CONSTRAINT "EnforcementCall_tokenId_fkey" 
      FOREIGN KEY ("tokenId") REFERENCES "GatewayToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- 8. Success message
SELECT 'Milestone 3: MCP Enforcement System deployed successfully!' as status;
```

## **Step 3: Execute and Verify**

1. **Click Run** in the SQL Editor
2. **Wait for completion** (should take 10-30 seconds)
3. **Look for success message**: "Milestone 3: MCP Enforcement System deployed successfully!"

## **Step 4: Verify Table Creation**

Run this verification query:

```sql
-- Verify tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name IN ('PolicyBundle', 'GatewayToken', 'EnforcementCall')
ORDER BY table_name;
```

**Expected Result**: 3 tables should be listed.

## **✅ PHASE B COMPLETION CHECKLIST**

- [ ] SQL migration executed successfully
- [ ] Success message displayed
- [ ] PolicyBundle table created
- [ ] GatewayToken table created
- [ ] EnforcementCall table created
- [ ] All indexes created
- [ ] All constraints applied
- [ ] Verification query shows 3 tables

## **🚀 NEXT: PHASE C - Basic Functionality**

Once Phase B is complete, we'll test:
- API endpoint responses
- Token issuance
- Bundle creation
- Basic enforcement functionality

**Complete Phase B first, then let me know to proceed with Phase C!**
