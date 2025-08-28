#!/usr/bin/env node
/**
 * Populate Supabase Vector Table with Anon Key
 * Now that the table exists, let's try to populate it
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client with anon key
const supabaseUrl = 'https://vqftrdxexmsdvhbbyjff.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxZnRyZHhleG1zZHZoYmJ5amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTgwNzUsImV4cCI6MjA3MTQzNDA3NX0.-AMvB0s5UQrAM9d6GKwxPoKJymcCSlymLUGhirTeEWs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateTable() {
  console.log('🚀 Populating Supabase Vector Table...');
  console.log('=====================================');

  try {
    // First, check if table exists and is accessible
    console.log('🔍 Checking table access...');
    const { data: checkData, error: checkError } = await supabase
      .from('knowledge_chunks')
      .select('count')
      .limit(1);

    if (checkError) {
      console.error('❌ Cannot access table:', checkError.message);
      return false;
    }

    console.log('✅ Table is accessible');

    // Load the security framework chunks
    console.log('📚 Loading security framework data...');
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

    // Try to insert chunks into Supabase
    console.log('📥 Inserting chunks into Supabase...');
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

      if (error.message.includes('permission denied')) {
        console.log('\n🚨 PERMISSION ISSUE:');
        console.log('The anon key cannot insert data into the table.');
        console.log('You need to either:');
        console.log('1. Provide the service role key, OR');
        console.log('2. Update the table permissions in Supabase');
        console.log('\nTo fix permissions, run this in Supabase SQL Editor:');
        console.log(`
          -- Grant insert permission to anon role
          grant insert on public.knowledge_chunks to anon;
          grant usage on schema public to anon;
        `);
      }

      return false;
    }

    console.log(`✅ Successfully inserted ${chunks.length} chunks into Supabase Vector`);
    console.log('🚀 Your RAG system is now ready!');
    return true;

  } catch (error) {
    console.error('❌ Error populating data:', error.message);
    return false;
  }
}

async function main() {
  const success = await populateTable();

  if (success) {
    console.log('\n🎉 SUCCESS! Your RAG system is now populated with data!');
    console.log('🚀 Test it at /rag/search with queries like:');
    console.log('   - "AI agent security requirements"');
    console.log('   - "ISO 27001 key rotation"');
    console.log('   - "SOC2 compliance controls"');
  } else {
    console.log('\n❌ Failed to populate table. Check the error messages above.');
  }
}

main();
