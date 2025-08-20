-- Simple migration to convert one table at a time
-- Start with blockchain_transactions

-- Step 1: Update blockchain_transactions with enum values
UPDATE "blockchain_transactions" SET 
  "status" = CASE 
    WHEN "statusNew" = 'pending' THEN 'pending'
    WHEN "statusNew" = 'confirmed' THEN 'confirmed'
    WHEN "statusNew" = 'failed' THEN 'failed'
    ELSE 'pending'
  END
WHERE "statusNew" IS NOT NULL;

UPDATE "blockchain_transactions" SET 
  "transactionType" = CASE 
    WHEN "transactionTypeNew" = 'NFT_MINT' THEN 'NFT_MINT'
    WHEN "transactionTypeNew" = 'TRANSFER' THEN 'TRANSFER'
    WHEN "transactionTypeNew" = 'OTHER' THEN 'OTHER'
    ELSE NULL
  END
WHERE "transactionTypeNew" IS NOT NULL;

-- Step 2: Update role_agents with enum values
UPDATE "role_agents" SET 
  "status" = CASE 
    WHEN "statusNew" = 'active' THEN 'active'
    WHEN "statusNew" = 'inactive' THEN 'inactive'
    WHEN "statusNew" = 'suspended' THEN 'suspended'
    WHEN "statusNew" = 'retired' THEN 'retired'
    ELSE 'active'
  END
WHERE "statusNew" IS NOT NULL;

-- Step 3: Update loa_policies with enum values
UPDATE "loa_policies" SET 
  "artifactType" = CASE 
    WHEN "artifactTypeNew" = 'RoleAgent' THEN 'RoleAgent'
    WHEN "artifactTypeNew" = 'MCP' THEN 'MCP'
    ELSE 'RoleAgent'
  END
WHERE "artifactTypeNew" IS NOT NULL;

-- Step 4: Update approvals with enum values
UPDATE "approvals" SET 
  "artifactType" = CASE 
    WHEN "artifactTypeNew" = 'RoleAgent' THEN 'RoleAgent'
    WHEN "artifactTypeNew" = 'MCP' THEN 'MCP'
    ELSE 'RoleAgent'
  END
WHERE "artifactTypeNew" IS NOT NULL;

UPDATE "approvals" SET 
  "facet" = CASE 
    WHEN "facetNew" = 'security' THEN 'security'
    WHEN "facetNew" = 'compliance' THEN 'compliance'
    WHEN "facetNew" = 'policy' THEN 'policy'
    WHEN "facetNew" = 'risk' THEN 'risk'
    ELSE 'security'
  END
WHERE "facetNew" IS NOT NULL;

UPDATE "approvals" SET 
  "decision" = CASE 
    WHEN "decisionNew" = 'approve' THEN 'approve'
    WHEN "decisionNew" = 'reject' THEN 'reject'
    ELSE 'approve'
  END
WHERE "decisionNew" IS NOT NULL;

-- Step 5: Update mcp_policies with enum values
UPDATE "mcp_policies" SET 
  "status" = CASE 
    WHEN "statusNew" = 'draft' THEN 'draft'
    WHEN "statusNew" = 'active' THEN 'active'
    WHEN "statusNew" = 'archived' THEN 'archived'
    ELSE 'draft'
  END
WHERE "statusNew" IS NOT NULL;
