-- Milestone 3: MCP Enforcement System Tables
-- This migration adds the enforcement infrastructure for policy bundles, gateway tokens, and enforcement calls

-- Policy Bundle Management
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

-- Gateway Token Management
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

-- Enforcement Call Logging
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

-- Add foreign key constraints
ALTER TABLE "PolicyBundle" ADD CONSTRAINT "PolicyBundle_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PolicyBundle" ADD CONSTRAINT "PolicyBundle_signerId_fkey" 
  FOREIGN KEY ("signerId") REFERENCES "role_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "GatewayToken" ADD CONSTRAINT "GatewayToken_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "GatewayToken" ADD CONSTRAINT "GatewayToken_issuedBy_fkey" 
  FOREIGN KEY ("issuedBy") REFERENCES "role_agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "EnforcementCall" ADD CONSTRAINT "EnforcementCall_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "EnforcementCall" ADD CONSTRAINT "EnforcementCall_tokenId_fkey" 
  FOREIGN KEY ("tokenId") REFERENCES "GatewayToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add indexes for performance
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

-- Add unique constraints
ALTER TABLE "PolicyBundle" ADD CONSTRAINT "PolicyBundle_bundleHash_key" UNIQUE ("bundleHash");
ALTER TABLE "GatewayToken" ADD CONSTRAINT "GatewayToken_tokenId_key" UNIQUE ("tokenId");

-- Add check constraints
ALTER TABLE "PolicyBundle" ADD CONSTRAINT "PolicyBundle_status_check" 
  CHECK ("status" IN ('DRAFT', 'PUBLISHED', 'ACTIVE', 'REVOKED'));

ALTER TABLE "EnforcementCall" ADD CONSTRAINT "EnforcementCall_result_check" 
  CHECK ("result" IN ('ALLOW', 'DENY', 'ERROR'));
