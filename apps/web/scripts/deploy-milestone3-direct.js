const { createClient } = require('@supabase/supabase-js');

// Use the Supabase configuration from your vercel.json
const supabaseUrl = "https://vqftrdxexmsdvhbbyjff.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

if (!supabaseServiceKey || supabaseServiceKey === "your-service-role-key") {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.error('Please set SUPABASE_SERVICE_ROLE_KEY with your service role key');
  console.error('You can find this in your Supabase dashboard under Settings > API');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deployMilestone3Direct() {
  console.log('🚀 Deploying Milestone 3: MCP Enforcement System to Supabase...');
  console.log(`📡 Target: ${supabaseUrl}`);

  try {
    // Read the SQL migration file
    const fs = require('fs');
    const sqlPath = './prisma/migrations/milestone3_enforcement_tables.sql';
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📋 Executing Milestone 3 SQL migration...');
    console.log('📊 This will create:');
    console.log('  - PolicyBundle table (policy management)');
    console.log('  - GatewayToken table (access control)');
    console.log('  - EnforcementCall table (audit logging)');
    console.log('  - All indexes and constraints');

    // Execute the SQL via Supabase RPC
    const { data, error } = await supabase.rpc('exec_sql', { sql });

    if (error) {
      console.error('❌ SQL execution failed:', error);
      console.error('\n🔧 Troubleshooting:');
      console.error('1. Check if SUPABASE_SERVICE_ROLE_KEY is correct');
      console.error('2. Verify the exec_sql RPC function exists in your Supabase instance');
      console.error('3. Ensure your service role has sufficient permissions');
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

    console.log('\n🌐 Your enforcement system is now live at:');
    console.log(`   - Bundle API: ${supabaseUrl.replace('.co', '.app')}/api/v1/enforcement/bundles`);
    console.log(`   - Token API: ${supabaseUrl.replace('.co', '.app')}/api/v1/enforcement/tokens`);
    console.log(`   - Verify API: ${supabaseUrl.replace('.co', '.app')}/api/v1/enforcement/verify`);

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    console.error('\n🔧 Common issues:');
    console.error('1. Network connectivity to Supabase');
    console.error('2. File permissions for SQL migration');
    console.error('3. Supabase RPC function availability');
    process.exit(1);
  }
}

deployMilestone3Direct();
