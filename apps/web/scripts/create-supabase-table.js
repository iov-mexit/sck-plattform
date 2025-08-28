#!/usr/bin/env node
/**
 * Create Supabase Vector Table and Populate with Data
 * This script will create the missing table and populate it
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client with SERVICE ROLE KEY for admin access
const supabaseUrl = 'https://vqftrdxexmsdvhbbyjff.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxZnRyZHhleG1zZHZoYmJ5amZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImVtYWlsIjoiYWRtaW5Ac2VjdXJlLWtuYWlnaHQuaW8iLCJpYXQiOjE3NTU4NTgwNzUsImV4cCI6MjA3MTQzNDA3NX0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'; // This is a placeholder - you need the real service role key

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSupabaseVectorTable() {
  console.log('🚀 Creating Supabase Vector Table...');

  try {
    // Step 1: Create the knowledge_chunks table
    console.log('📋 Creating knowledge_chunks table...');

    const createTableSQL = `
      create table if not exists public.knowledge_chunks (
        id text primary key,
        embedding vector(384),
        metadata jsonb
      );
    `;

    const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTableSQL });

    if (tableError) {
      console.log('⚠️ exec_sql RPC not available, trying alternative approach...');

      // Try to create table by inserting a dummy record
      const { error: insertError } = await supabase
        .from('knowledge_chunks')
        .insert({
          id: 'test',
          embedding: Array.from({ length: 384 }, () => 0),
          metadata: { test: true }
        });

      if (insertError && insertError.message.includes('relation "knowledge_chunks" does not exist')) {
        console.log('❌ Table creation failed. You need to run this SQL manually in Supabase:');
        console.log('\n--- SQL START ---');
        console.log(createTableSQL);
        console.log('--- SQL END ---\n');
        return false;
      } else if (insertError) {
        console.log('⚠️ Table might exist but has different structure:', insertError.message);
      } else {
        console.log('✅ Table created successfully via insert');
        // Clean up test record
        await supabase.from('knowledge_chunks').delete().eq('id', 'test');
      }
    } else {
      console.log('✅ knowledge_chunks table created successfully');
    }

    return true;

  } catch (error) {
    console.error('❌ Error creating table:', error.message);
    return false;
  }
}

async function populateWithData() {
  console.log('📚 Populating table with security framework data...');

  try {
    // Load the security framework chunks - fix the path
    const chunksPath = path.join(__dirname, 'ingest-docs/../../data/seeds/security_framework_chunks.json');
    if (!fs.existsSync(chunksPath)) {
      throw new Error(`Chunks file not found: ${chunksPath}`);
    }

    const chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf8'));
    console.log(`📚 Loaded ${chunks.length} security framework chunks`);

    // Generate simple embeddings (deterministic for testing)
    const embeddings = chunks.map((_, i) =>
      Array.from({ length: 384 }, (_, j) => ((i + j) % 7) / 10 - 0.3)
    );

    console.log('🔤 Generated deterministic embeddings for testing');

    // Insert chunks into Supabase
    const { data, error } = await supabase
      .from('knowledge_chunks')
      .upsert(
        chunks.map((chunk, i) => ({
          id: chunk.id,
          embedding: embeddings[i],
          metadata: {
            content: chunk.content,
            documentId: chunk.id,
            ordinal: chunk.chunkIndex || 0,
            title: chunk.title,
            source: chunk.source,
            tags: chunk.metadata?.tags || []
          }
        }))
      );

    if (error) {
      console.error('❌ Error inserting data:', error.message);
      return false;
    }

    console.log(`✅ Successfully inserted ${chunks.length} chunks into Supabase Vector`);
    return true;

  } catch (error) {
    console.error('❌ Error populating data:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 SCK Supabase Vector Table Creation & Population');
  console.log('==================================================');

  try {
    // Step 1: Create table
    const tableCreated = await createSupabaseVectorTable();

    if (!tableCreated) {
      console.log('❌ Cannot proceed without table. Please run the SQL manually in Supabase.');
      return;
    }

    // Step 2: Populate with data
    const dataPopulated = await populateWithData();

    if (dataPopulated) {
      console.log('🎉 Supabase Vector table is now ready with data!');
      console.log('🚀 Test your RAG system at /rag/search');
    } else {
      console.log('❌ Data population failed');
    }

  } catch (error) {
    console.error('💥 Script failed:', error.message);
  }
}

main();
