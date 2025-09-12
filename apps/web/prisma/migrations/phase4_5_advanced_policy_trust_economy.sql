-- Phase 4 & 5: Advanced Policy Management & Trust Economy Integration
-- This migration adds tables for advanced policy composition and trust economy features

-- Policy Components for advanced composition
CREATE TABLE IF NOT EXISTS "PolicyComponent" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type" TEXT NOT NULL,
  "complexity" INTEGER DEFAULT 1,
  "dependencies" JSONB,
  "organizationId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdBy" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "regoCode" TEXT,
  "metadata" JSONB,

  CONSTRAINT "PolicyComponent_pkey" PRIMARY KEY ("id")
);

-- Policy Dependencies for complex policy relationships
CREATE TABLE IF NOT EXISTS "PolicyDependency" (
  "id" TEXT NOT NULL,
  "sourceComponentId" TEXT NOT NULL,
  "targetComponentId" TEXT NOT NULL,
  "dependencyType" TEXT NOT NULL,
  "strength" TEXT NOT NULL DEFAULT 'MEDIUM',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PolicyDependency_pkey" PRIMARY KEY ("id")
);

-- Policy Compositions for complex policy management
CREATE TABLE IF NOT EXISTS "PolicyComposition" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "organizationId" TEXT NOT NULL,
  "complexity" TEXT NOT NULL DEFAULT 'SIMPLE',
  "estimatedEnforcementTime" INTEGER,
  "complianceScore" INTEGER DEFAULT 100,
  "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdBy" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,

  CONSTRAINT "PolicyComposition_pkey" PRIMARY KEY ("id")
);

-- Trust Tokens for the trust economy
CREATE TABLE IF NOT EXISTS "TrustToken" (
  "id" TEXT NOT NULL,
  "symbol" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "totalSupply" TEXT NOT NULL,
  "circulatingSupply" TEXT NOT NULL DEFAULT '0',
  "decimals" INTEGER NOT NULL DEFAULT 18,
  "contractAddress" TEXT NOT NULL,
  "network" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TrustToken_pkey" PRIMARY KEY ("id")
);

-- Trust Rewards for incentivizing positive actions
CREATE TABLE IF NOT EXISTS "TrustReward" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "rewardType" TEXT NOT NULL,
  "amount" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "claimedAt" TIMESTAMP(3),
  "transactionHash" TEXT,

  CONSTRAINT "TrustReward_pkey" PRIMARY KEY ("id")
);

-- Micropayments for the trust economy
CREATE TABLE IF NOT EXISTS "Micropayment" (
  "id" TEXT NOT NULL,
  "fromUserId" TEXT NOT NULL,
  "toUserId" TEXT NOT NULL,
  "amount" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "transactionHash" TEXT,
  "blockNumber" INTEGER,
  "gasUsed" TEXT,
  "gasPrice" TEXT,

  CONSTRAINT "Micropayment_pkey" PRIMARY KEY ("id")
);

-- Trust Marketplace for credential trading
CREATE TABLE IF NOT EXISTS "TrustMarketplace" (
  "id" TEXT NOT NULL,
  "credentialId" TEXT NOT NULL,
  "sellerId" TEXT NOT NULL,
  "price" TEXT NOT NULL,
  "currency" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "trustScore" INTEGER NOT NULL,
  "verificationStatus" TEXT NOT NULL DEFAULT 'UNVERIFIED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "views" INTEGER NOT NULL DEFAULT 0,
  "favorites" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "TrustMarketplace_pkey" PRIMARY KEY ("id")
);

