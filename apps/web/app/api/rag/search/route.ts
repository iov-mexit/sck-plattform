import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { preprocessQuery, scoreResults, highlightRelevantParts } from '@/lib/rag/query';
import { generateEmbedding } from '@/lib/rag/embedding';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vqftrdxexmsdvhbbyjff.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxZnRyZHhleG1zZHZoYmJ5amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTgwNzUsImV4cCI6MjA3MTQzNDA3NX0.-AMvB0s5UQrAM9d6GKwxPoKJymcCSlymLUGhirTeEWs';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, organizationId } = body;

    if (!query) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    console.log(`🔍 RAG Query: "${query}"`);

    // Phase 1: Query preprocessing
    const processed = preprocessQuery(query);
    console.log(`📝 Preprocessed:`, {
      frameworks: processed.frameworks,
      intent: processed.intent,
      keywords: processed.keywords.slice(0, 5)
    });

    // Strategy 1: Try vector search first (most accurate)
    let results: any[] = [];
    let usedMode: "vector" | "lexical" | "framework" | "generic" = "generic";

    try {
      console.log('🔤 Attempting vector search...');

      // Generate query embedding
      const queryEmbedding = await generateEmbedding(processed.normalized);

      // Use match_documents RPC for vector search
      const { data: vectorResults, error: vectorError } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 20
      });

      if (!vectorError && vectorResults && vectorResults.length > 0) {
        console.log(`✅ Vector search found ${vectorResults.length} results`);

        results = vectorResults.map((d: any) => ({
          id: d.id,
          framework: d.framework || 'Unknown',
          text_chunk: d.content || d.text_chunk || 'Content not available',
          source_url: d.source_url || '#',
          score: d.similarity || 0.8
        }));

        usedMode = "vector";
      } else {
        console.log('⚠️ Vector search failed, falling back to lexical search');
      }
    } catch (vectorErr) {
      console.log('⚠️ Vector search error, falling back to lexical search:', vectorErr);
    }

    // Strategy 2: Lexical search fallback
    if (results.length === 0) {
      console.log('🔍 Attempting lexical search...');

      const { data: lexicalResults, error: lexicalError } = await supabase
        .from('knowledge_chunks')
        .select('id, metadata')
        .or(`metadata->content.ilike.%${processed.normalized}%,metadata->title.ilike.%${processed.normalized}%`)
        .limit(20);

      if (!lexicalError && lexicalResults && lexicalResults.length > 0) {
        console.log(`✅ Lexical search found ${lexicalResults.length} results`);

        results = lexicalResults.map((chunk: any) => ({
          id: chunk.id,
          framework: chunk.metadata?.framework || 'Unknown',
          text_chunk: chunk.metadata?.content || 'Content not available',
          source_url: chunk.metadata?.url || '#',
          score: 0.6 // Default score for lexical results
        }));

        usedMode = "lexical";
      }
    }

    // Strategy 3: Framework-specific search
    if (results.length === 0 && processed.frameworks.length > 0) {
      console.log(`🏛️ Attempting framework-specific search: ${processed.frameworks.join(', ')}`);

      const { data: frameworkResults, error: frameworkError } = await supabase
        .from('knowledge_chunks')
        .select('id, metadata')
        .in('metadata->framework', processed.frameworks)
        .limit(20);

      if (!frameworkError && frameworkResults && frameworkResults.length > 0) {
        console.log(`✅ Framework search found ${frameworkResults.length} results`);

        results = frameworkResults.map((chunk: any) => ({
          id: chunk.id,
          framework: chunk.metadata?.framework || 'Unknown',
          text_chunk: chunk.metadata?.content || 'Content not available',
          source_url: chunk.metadata?.url || '#',
          score: 0.5 // Framework-specific results
        }));

        usedMode = "framework";
      }
    }

    // Strategy 4: Generic content search (fallback)
    if (results.length === 0) {
      console.log('🌐 Attempting generic content search...');

      const { data: genericResults, error: genericError } = await supabase
        .from('knowledge_chunks')
        .select('id, metadata')
        .limit(20);

      if (!genericError && genericResults && genericResults.length > 0) {
        console.log(`✅ Generic search found ${genericResults.length} results`);

        results = genericResults.map((chunk: any) => ({
          id: chunk.id,
          framework: chunk.metadata?.framework || 'Unknown',
          text_chunk: chunk.metadata?.content || 'Content not available',
          source_url: chunk.metadata?.url || '#',
          score: 0.3 // Generic fallback results
        }));

        usedMode = "generic";
      }
    }

    // Phase 1: Result scoring and ranking
    if (results.length > 0) {
      console.log(`📊 Scoring and ranking ${results.length} results...`);

      // Apply relevance scoring
      const scoredResults = scoreResults(query, results);

      // Add highlights to results
      const enhancedResults = scoredResults.map(result => ({
        ...result,
        highlights: highlightRelevantParts(query, result.text_chunk),
        framework: result.framework || 'Unknown'
      }));

      console.log(`✅ RAG search completed with ${enhancedResults.length} results (${usedMode} mode)`);

      return NextResponse.json({
        results: enhancedResults,
        usedMode,
        query: processed,
        totalResults: enhancedResults.length
      });
    } else {
      console.log('❌ No results found with any search strategy');
      return NextResponse.json({
        results: [],
        usedMode: "generic",
        query: processed,
        totalResults: 0,
        message: "No relevant regulatory content found. Try rephrasing your query."
      });
    }

  } catch (error: any) {
    console.error("💥 RAG API error:", error);
    return NextResponse.json({
      error: error.message,
      message: "Failed to process RAG search request"
    }, { status: 500 });
  }
}

