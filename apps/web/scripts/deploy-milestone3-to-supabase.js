const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.production' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration. Check .env.production');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deployMilestone3() {
  console.log('🚀 Deploying Milestone 3: MCP Enforcement System to Supabase...');
  
  try {
    // Read the SQL migration file
    const fs = require('fs');
    const sqlPath = './prisma/migrations/milestone3_enforcement_tables.sql';
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📋 Executing Milestone 3 SQL migration...');
    
    // Execute the SQL via Supabase RPC
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('❌ SQL execution failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Milestone 3 enforcement tables deployed successfully!');
    console.log('📊 Tables created:');
    console.log('  - PolicyBundle (policy management)');
    console.log('  - GatewayToken (access control)');
    console.log('  - EnforcementCall (audit logging)');
    console.log('  - All indexes and constraints');
    
    console.log('\n🔧 Next steps:');
    console.log('  1. Test policy bundle compilation');
    console.log('  2. Verify gateway token issuance');
    console.log('  3. Test HMAC verification');
    console.log('  4. Monitor enforcement calls');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deployMilestone3();
