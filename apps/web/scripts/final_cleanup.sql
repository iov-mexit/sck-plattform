-- Final cleanup: Drop old columns and rename new ones to final names

-- 1. blockchain_transactions
ALTER TABLE "blockchain_transactions" DROP COLUMN "status";
ALTER TABLE "blockchain_transactions" DROP COLUMN "transactionType";
ALTER TABLE "blockchain_transactions" RENAME COLUMN "statusNew" TO "status";
ALTER TABLE "blockchain_transactions" RENAME COLUMN "transactionTypeNew" TO "transactionType";

-- 2. role_agents
ALTER TABLE "role_agents" DROP COLUMN "status";
ALTER TABLE "role_agents" RENAME COLUMN "statusNew" TO "status";

-- 3. loa_policies
ALTER TABLE "loa_policies" DROP COLUMN "artifactType";
ALTER TABLE "loa_policies" DROP COLUMN "requiredFacets";
ALTER TABLE "loa_policies" RENAME COLUMN "artifactTypeNew" TO "artifactType";
ALTER TABLE "loa_policies" RENAME COLUMN "requiredFacetsNew" TO "requiredFacets";

-- 4. approvals
ALTER TABLE "approvals" DROP COLUMN "artifactType";
ALTER TABLE "approvals" DROP COLUMN "facet";
ALTER TABLE "approvals" DROP COLUMN "decision";
ALTER TABLE "approvals" RENAME COLUMN "artifactTypeNew" TO "artifactType";
ALTER TABLE "approvals" RENAME COLUMN "facetNew" TO "facet";
ALTER TABLE "approvals" RENAME COLUMN "decisionNew" TO "decision";

-- 5. mcp_policies
ALTER TABLE "mcp_policies" DROP COLUMN "status";
ALTER TABLE "mcp_policies" RENAME COLUMN "statusNew" TO "status";

-- Add missing constraints
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_artifactId_artifactType_reviewerId_facet_key" 
    UNIQUE ("artifactId", "artifactType", "reviewerId", "facet");

ALTER TABLE "mcp_policies" ADD CONSTRAINT "mcp_policies_organizationId_name_version_key" 
    UNIQUE ("organizationId", "name", "version");

-- Add missing foreign key for mcp_policy_tests
ALTER TABLE "mcp_policy_tests" ADD CONSTRAINT "mcp_policy_tests_policyId_fkey" 
    FOREIGN KEY ("policyId") REFERENCES "mcp_policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