-- Policy Performance Metrics for analytics
CREATE TABLE IF NOT EXISTS "PolicyPerformance" (
  "id" TEXT NOT NULL,
  "policyId" TEXT NOT NULL,
  "enforcementCount" INTEGER NOT NULL DEFAULT 0,
  "averageResponseTime" INTEGER NOT NULL DEFAULT 0,
  "complianceRate" INTEGER NOT NULL DEFAULT 100,
  "riskIncidents" INTEGER NOT NULL DEFAULT 0,
  "costPerEnforcement" DECIMAL(10,6) NOT NULL DEFAULT 0,
  "userSatisfaction" INTEGER NOT NULL DEFAULT 0,
  "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "period" TEXT NOT NULL DEFAULT 'DAILY',

  CONSTRAINT "PolicyPerformance_pkey" PRIMARY KEY ("id")
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_policy_component_org" ON "PolicyComponent"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_policy_component_type" ON "PolicyComponent"("type");
CREATE INDEX IF NOT EXISTS "idx_policy_component_status" ON "PolicyComponent"("status");

CREATE INDEX IF NOT EXISTS "idx_policy_dependency_source" ON "PolicyDependency"("sourceComponentId");
CREATE INDEX IF NOT EXISTS "idx_policy_dependency_target" ON "PolicyDependency"("targetComponentId");

CREATE INDEX IF NOT EXISTS "idx_policy_composition_org" ON "PolicyComposition"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_policy_composition_complexity" ON "PolicyComposition"("complexity");
CREATE INDEX IF NOT EXISTS "idx_policy_composition_status" ON "PolicyComposition"("status");

CREATE INDEX IF NOT EXISTS "idx_trust_token_org" ON "TrustToken"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_trust_token_symbol" ON "TrustToken"("symbol");
CREATE INDEX IF NOT EXISTS "idx_trust_token_contract" ON "TrustToken"("contractAddress");

CREATE INDEX IF NOT EXISTS "idx_trust_reward_user" ON "TrustReward"("userId");
CREATE INDEX IF NOT EXISTS "idx_trust_reward_org" ON "TrustReward"("organizationId");
CREATE INDEX IF NOT EXISTS "idx_trust_reward_status" ON "TrustReward"("status");

CREATE INDEX IF NOT EXISTS "idx_micropayment_from" ON "Micropayment"("fromUserId");
CREATE INDEX IF NOT EXISTS "idx_micropayment_to" ON "Micropayment"("toUserId");
CREATE INDEX IF NOT EXISTS "idx_micropayment_status" ON "Micropayment"("status");
CREATE INDEX IF NOT EXISTS "idx_micropayment_currency" ON "Micropayment"("currency");

CREATE INDEX IF NOT EXISTS "idx_trust_marketplace_credential" ON "TrustMarketplace"("credentialId");
CREATE INDEX IF NOT EXISTS "idx_trust_marketplace_seller" ON "TrustMarketplace"("sellerId");
CREATE INDEX IF NOT EXISTS "idx_trust_marketplace_status" ON "TrustMarketplace"("status");
CREATE INDEX IF NOT EXISTS "idx_trust_marketplace_trust_score" ON "TrustMarketplace"("trustScore");

CREATE INDEX IF NOT EXISTS "idx_policy_performance_policy" ON "PolicyPerformance"("policyId");
CREATE INDEX IF NOT EXISTS "idx_policy_performance_period" ON "PolicyPerformance"("period");

-- Add foreign key constraints
ALTER TABLE "PolicyComponent" ADD CONSTRAINT "PolicyComponent_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PolicyDependency" ADD CONSTRAINT "PolicyDependency_sourceComponentId_fkey" 
  FOREIGN KEY ("sourceComponentId") REFERENCES "PolicyComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PolicyDependency" ADD CONSTRAINT "PolicyDependency_targetComponentId_fkey" 
  FOREIGN KEY ("targetComponentId") REFERENCES "PolicyComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PolicyComposition" ADD CONSTRAINT "PolicyComposition_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TrustToken" ADD CONSTRAINT "TrustToken_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TrustReward" ADD CONSTRAINT "TrustReward_organizationId_fkey" 
  FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TrustMarketplace" ADD CONSTRAINT "TrustMarketplace_credentialId_fkey" 
  FOREIGN KEY ("credentialId") REFERENCES "role_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add unique constraints
ALTER TABLE "PolicyComponent" ADD CONSTRAINT "PolicyComponent_org_name_version_key" 
  UNIQUE ("organizationId", "name", "version");

ALTER TABLE "TrustToken" ADD CONSTRAINT "TrustToken_org_symbol_key" 
  UNIQUE ("organizationId", "symbol");

ALTER TABLE "TrustToken" ADD CONSTRAINT "TrustToken_contract_address_key" 
  UNIQUE ("contractAddress");

-- Insert sample data for testing
INSERT INTO "PolicyComponent" ("id", "name", "description", "type", "complexity", "organizationId", "createdBy", "status", "regoCode") VALUES
('comp_sample_1', 'Access Control', 'Basic access control policy', 'ACCESS_CONTROL', 1, 'org_sample', 'user_sample', 'ACTIVE', 'package access_control'),
('comp_sample_2', 'Data Privacy', 'GDPR compliance policy', 'PRIVACY', 2, 'org_sample', 'user_sample', 'ACTIVE', 'package data_privacy'),
('comp_sample_3', 'Security Audit', 'Security audit logging policy', 'AUDIT', 1, 'org_sample', 'user_sample', 'ACTIVE', 'package security_audit');

-- Insert sample trust token
INSERT INTO "TrustToken" ("id", "symbol", "name", "totalSupply", "circulatingSupply", "contractAddress", "network", "organizationId") VALUES
('token_sample', 'TRUST', 'Trust Token', '1000000', '0', '0x1234567890123456789012345678901234567890', 'ethereum', 'org_sample');

-- Add comments for documentation
COMMENT ON TABLE "PolicyComponent" IS 'Reusable policy components for advanced policy composition';
COMMENT ON TABLE "PolicyDependency" IS 'Dependencies between policy components';
COMMENT ON TABLE "PolicyComposition" IS 'Complex policies composed from multiple components';
COMMENT ON TABLE "TrustToken" IS 'Organization-specific trust tokens for the trust economy';
COMMENT ON TABLE "TrustReward" IS 'Trust token rewards for positive actions';
COMMENT ON TABLE "Micropayment" IS 'Micropayments in the trust economy';
COMMENT ON TABLE "TrustMarketplace" IS 'Marketplace for trading trust credentials';
COMMENT ON TABLE "PolicyPerformance" IS 'Performance metrics for policy enforcement';
