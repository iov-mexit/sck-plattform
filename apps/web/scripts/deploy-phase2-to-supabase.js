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

async function deployPhase2Indexes() {
  console.log('🚀 Deploying Phase 2 SQL indexes to Supabase...');
  
  try {
    // Read the SQL migration file
    const fs = require('fs');
    const sqlPath = './prisma/migrations/phase2_lexical_indexes.sql';
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('📋 Executing SQL migration...');
    
    // Execute the SQL via Supabase RPC
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('❌ SQL execution failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Phase 2 indexes deployed successfully!');
    console.log('📊 Indexes created:');
    console.log('  - pg_trgm extension');
    console.log('  - GIN indexes for KnowledgeChunk content');
    console.log('  - Performance indexes for documents and explainability');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deployPhase2Indexes();
