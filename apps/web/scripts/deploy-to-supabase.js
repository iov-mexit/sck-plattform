#!/usr/bin/env node

/**
 * Deploy Milestone-1 AI & RAG to Supabase
 * This script sets up the new AI tables and enables pgvector
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.production' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deployToSupabase() {
  console.log('🚀 Deploying Milestone-1 AI & RAG to Supabase...\n');

  try {
    // 1. Enable pgvector extension
    console.log('📦 Enabling pgvector extension...');
    const { error: vectorError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE EXTENSION IF NOT EXISTS vector;'
    });
    
    if (vectorError) {
      console.log('ℹ️  pgvector already enabled or not available');
    } else {
      console.log('✅ pgvector extension enabled');
    }

    // 2. Create knowledge_documents table
    console.log('\n📚 Creating knowledge_documents table...');
    const { error: knowledgeError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS knowledge_documents (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "organizationId" TEXT,
          "sourceType" TEXT NOT NULL,
          "sourceRef" TEXT,
          title TEXT NOT NULL,
          jurisdiction TEXT,
          framework TEXT,
          version TEXT,
          language TEXT,
          "chunkIndex" INTEGER NOT NULL,
          content TEXT NOT NULL,
          embedding BYTEA,
          hash TEXT NOT NULL,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (knowledgeError) {
      console.log('ℹ️  knowledge_documents table already exists');
    } else {
      console.log('✅ knowledge_documents table created');
    }

    // 3. Create ai_recommendations table
    console.log('\n🤖 Creating ai_recommendations table...');
    const { error: aiError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS ai_recommendations (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "organizationId" TEXT,
          "agentType" TEXT NOT NULL,
          "inputRef" TEXT NOT NULL,
          "outputJson" JSONB NOT NULL,
          confidence DOUBLE PRECISION,
          rationale TEXT,
          citations TEXT[],
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (aiError) {
      console.log('ℹ️  ai_recommendations table already exists');
    } else {
      console.log('✅ ai_recommendations table created');
    }

    // 4. Create trust_ledger table
    console.log('\n🔒 Creating trust_ledger table...');
    const { error: ledgerError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS trust_ledger (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "prevHash" TEXT,
          "eventType" TEXT NOT NULL,
          "payloadHash" TEXT NOT NULL,
          payload JSONB NOT NULL,
          "merkleRoot" TEXT,
          "anchoredTx" TEXT,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (ledgerError) {
      console.log('ℹ️  trust_ledger table already exists');
    } else {
      console.log('✅ trust_ledger table created');
    }

    // 5. Create policy_bundles table
    console.log('\n📋 Creating policy_bundles table...');
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS policy_bundles (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "organizationId" TEXT,
          name TEXT NOT NULL,
          version INTEGER DEFAULT 1,
          status TEXT NOT NULL,
          "regoModule" TEXT NOT NULL,
          sha256 TEXT NOT NULL,
          signatures JSONB,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (policyError) {
      console.log('ℹ️  policy_bundles table already exists');
    } else {
      console.log('✅ policy_bundles table created');
    }

    // 6. Create artifact_risk_profiles table
    console.log('\n⚠️  Creating artifact_risk_profiles table...');
    const { error: riskError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS artifact_risk_profiles (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          "artifactType" TEXT NOT NULL,
          "artifactId" TEXT NOT NULL,
          "organizationId" TEXT,
          "riskScore" DOUBLE PRECISION NOT NULL,
          rationale TEXT,
          "lastReviewedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE("artifactType", "artifactId")
        );
      `
    });

    if (riskError) {
      console.log('ℹ️  artifact_risk_profiles table already exists');
    } else {
      console.log('✅ artifact_risk_profiles table created');
    }

    // 7. Create indexes for performance
    console.log('\n⚡ Creating performance indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_knowledge_hash ON knowledge_documents(hash);',
      'CREATE INDEX IF NOT EXISTS idx_knowledge_org ON knowledge_documents("organizationId");',
      'CREATE INDEX IF NOT EXISTS idx_knowledge_framework ON knowledge_documents(framework);',
      'CREATE INDEX IF NOT EXISTS idx_knowledge_jurisdiction ON knowledge_documents(jurisdiction);',
      'CREATE INDEX IF NOT EXISTS idx_ai_recommendations_org ON ai_recommendations("organizationId");',
      'CREATE INDEX IF NOT EXISTS idx_trust_ledger_event ON trust_ledger("eventType");',
      'CREATE INDEX IF NOT EXISTS idx_trust_ledger_created ON trust_ledger("createdAt");',
      'CREATE INDEX IF NOT EXISTS idx_policy_bundles_status ON policy_bundles(status);',
      'CREATE INDEX IF NOT EXISTS idx_policy_bundles_org ON policy_bundles("organizationId");',
      'CREATE INDEX IF NOT EXISTS idx_risk_profiles_org ON artifact_risk_profiles("organizationId");',
      'CREATE INDEX IF NOT EXISTS idx_risk_profiles_artifact ON artifact_risk_profiles("artifactType", "artifactId");'
    ];

    for (const indexSql of indexes) {
      const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexSql });
      if (indexError) {
        console.log(`⚠️  Index creation warning: ${indexError.message}`);
      }
    }

    console.log('✅ Performance indexes created');

    // 8. Insert sample knowledge document
    console.log('\n📖 Inserting sample knowledge document...');
    const { error: sampleError } = await supabase
      .from('knowledge_documents')
      .insert({
        title: 'EU AI Act Overview (Sample)',
        content: 'The EU AI Act introduces a risk-based framework with obligations by risk tier. This landmark legislation establishes comprehensive rules for AI systems, ensuring they are safe, transparent, and respect fundamental rights.',
        sourceType: 'manual',
        framework: 'EU AI Act',
        jurisdiction: 'EU',
        version: '2024-06',
        language: 'en',
        chunkIndex: 0,
        hash: 'sample-hash-eu-ai-act-2024',
        organizationId: null
      });

    if (sampleError) {
      console.log('ℹ️  Sample document already exists or error occurred');
    } else {
      console.log('✅ Sample knowledge document inserted');
    }

    console.log('\n🎉 Milestone-1 AI & RAG deployment complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit your deployed app at: https://sck-plattform.vercel.app');
    console.log('2. Navigate to /admin/ai-status to test the AI functionality');
    console.log('3. Test the policy draft API: POST /api/ai/policy-draft');
    console.log('4. Test knowledge ingest: POST /api/knowledge/ingest');
    console.log('\n🔒 Note: Currently running in safe stub mode (no external LLM calls)');

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  }
}

deployToSupabase();
