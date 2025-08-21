-- Migration: Rename tables from snake_case to PascalCase
-- This preserves all data while updating table names

-- Rename tables to PascalCase singular
ALTER TABLE "audit_logs" RENAME TO "AuditLog";
ALTER TABLE "blockchain_transactions" RENAME TO "BlockchainTransaction";
ALTER TABLE "certifications" RENAME TO "Certification";
ALTER TABLE "role_agents" RENAME TO "RoleAgent";
ALTER TABLE "trust_histories" RENAME TO "TrustHistory";
ALTER TABLE "organization_members" RENAME TO "OrganizationMember";
ALTER TABLE "organizations" RENAME TO "Organization";
ALTER TABLE "role_templates" RENAME TO "RoleTemplate";
ALTER TABLE "role_trust_thresholds" RENAME TO "RoleTrustThreshold";
ALTER TABLE "signals" RENAME TO "Signal";
ALTER TABLE "loa_policies" RENAME TO "LoaPolicy";
ALTER TABLE "approvals" RENAME TO "Approval";
ALTER TABLE "mcp_policies" RENAME TO "McpPolicy";
ALTER TABLE "mcp_policy_tests" RENAME TO "McpPolicyTest";

-- Update foreign key constraints to reference new table names
-- Note: PostgreSQL will automatically update the constraint names

-- Update indexes to reference new table names
-- The existing index names will work with the new table names
