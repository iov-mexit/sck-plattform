#!/usr/bin/env node
/**
 * Check Supabase Status - Tables, Permissions, and Data
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with anon key
const supabaseUrl = 'https://vqftrdxexmsdvhbbyjff.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxZnRyZHhleG1zZHZoYmJ5amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTgwNzUsImV4cCI6MjA3MTQzNDA3NX0.-AMvB0s5UQrAM9d6GKwxPoKJymcCSlymLUGhirTeEWs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseStatus() {
  console.log('🔍 Checking Supabase Status...');
  console.log('================================');

  try {
    // Check if we can connect
    console.log('🔌 Testing connection...');
    const { data: health, error: healthError } = await supabase.from('knowledge_chunks').select('count').limit(1);

    if (healthError) {
      console.log('❌ Connection failed:', healthError.message);

      if (healthError.message.includes('relation "knowledge_chunks" does not exist')) {
        console.log('📋 Table "knowledge_chunks" does not exist');
        console.log('🚀 Need to create the table first');
        return false;
      } else if (healthError.message.includes('permission denied')) {
        console.log('🚫 Permission denied - need service role key');
        return false;
      }
    } else {
      console.log('✅ Connection successful');
    }

    // Try to list tables (this might not work with anon key)
    console.log('\n📋 Checking available tables...');
    try {
      const { data: tables, error: tablesError } = await supabase.rpc('list_tables');
      if (tablesError) {
        console.log('⚠️ Cannot list tables (anon key limitation):', tablesError.message);
      } else {
        console.log('📊 Available tables:', tables);
      }
    } catch (e) {
      console.log('⚠️ Cannot list tables:', e.message);
    }

    // Try to check knowledge_chunks structure
    console.log('\n🔍 Checking knowledge_chunks table structure...');
    try {
      const { data: sample, error: sampleError } = await supabase
        .from('knowledge_chunks')
        .select('*')
        .limit(1);

      if (sampleError) {
        console.log('❌ Cannot query knowledge_chunks:', sampleError.message);
      } else {
        console.log('✅ knowledge_chunks table exists and is queryable');
        if (sample && sample.length > 0) {
          console.log('📊 Sample record structure:', Object.keys(sample[0]));
          console.log('📊 Sample metadata:', sample[0].metadata);
        } else {
          console.log('📊 Table exists but is empty');
        }
      }
    } catch (e) {
      console.log('❌ Error checking table structure:', e.message);
    }

    return true;

  } catch (error) {
    console.error('💥 Script failed:', error.message);
    return false;
  }
}

async function main() {
  const status = await checkSupabaseStatus();

  if (!status) {
    console.log('\n🚨 ACTION REQUIRED:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run this SQL to create the table:');
    console.log('\n--- SQL START ---');
    console.log(`
      -- Enable vector extension
      create extension if not exists vector;
      
      -- Create knowledge_chunks table
      create table if not exists public.knowledge_chunks (
        id text primary key,
        embedding vector(384),
        metadata jsonb
      );
      
      -- Create index for vector similarity search
      create index if not exists knowledge_chunks_embedding_idx 
        on knowledge_chunks using ivfflat (embedding vector_cosine_ops)
        with (lists = 100);
      
      -- Create match_documents function for similarity search
      create or replace function match_documents(
        query_embedding vector(384),
        match_threshold float default 0.78,
        match_count int default 5
      )
      returns table (
        id text,
        content text,
        similarity float
      )
      language sql stable
      as $$
        select
          id,
          metadata->>'content' as content,
          1 - (knowledge_chunks.embedding <=> query_embedding) as similarity
        from knowledge_chunks
        where 1 - (knowledge_chunks.embedding <=> query_embedding) > match_threshold
        order by knowledge_chunks.embedding <=> query_embedding
        limit match_count;
      $$;
    `);
    console.log('--- SQL END ---');
  }
}

main();
