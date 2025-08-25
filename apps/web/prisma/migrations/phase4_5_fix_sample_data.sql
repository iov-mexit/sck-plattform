-- Fix Phase 4 & 5 sample data insertion
-- This script fixes the timestamp constraint violations

-- Clean up any failed sample data
DELETE FROM "PolicyComponent" WHERE "id" IN ('comp_sample_1', 'comp_sample_2', 'comp_sample_3');
DELETE FROM "TrustToken" WHERE "id" = 'token_sample';

-- Insert corrected sample data for testing
INSERT INTO "PolicyComponent" ("id", "name", "description", "type", "complexity", "organizationId", "createdAt", "updatedAt", "createdBy", "status", "regoCode") VALUES
('comp_sample_1', 'Access Control', 'Basic access control policy', 'ACCESS_CONTROL', 1, 'org_sample', NOW(), NOW(), 'user_sample', 'ACTIVE', 'package access_control'),
('comp_sample_2', 'Data Privacy', 'GDPR compliance policy', 'PRIVACY', 2, 'org_sample', NOW(), NOW(), 'user_sample', 'ACTIVE', 'package data_privacy'),
('comp_sample_3', 'Security Audit', 'Security audit logging policy', 'AUDIT', 1, 'org_sample', NOW(), NOW(), 'user_sample', 'ACTIVE', 'package security_audit');

-- Insert corrected sample trust token
INSERT INTO "TrustToken" ("id", "symbol", "name", "totalSupply", "circulatingSupply", "contractAddress", "network", "organizationId", "createdAt", "updatedAt") VALUES
('token_sample', 'TRUST', 'Trust Token', '1000000', '0', '0x1234567890123456789012345678901234567890', 'ethereum', 'org_sample', NOW(), NOW());

-- Verify the data was inserted correctly
SELECT 'PolicyComponent' as table_name, COUNT(*) as record_count FROM "PolicyComponent"
UNION ALL
SELECT 'TrustToken' as table_name, COUNT(*) as record_count FROM "TrustToken";
