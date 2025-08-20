# Migration Plan: Current Schema → Improved Schema

## 📊 Current Database State
Based on existing migrations, the database currently has:
- `audit_logs` (basic structure)
- `blockchain_transactions` (with string status)
- `certifications` (basic structure)
- `role_agents` (with string status)
- `organizations` (basic structure)
- `role_templates` (basic structure)
- `role_trust_thresholds` (basic structure)
- `signals` (basic structure)
- `loa_policies` (basic structure)
- `approvals` (basic structure)
- `mcp_policies` (basic structure)
- `mcp_policy_tests` (basic structure)

## 🚀 Target Schema Improvements

### 1. **New ENUMs to Create**
```sql
-- Create new enum types
CREATE TYPE "BlockchainTxStatus" AS ENUM ('pending', 'confirmed', 'failed');
CREATE TYPE "BlockchainTxType" AS ENUM ('NFT_MINT', 'TRANSFER', 'OTHER');
CREATE TYPE "RoleAgentStatus" AS ENUM ('active', 'inactive', 'suspended', 'retired');
CREATE TYPE "ArtifactType" AS ENUM ('RoleAgent', 'MCP');
CREATE TYPE "ApprovalFacet" AS ENUM ('security', 'compliance', 'policy', 'risk');
CREATE TYPE "ApprovalDecision" AS ENUM ('approve', 'reject');
CREATE TYPE "PolicyStatus" AS ENUM ('draft', 'active', 'archived');
```

### 2. **New Models to Create**
```sql
-- Create trust_histories table
CREATE TABLE "trust_histories" (
    "id" TEXT NOT NULL,
    "roleAgentId" TEXT NOT NULL,
    "trustScore" DOUBLE PRECISION NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,
    CONSTRAINT "trust_histories_pkey" PRIMARY KEY ("id")
);

-- Create indexes for trust_histories
CREATE INDEX "idx_trust_histories_role_agent" ON "trust_histories"("roleAgentId");
CREATE INDEX "idx_trust_histories_time" ON "trust_histories"("computedAt");
```

### 3. **Schema Alterations**

#### **audit_logs** - Add foreign key columns
```sql
-- Add new columns
ALTER TABLE "audit_logs" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "audit_logs" ADD COLUMN "roleAgentId" TEXT;

-- Add foreign key constraints
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organizationId_fkey" 
    FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_roleAgentId_fkey" 
    FOREIGN KEY ("roleAgentId") REFERENCES "role_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

#### **blockchain_transactions** - Convert status to enum
```sql
-- Create temporary column with new enum type
ALTER TABLE "blockchain_transactions" ADD COLUMN "status_new" "BlockchainTxStatus" DEFAULT 'pending';

-- Update existing data (map string values to enum)
UPDATE "blockchain_transactions" SET "status_new" = 
    CASE 
        WHEN "status" = 'pending' THEN 'pending'::"BlockchainTxStatus"
        WHEN "status" = 'confirmed' THEN 'confirmed'::"BlockchainTxStatus"
        WHEN "status" = 'failed' THEN 'failed'::"BlockchainTxStatus"
        ELSE 'pending'::"BlockchainTxStatus"
    END;

-- Drop old column and rename new one
ALTER TABLE "blockchain_transactions" DROP COLUMN "status";
ALTER TABLE "blockchain_transactions" RENAME COLUMN "status_new" TO "status";

-- Add transactionType column
ALTER TABLE "blockchain_transactions" ADD COLUMN "transactionType" "BlockchainTxType";
```

#### **certifications** - Add verification method
```sql
ALTER TABLE "certifications" ADD COLUMN "verificationMethod" TEXT;
```

#### **role_agents** - Convert status to enum and add new fields
```sql
-- Create temporary status column
ALTER TABLE "role_agents" ADD COLUMN "status_new" "RoleAgentStatus" DEFAULT 'active';

-- Update existing data
UPDATE "role_agents" SET "status_new" = 
    CASE 
        WHEN "status" = 'active' THEN 'active'::"RoleAgentStatus"
        WHEN "status" = 'inactive' THEN 'inactive'::"RoleAgentStatus"
        WHEN "status" = 'suspended' THEN 'suspended'::"RoleAgentStatus"
        WHEN "status" = 'retired' THEN 'retired'::"RoleAgentStatus"
        ELSE 'active'::"RoleAgentStatus"
    END;

-- Drop old column and rename new one
ALTER TABLE "role_agents" DROP COLUMN "status";
ALTER TABLE "role_agents" RENAME COLUMN "status_new" TO "status";

-- Add new fields
ALTER TABLE "role_agents" ADD COLUMN "assignedToUserId" TEXT;
ALTER TABLE "role_agents" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add new indexes
CREATE INDEX "idx_role_agents_assigned_did" ON "role_agents"("assignedToDid");
CREATE INDEX "idx_role_agents_assigned_user" ON "role_agents"("assignedToUserId");
```

#### **organizations** - Add compliance tags
```sql
ALTER TABLE "organizations" ADD COLUMN "complianceTags" JSONB;
```

#### **role_trust_thresholds** - Add LoA level
```sql
ALTER TABLE "role_trust_thresholds" ADD COLUMN "minLoALevel" INTEGER;
```

#### **signals** - Add confidence and source type
```sql
ALTER TABLE "signals" ADD COLUMN "confidence" DOUBLE PRECISION;
ALTER TABLE "signals" ADD COLUMN "sourceType" TEXT;
ALTER TABLE "signals" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
```

#### **loa_policies** - Convert to enums
```sql
-- Create temporary columns
ALTER TABLE "loa_policies" ADD COLUMN "artifactType_new" "ArtifactType";
ALTER TABLE "loa_policies" ADD COLUMN "requiredFacets_new" "ApprovalFacet"[];

