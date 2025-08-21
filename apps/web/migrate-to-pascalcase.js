#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapping of old snake_case names to new PascalCase names
const modelMappings = {
  'prisma.role_agents': 'prisma.roleAgent',
  'prisma.organizations': 'prisma.organization',
  'prisma.role_templates': 'prisma.roleTemplate',
  'prisma.role_trust_thresholds': 'prisma.roleTrustThreshold',
  'prisma.signals': 'prisma.signal',
  'prisma.certifications': 'prisma.certification',
  'prisma.blockchain_transactions': 'prisma.blockchainTransaction',
  'prisma.audit_logs': 'prisma.auditLog',
  'prisma.loa_policies': 'prisma.loaPolicy',
  'prisma.approvals': 'prisma.approval',
  'prisma.mcp_policies': 'prisma.mcpPolicy',
  'prisma.mcp_policy_tests': 'prisma.mcpPolicyTest',
  'prisma.organization_members': 'prisma.organizationMember',
  'prisma.trust_histories': 'prisma.trustHistory',
  
  // Include relationships
  'role_templates': 'roleTemplate',
  'organizations': 'organization',
  'role_agents': 'roleAgent',
  'blockchain_transactions': 'blockchainTransaction',
  'audit_logs': 'auditLog',
  'trust_histories': 'trustHistory',
  'organization_members': 'organizationMember',
  'role_trust_thresholds': 'roleTrustThreshold',
  'loa_policies': 'loaPolicy',
  'mcp_policies': 'mcpPolicy',
  'mcp_policy_tests': 'mcpPolicyTest',
  
  // Field mappings
  'idx_role_threshold_org_role': 'organizationId_roleTitle'
};

// Files to update
const filesToUpdate = [
  'app/api/v1/approvals/[artifactType]/[artifactId]/route.ts',
  'app/api/v1/health/route.ts',
  'app/api/v1/mcp/policies/route.ts',
  'app/api/v1/nft/mint/route.ts',
  'app/api/v1/nft/reset/route.ts',
  'app/api/v1/organizations/route.ts',
  'app/api/v1/role-agents/[id]/register-ans/route.ts',
  'app/api/v1/role-agents/[id]/route.ts',
  'app/api/v1/role-agents/migrate/route.ts',
  'app/api/v1/role-agents/test-route.ts',
  'app/api/v1/role-agents/update-terminology/route.ts',
  'app/api/v1/signals/trust-score/route.ts',
  'app/api/v1/test-db/route.ts',
  'app/api/v1/trust/validate/route.ts',
  'check-db.ts',
  'lib/signal-collection.ts',
  'seed-comprehensive-26.ts',
  'seed-comprehensive-trust-thresholds.ts',
  'seed-trust-thresholds.ts'
];

function updateFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;

    // Apply all mappings
    for (const [oldName, newName] of Object.entries(modelMappings)) {
      if (content.includes(oldName)) {
        content = content.replace(new RegExp(oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newName);
        updated = true;
        console.log(`  ✅ Updated: ${oldName} → ${newName}`);
      }
    }

    if (updated) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`ℹ️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🚀 Starting PascalCase migration...\n');

filesToUpdate.forEach(filePath => {
  console.log(`📁 Processing: ${filePath}`);
  updateFile(filePath);
  console.log('');
});

console.log('🎉 Migration complete!');
console.log('\nNext steps:');
console.log('1. Run: npx prisma generate');
console.log('2. Run: npm run type-check');
console.log('3. Test the application');
