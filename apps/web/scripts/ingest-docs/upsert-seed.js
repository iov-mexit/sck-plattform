#!/usr/bin/env node
/**
 * SCK Security Framework Dataset Ingestion Script
 * Upserts 30 curated security framework chunks to Pinecone + Prisma
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize clients
const prisma = new PrismaClient();
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || 'your-pinecone-api-key'
});

// Configuration
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX || 'sck-knowledge';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const EMBEDDING_MODEL = 'text-embedding-3-small';

async function generateEmbeddings(texts) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  console.log(`🔤 Generating embeddings for ${texts.length} chunks...`);
  
  const embeddings = [];
  
  // Process in batches of 10 (OpenAI limit)
  for (let i = 0; i < texts.length; i += 10) {
    const batch = texts.slice(i, i + 10);
    
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          input: batch
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${error}`);
      }

      const result = await response.json();
      embeddings.push(...result.data.map(d => d.embedding));
      
      console.log(`✅ Generated embeddings for batch ${Math.floor(i/10) + 1}/${Math.ceil(texts.length/10)}`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error generating embeddings for batch ${Math.floor(i/10) + 1}:`, error.message);
      throw error;
    }
  }

  return embeddings;
}

async function upsertToPinecone(chunks, embeddings) {
  console.log(`🌲 Upserting ${chunks.length} chunks to Pinecone...`);
  
  try {
    const index = pinecone.index(PINECONE_INDEX_NAME);
    
    // Prepare vectors for Pinecone
    const vectors = chunks.map((chunk, i) => ({
      id: chunk.id,
      values: embeddings[i],
      metadata: {
        source: chunk.source,
        version: chunk.version,
        title: chunk.title,
        clause: chunk.metadata.clause,
        jurisdiction: chunk.metadata.jurisdiction,
        tags: chunk.metadata.tags.join(','),
        content: chunk.content.substring(0, 500) // Truncate for metadata
      }
    }));

    // Upsert in batches of 100 (Pinecone limit)
    for (let i = 0; i < vectors.length; i += 100) {
      const batch = vectors.slice(i, i + 100);
      
      await index.upsert(batch);
      console.log(`✅ Upserted batch ${Math.floor(i/100) + 1}/${Math.ceil(vectors.length/100)}`);
    }

    console.log(`🎯 Successfully upserted ${vectors.length} chunks to Pinecone`);
    
  } catch (error) {
    console.error('❌ Pinecone upsert error:', error.message);
    throw error;
  }
}

async function upsertToPrisma(chunks) {
  console.log(`🗄️ Upserting ${chunks.length} chunks to Prisma...`);
  
  try {
    for (const chunk of chunks) {
      // Create or update document
      await prisma.knowledgeDocument.upsert({
        where: { id: `${chunk.id}_doc` },
        create: {
          id: `${chunk.id}_doc`,
          source: chunk.source,
          version: chunk.version,
          title: chunk.title,
          content: chunk.content,
          metadata: chunk.metadata
        },
        update: {
          title: chunk.title,
          content: chunk.content,
          metadata: chunk.metadata,
          updatedAt: new Date()
        }
      });

      // Create or update chunk
      await prisma.knowledgeChunk.upsert({
        where: { id: chunk.id },
        create: {
          id: chunk.id,
          documentId: `${chunk.id}_doc`,
          chunkIndex: chunk.chunkIndex,
          content: chunk.content,
          metadata: chunk.metadata
        },
        update: {
          content: chunk.content,
          chunkIndex: chunk.chunkIndex,
          metadata: chunk.metadata
        }
      });
    }

    console.log(`✅ Successfully upserted ${chunks.length} chunks to Prisma`);
    
  } catch (error) {
    console.error('❌ Prisma upsert error:', error.message);
    throw error;
  }
}

async function validateIngestion() {
  console.log(`🔍 Validating ingestion...`);
  
  try {
    // Check Prisma records
    const prismaCount = await prisma.knowledgeChunk.count();
    console.log(`📊 Prisma: ${prismaCount} chunks found`);
    
    // Check Pinecone records
    const index = pinecone.index(PINECONE_INDEX_NAME);
    const stats = await index.describeIndexStats();
    console.log(`🌲 Pinecone: ${stats.totalVectorCount} vectors found`);
    
    // Test retrieval
    const testQueries = [
      "key rotation requirements",
      "AI system risk assessment",
      "change management controls"
    ];
    
    console.log(`🧪 Testing retrieval with sample queries...`);
    
    for (const query of testQueries) {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          input: query
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        const queryEmbedding = result.data[0].embedding;
        
        // Query Pinecone
        const queryResult = await index.query({
          vector: queryEmbedding,
          topK: 3,
          includeMetadata: true
        });
        
        console.log(`🔍 Query: "${query}" → Top result: ${queryResult.matches[0]?.metadata?.clause || 'N/A'}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Validation error:', error.message);
  }
}

async function main() {
  try {
    console.log('🚀 SCK Security Framework Dataset Ingestion');
    console.log('==========================================');
    
    // Check environment variables
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    if (!process.env.PINECONE_API_KEY) {
      throw new Error('PINECONE_API_KEY environment variable is required');
    }
    
    // Load chunks
    const chunksPath = path.join(__dirname, '../../data/seeds/security_framework_chunks.json');
    if (!fs.existsSync(chunksPath)) {
      throw new Error(`Chunks file not found: ${chunksPath}`);
    }
    
    const chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf8'));
    console.log(`📚 Loaded ${chunks.length} security framework chunks`);
    
    // Generate embeddings
    const texts = chunks.map(c => c.content);
    const embeddings = await generateEmbeddings(texts);
    
    // Upsert to Pinecone
    await upsertToPinecone(chunks, embeddings);
    
    // Upsert to Prisma
    await upsertToPrisma(chunks);
    
    // Validate ingestion
    await validateIngestion();
    
    console.log('🎉 Ingestion complete! Security framework dataset is ready for RAG.');
    
  } catch (error) {
    console.error('💥 Ingestion failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, generateEmbeddings, upsertToPinecone, upsertToPrisma };