-- Update existing data
UPDATE "loa_policies" SET 
    "artifactType_new" = "artifactType"::"ArtifactType",
    "requiredFacets_new" = "requiredFacets"::"ApprovalFacet"[];

-- Drop old columns and rename new ones
ALTER TABLE "loa_policies" DROP COLUMN "artifactType";
ALTER TABLE "loa_policies" DROP COLUMN "requiredFacets";
ALTER TABLE "loa_policies" RENAME COLUMN "artifactType_new" TO "artifactType";
ALTER TABLE "loa_policies" RENAME COLUMN "requiredFacets_new" TO "requiredFacets";

-- Add updatedAt column
ALTER TABLE "loa_policies" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
```

#### **approvals** - Convert to enums
```sql
-- Create temporary columns
ALTER TABLE "approvals" ADD COLUMN "artifactType_new" "ArtifactType";
ALTER TABLE "approvals" ADD COLUMN "facet_new" "ApprovalFacet";
ALTER TABLE "approvals" ADD COLUMN "decision_new" "ApprovalDecision";

-- Update existing data
UPDATE "approvals" SET 
    "artifactType_new" = "artifactType"::"ArtifactType",
    "facet_new" = "facet"::"ApprovalFacet",
    "decision_new" = "decision"::"ApprovalDecision";

-- Drop old columns and rename new ones
ALTER TABLE "approvals" DROP COLUMN "artifactType";
ALTER TABLE "approvals" DROP COLUMN "facet";
ALTER TABLE "approvals" DROP COLUMN "decision";
ALTER TABLE "approvals" RENAME COLUMN "artifactType_new" TO "artifactType";
ALTER TABLE "approvals" RENAME COLUMN "facet_new" TO "facet";
ALTER TABLE "approvals" RENAME COLUMN "decision_new" TO "decision";

-- Add unique constraint
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_artifactId_artifactType_reviewerId_facet_key" 
    UNIQUE ("artifactId", "artifactType", "reviewerId", "facet");
```

#### **mcp_policies** - Convert status to enum
```sql
-- Create temporary status column
ALTER TABLE "mcp_policies" ADD COLUMN "status_new" "PolicyStatus" DEFAULT 'draft';

-- Update existing data
UPDATE "mcp_policies" SET "status_new" = 
    CASE 
        WHEN "status" = 'draft' THEN 'draft'::"PolicyStatus"
        WHEN "status" = 'active' THEN 'active'::"PolicyStatus"
        WHEN "status" = 'archived' THEN 'archived'::"PolicyStatus"
        ELSE 'draft'::"PolicyStatus"
    END;

-- Drop old column and rename new one
ALTER TABLE "mcp_policies" DROP COLUMN "status";
ALTER TABLE "mcp_policies" RENAME COLUMN "status_new" TO "status";

-- Add unique constraint
ALTER TABLE "mcp_policies" ADD CONSTRAINT "mcp_policies_organizationId_name_version_key" 
    UNIQUE ("organizationId", "name", "version");
```

### 4. **Add Missing Foreign Key Constraints**
```sql
-- Add missing foreign key for mcp_policy_tests
ALTER TABLE "mcp_policy_tests" ADD CONSTRAINT "mcp_policy_tests_policyId_fkey" 
    FOREIGN KEY ("policyId") REFERENCES "mcp_policies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### 5. **Update All ID Fields to Use cuid()**
```sql
-- This would require updating all existing records to use cuid() format
-- This is a breaking change and should be done carefully
-- Consider if this is really necessary or if existing IDs can be preserved
```

## ⚠️ **Migration Risks & Considerations**

### **Breaking Changes**
1. **Enum conversions** - Existing string data must map to valid enum values
2. **ID format changes** - If switching to cuid(), all existing IDs change
3. **Foreign key additions** - May fail if existing data violates constraints

### **Data Migration Strategy**
1. **Backup database** before starting
2. **Test migration** on copy of production data
3. **Downtime planning** - Some changes require table locks
4. **Rollback plan** - Keep old columns temporarily

### **Recommended Approach**
1. **Phase 1**: Add new columns and enums (non-breaking)
2. **Phase 2**: Migrate data to new columns
3. **Phase 3**: Drop old columns and add constraints
4. **Phase 4**: Update application code to use new schema

## 🚀 **Next Steps**
1. **Review this plan** for accuracy
2. **Test migration** on development database
3. **Schedule production migration** during maintenance window
4. **Update application code** to use new enum types
5. **Verify data integrity** after migration

This migration will transform the schema from a basic structure to a production-ready, type-safe system with proper foreign keys, enums, and audit trails.
