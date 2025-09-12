-- Create test organization and sample data for Phase 4 & 5
-- This script creates the necessary test data for development

INSERT INTO "organizations" ("id", "name", "description", "domain", "createdAt", "updatedAt", "isActive", "onboardingComplete") VALUES
('org_test_phase4_5', 'Test Organization Phase 4-5', 'Test organization for Phase 4 and 5 features', 'test-phase4-5.com', NOW(), NOW(), true, true)
ON CONFLICT (id) DO NOTHING;

-- Create test organization member
INSERT INTO "OrganizationMember" ("id", "organizationId", "name", "email", "role", "isActive", "createdAt", "updatedAt") VALUES
('member_test_phase4_5', 'org_test_phase4_5', 'Test User Phase 4-5', 'test@phase4-5.com', 'ADMIN', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample policy components
INSERT INTO "PolicyComponent" ("id", "name", "description", "type", "complexity", "organizationId", "createdAt", "updatedAt", "createdBy", "status", "regoCode") VALUES
('comp_test_1', 'Access Control', 'Basic access control policy', 'ACCESS_CONTROL', 1, 'org_test_phase4_5', NOW(), NOW(), 'member_test_phase4_5', 'ACTIVE', 'package access_control'),
('comp_test_2', 'Data Privacy', 'GDPR compliance policy', 'PRIVACY', 2, 'org_test_phase4_5', NOW(), NOW(), 'member_test_phase4_5', 'ACTIVE', 'package data_privacy'),
('comp_test_3', 'Security Audit', 'Security audit logging policy', 'AUDIT', 1, 'org_test_phase4_5', NOW(), NOW(), 'member_test_phase4_5', 'ACTIVE', 'package security_audit')
ON CONFLICT (id) DO NOTHING;

-- Insert sample trust token
INSERT INTO "TrustToken" ("id", "symbol", "name", "totalSupply", "circulatingSupply", "contractAddress", "network", "organizationId", "createdAt", "updatedAt") VALUES
('token_test_1', 'TRUST', 'Test Trust Token', '1000000', '0', '0x1234567890123456789012345678901234567890', 'ethereum', 'org_test_phase4_5', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

SELECT 'Organization' as table_name, COUNT(*) as record_count FROM "organizations" WHERE "id" = 'org_test_phase4_5'
UNION ALL
SELECT 'OrganizationMember' as table_name, COUNT(*) as record_count FROM "OrganizationMember" WHERE "id" = 'member_test_phase4_5'
UNION ALL
SELECT 'PolicyComponent' as table_name, COUNT(*) as record_count FROM "PolicyComponent" WHERE "organizationId" = 'org_test_phase4_5'
UNION ALL
SELECT 'TrustToken' as table_name, COUNT(*) as record_count FROM "TrustToken" WHERE "organizationId" = 'org_test_phase4_5';
