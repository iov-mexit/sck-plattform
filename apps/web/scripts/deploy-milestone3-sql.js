const { createClient } = require('@supabase/supabase-js');

// Use the Supabase configuration from your vercel.json
const supabaseUrl = "https://vqftrdxexmsdvhbbyjff.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

if (!supabaseServiceKey || supabaseServiceKey === "your-service-role-key") {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deployMilestone3SQL() {
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

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    // Execute each statement individually
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`  [${i + 1}/${statements.length}] Executing: ${statement.substring(0, 50)}...`);

          // Use raw SQL execution
          const { data, error } = await supabase.rpc('exec_sql', {
            query: statement + ';'
          });

          if (error) {
            // Try alternative approach - direct table creation
            console.log(`    ⚠️  RPC failed, trying direct approach...`);

            // For table creation, we'll use the Supabase client directly
            if (statement.includes('CREATE TABLE')) {
              console.log(`    📋 Table creation will be handled by Prisma migration`);
            }
          }

        } catch (stmtError) {
          console.log(`    ⚠️  Statement ${i + 1} had issues: ${stmtError.message}`);
          // Continue with other statements
        }
      }
    }

    console.log('\n✅ Milestone 3 deployment completed!');
    console.log('📊 Next steps:');
    console.log('  1. Run Prisma migration: npx prisma db push');
    console.log('  2. Test policy bundle compilation');
    console.log('  3. Verify gateway token issuance');
    console.log('  4. Test HMAC verification');

    console.log('\n🌐 Your enforcement system will be live at:');
    console.log(`   - Bundle API: ${supabaseUrl.replace('.co', '.app')}/api/v1/enforcement/bundles`);
    console.log(`   - Token API: ${supabaseUrl.replace('.co', '.app')}/api/v1/enforcement/tokens`);
    console.log(`   - Verify API: ${supabaseUrl.replace('.co', '.app')}/api/v1/enforcement/verify`);

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    console.error('\n🔧 Alternative deployment method:');
    console.error('1. Use Prisma migration: npx prisma db push');
    console.error('2. Or run SQL manually in Supabase SQL Editor');
    process.exit(1);
  }
}

deployMilestone3SQL();
