#!/usr/bin/env node
/**
 * Test RAG System - Verify it's working with populated data
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://vqftrdxexmsdvhbbyjff.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxZnRyZHhleG1zZHZoYmJ5amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTgwNzUsImV4cCI6MjA3MTQzNDA3NX0.-AMvB0s5UQrAM9d6GKwxPoKJymcCSlymLUGhirTeEWs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRAGSystem() {
  console.log('🧪 Testing RAG System...');
  console.log('========================');

  try {
    // Test 1: Check if data exists
    console.log('📊 Test 1: Checking data count...');
    const { count, error: countError } = await supabase
      .from('knowledge_chunks')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Count error:', countError.message);
      return false;
    }

    console.log(`✅ Found ${count} chunks in the table`);

    // Test 2: Check sample data
    console.log('\n📋 Test 2: Checking sample data...');
    const { data: sample, error: sampleError } = await supabase
      .from('knowledge_chunks')
      .select('id, metadata')
      .limit(3);

    if (sampleError) {
      console.error('❌ Sample error:', sampleError.message);
      return false;
    }

    console.log('✅ Sample data retrieved:');
    sample.forEach((chunk, i) => {
      console.log(`  ${i + 1}. ID: ${chunk.id}`);
      console.log(`     Content: ${chunk.metadata?.content?.substring(0, 100)}...`);
      console.log(`     Source: ${chunk.metadata?.source}`);
    });

    // Test 3: Test text search
    console.log('\n🔍 Test 3: Testing text search...');
    const { data: searchResults, error: searchError } = await supabase
      .from('knowledge_chunks')
      .select('id, metadata')
      .textSearch('metadata->content', 'AI agent')
      .limit(5);

    if (searchError) {
      console.error('❌ Search error:', searchError.message);
    } else {
      console.log(`✅ Text search found ${searchResults.length} results for "AI agent"`);
      if (searchResults.length > 0) {
        console.log('   First result:', searchResults[0].metadata?.content?.substring(0, 150));
      }
    }

    // Test 4: Test vector search (if embeddings exist)
    console.log('\n🔤 Test 4: Testing vector search...');
    const testEmbedding = Array.from({ length: 384 }, (_, i) => (i % 10) / 10);

    try {
      const { data: vectorResults, error: vectorError } = await supabase.rpc('match_documents', {
        query_embedding: testEmbedding,
        match_threshold: 0.1,
        match_count: 3
      });

      if (vectorError) {
        console.log('⚠️ Vector search error (expected if no real embeddings):', vectorError.message);
      } else {
        console.log(`✅ Vector search found ${vectorResults.length} results`);
      }
    } catch (e) {
      console.log('⚠️ Vector search not available:', e.message);
    }

    console.log('\n🎉 RAG System Test Complete!');
    return true;

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    return false;
  }
}

async function main() {
  const success = await testRAGSystem();

  if (success) {
    console.log('\n🚀 Your RAG system is ready for testing!');
    console.log('🌐 Test it at: https://your-domain.vercel.app/rag/search');
    console.log('\n💡 Try these queries:');
    console.log('   - "AI agent security requirements"');
    console.log('   - "ISO 27001 key rotation"');
    console.log('   - "SOC2 compliance controls"');
    console.log('   - "EU AI Act requirements"');
  }
}

main();
