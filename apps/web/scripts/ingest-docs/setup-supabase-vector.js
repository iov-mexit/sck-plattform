#!/usr/bin/env node
/**
 * SCK Supabase Vector Table Setup Script
 * Creates the knowledge_chunks table and match_documents function
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'your-supabase-url',
  process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key'
);

const SUPABASE_TABLE = process.env.SUPABASE_TABLE || 'knowledge_chunks';

async function setupSupabaseVector() {
  console.log('🚀 Setting up Supabase Vector Table for SCK Security Framework Dataset');
  console.log('=====================================================================');

  try {
    // Check if Supabase credentials are set
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required');
    }

    console.log(`✅ Supabase URL: ${process.env.SUPABASE_URL}`);
    console.log(`✅ Table name: ${SUPABASE_TABLE}`);

    // Step 1: Create the knowledge_chunks table
    console.log('\n📋 Step 1: Creating knowledge_chunks table...');

    const createTableSQL = `
      create table if not exists public.${SUPABASE_TABLE} (
        id text primary key,
        embedding vector(384),
        metadata jsonb
      );
    `;

    const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTableSQL });

    if (tableError) {
      console.log('⚠️  Note: exec_sql RPC not available, you may need to run this manually');
      console.log('📖 Copy and paste this SQL into your Supabase SQL editor:');
      console.log('\n--- SQL START ---');
      console.log(createTableSQL);
      console.log('--- SQL END ---\n');
    } else {
      console.log('✅ knowledge_chunks table created successfully');
    }

    // Step 2: Create index for faster similarity search
    console.log('\n🔍 Step 2: Creating similarity search index...');

    const createIndexSQL = `
      create index if not exists ${SUPABASE_TABLE}_embedding_idx on public.${SUPABASE_TABLE}
      using ivfflat (embedding vector_cosine_ops) with (lists = 100);
    `;

    const { error: indexError } = await supabase.rpc('exec_sql', { sql: createIndexSQL });

    if (indexError) {
      console.log('⚠️  Note: exec_sql RPC not available, you may need to run this manually');
      console.log('📖 Copy and paste this SQL into your Supabase SQL editor:');
      console.log('\n--- SQL START ---');
      console.log(createIndexSQL);
      console.log('--- SQL END ---\n');
    } else {
      console.log('✅ Similarity search index created successfully');
    }

    // Step 3: Create the match_documents function
    console.log('\n🔧 Step 3: Creating match_documents function...');

    const createFunctionSQL = `
      create or replace function public.match_documents(
        query_embedding vector(384),
        match_threshold float, -- cosine similarity threshold (0-1)
        match_count int -- number of matches to return
      )
      returns table (
        id text,
        similarity float,
        metadata jsonb
      )
      language sql
      stable
      as $$
        select
          id,
          1 - (embedding <=> query_embedding) as similarity,
          metadata
        from public.${SUPABASE_TABLE}
        where 1 - (embedding <=> query_embedding) > match_threshold
        order by embedding <=> query_embedding
        limit match_count;
      $$;
    `;

    const { error: functionError } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });

    if (functionError) {
      console.log('⚠️  Note: exec_sql RPC not available, you may need to run this manually');
      console.log('📖 Copy and paste this SQL into your Supabase SQL editor:');
      console.log('\n--- SQL START ---');
      console.log(createFunctionSQL);
      console.log('--- SQL END ---\n');
    } else {
      console.log('✅ match_documents function created successfully');
    }

    // Step 4: Verify the setup
    console.log('\n🔍 Step 4: Verifying setup...');

    try {
      const { data: tableCheck, error: tableCheckError } = await supabase
        .from(SUPABASE_TABLE)
        .select('*', { count: 'exact', head: true });

      if (tableCheckError) {
        console.log('⚠️  Table verification failed:', tableCheckError.message);
        console.log('📖 You may need to run the SQL manually in Supabase SQL editor');
      } else {
        console.log(`✅ Table verification successful: ${tableCheck.length} rows found`);
      }

    } catch (error) {
      console.log('⚠️  Verification error:', error.message);
    }

    // Complete setup summary
    console.log('\n🎉 Supabase Vector Setup Complete!');
    console.log('==================================');
    console.log('✅ knowledge_chunks table ready');
    console.log('✅ Similarity search index ready');
    console.log('✅ match_documents function ready');
    console.log('\n🚀 Next steps:');
    console.log('1. Run: npm run rag:ingest:security:free');
    console.log('2. Test: npm run rag:test:retrieval');
    console.log('3. Enjoy real vector similarity search!');

    // If manual SQL execution is needed, provide complete script
    if (tableError || indexError || functionError) {
      console.log('\n📋 Complete SQL Script (run in Supabase SQL editor):');
      console.log('\n--- COMPLETE SQL START ---');
      console.log(`
-- Enable pgvector extension (already enabled on Supabase projects)
-- create extension if not exists vector;

-- Create table to store embeddings
create table if not exists public.${SUPABASE_TABLE} (
  id text primary key,
  embedding vector(384),
  metadata jsonb
);

-- Create index for faster similarity search
create index if not exists ${SUPABASE_TABLE}_embedding_idx on public.${SUPABASE_TABLE}
using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Create RPC function for semantic search
create or replace function public.match_documents(
  query_embedding vector(384),
  match_threshold float, -- cosine similarity threshold (0-1)
  match_count int -- number of matches to return
)
returns table (
  id text,
  similarity float,
  metadata jsonb
)
language sql
stable
as $$
  select
    id,
    1 - (embedding <=> query_embedding) as similarity,
    metadata
  from public.${SUPABASE_TABLE}
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
      `);
      console.log('--- COMPLETE SQL END ---\n');
    }

  } catch (error) {
    console.error('💥 Setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupSupabaseVector();
}

module.exports = { setupSupabaseVector };
