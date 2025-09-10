import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { preprocessQuery, scoreResults, highlightRelevantParts } from '@/lib/rag/query';
import { generateEmbedding } from '@/lib/rag/embedding';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vqftrdxexmsdvhbbyjff.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxZnRyZHhleG1zZHZoYmJ5amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTgwNzUsImV4cCI6MjA3MTQzNDA3NX0.-AMvB0s5UQrAM9d6GKwxPoKJymcCSlymLUGhirTeEWs';

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to extract framework from ID
function extractFrameworkFromId(id: string): string | null {
  if (!id) return null;

  const frameworkMap: { [key: string]: string } = {
    'iso27001': 'ISO 27001',
    'iso42001': 'ISO 42001',
    'owasp': 'OWASP',
    'eu_ai': 'EU AI Act',
    'nist': 'NIST',
    'soc2': 'SOC 2',
    'gdpr': 'GDPR',
    'dora': 'DORA',
    'nis2': 'NIS2',
    'cra': 'CRA'
  };

  for (const [prefix, name] of Object.entries(frameworkMap)) {
    if (id.toLowerCase().startsWith(prefix)) {
      return name;
    }
  }

  return null;
}

// Helper function to extract framework from metadata
function extractFrameworkFromMetadata(metadata: any): string | null {
  if (!metadata) return null;

  const source = metadata.source;
  if (!source) return null;

  const frameworkMap: { [key: string]: string } = {
    'ISO_IEC_27001': 'ISO 27001',
    'ISO_42001': 'ISO 42001',
    'OWASP': 'OWASP',
    'EU_AI_ACT': 'EU AI Act',
    'NIST': 'NIST',
    'SOC2': 'SOC 2',
    'GDPR': 'GDPR',
    'DORA': 'DORA',
    'NIS2': 'NIS2',
    'CRA': 'CRA'
  };

  return frameworkMap[source] || null;
}

// Helper function to extract or generate source URL
function extractSourceUrl(id: string, metadata: any): string {
  // Try to get URL from metadata first
  if (metadata?.url) return metadata.url;

  // Generate URL based on framework and ID
  const framework = extractFrameworkFromId(id) || extractFrameworkFromMetadata(metadata);

  const urlMap: { [key: string]: string } = {
    'ISO 27001': 'https://www.iso.org/standard/27001',
    'ISO 42001': 'https://www.iso.org/standard/42001',
    'OWASP': 'https://owasp.org/Top10/',
    'EU AI Act': 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
    'NIST': 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final',
    'SOC 2': 'https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report',
    'GDPR': 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
    'DORA': 'https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/digital-operational-resilience-act-dora',
    'NIS2': 'https://www.enisa.europa.eu/publications/nis2-technical-implementation-guidance',
    'CRA': 'https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng'
  };

  return urlMap[framework] || '#';
}

// Helper function to calculate lexical similarity score
function calculateLexicalScore(query: string, content: string): number {
  const queryWords = query.toLowerCase().split(/\s+/);
  const contentWords = content.toLowerCase().split(/\s+/);

  let matches = 0;
  queryWords.forEach(word => {
    if (contentWords.some(cw => cw.includes(word) || word.includes(cw))) {
      matches++;
    }
  });

  const baseScore = matches / queryWords.length;

  // Boost score for exact phrase matches
  if (content.toLowerCase().includes(query.toLowerCase())) {
    return Math.min(baseScore + 0.3, 0.9);
  }

  return Math.min(baseScore, 0.8);
}

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
      console.log(`📊 Generated embedding with ${queryEmbedding.length} dimensions`);

      // Use match_documents RPC for vector search
      const { data: vectorResults, error: vectorError } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.3, // Lowered threshold for better results
        match_count: 20
      });

      console.log(`🔍 Vector search response:`, {
        hasData: !!vectorResults,
        dataLength: vectorResults?.length || 0,
        hasError: !!vectorError,
        error: vectorError?.message || 'none'
      });

      if (!vectorError && vectorResults && vectorResults.length > 0) {
        console.log(`✅ Vector search found ${vectorResults.length} results`);

        results = vectorResults.map((d: any) => ({
          id: d.id,
          framework: extractFrameworkFromId(d.id) || extractFrameworkFromMetadata(d.metadata) || 'Unknown',
          text_chunk: d.content || d.text_chunk || d.metadata?.content || 'Content not available',
          source_url: extractSourceUrl(d.id, d.metadata),
          score: d.similarity || 0.8
        }));

        usedMode = "vector";
      } else {
        console.log('⚠️ Vector search failed, falling back to lexical search');
        console.log('Vector error details:', vectorError);
      }
    } catch (vectorErr) {
      console.log('⚠️ Vector search error, falling back to lexical search:', vectorErr);
    }

    // Strategy 2: Enhanced lexical search fallback
    if (results.length === 0) {
      console.log('🔍 Attempting enhanced lexical search...');

      // Try multiple search patterns for better results
      const searchPatterns = [
        `metadata->content.ilike.%${processed.normalized}%`,
        `metadata->title.ilike.%${processed.normalized}%`,
        `metadata->content.ilike.%${processed.keywords.join('%')}%`,
        `metadata->content.ilike.%${processed.keywords[0]}%`,
        `metadata->content.ilike.%${processed.keywords[1]}%`
      ].filter(Boolean);

      const { data: lexicalResults, error: lexicalError } = await supabase
        .from('knowledge_chunks')
        .select('id, metadata')
        .or(searchPatterns.join(','))
        .limit(20);

      if (!lexicalError && lexicalResults && lexicalResults.length > 0) {
        console.log(`✅ Enhanced lexical search found ${lexicalResults.length} results`);

        results = lexicalResults.map((chunk: any) => ({
          id: chunk.id,
          framework: extractFrameworkFromId(chunk.id) || extractFrameworkFromMetadata(chunk.metadata) || 'Unknown',
          text_chunk: chunk.metadata?.content || 'Content not available',
          source_url: extractSourceUrl(chunk.id, chunk.metadata),
          score: calculateLexicalScore(processed.normalized, chunk.metadata?.content || '')
        }));

        usedMode = "lexical";
      }
    }

    // Strategy 3: Framework-specific search
    if (results.length === 0 && processed.frameworks.length > 0) {
      console.log(`🏛️ Attempting framework-specific search: ${processed.frameworks.join(', ')}`);

      // Map framework names to IDs for better matching
      const frameworkIdMap: { [key: string]: string[] } = {
        'GDPR': ['gdpr', 'eu_gdpr'],
        'ISO 27001': ['iso27001', 'iso_27001'],
        'ISO 42001': ['iso42001', 'iso_42001'],
        'OWASP': ['owasp'],
        'EU AI Act': ['eu_ai', 'eu_ai_act'],
        'NIST': ['nist'],
        'SOC 2': ['soc2', 'soc_2'],
        'DORA': ['dora'],
        'NIS2': ['nis2'],
        'CRA': ['cra']
      };

      const frameworkIds = processed.frameworks.flatMap(fw => frameworkIdMap[fw] || [fw]);

      const { data: frameworkResults, error: frameworkError } = await supabase
        .from('knowledge_chunks')
        .select('id, metadata')
        .or(frameworkIds.map(id => `id.ilike.%${id}%`).join(','))
        .limit(20);

      if (!frameworkError && frameworkResults && frameworkResults.length > 0) {
        console.log(`✅ Framework search found ${frameworkResults.length} results`);

        results = frameworkResults.map((chunk: any) => ({
          id: chunk.id,
          framework: extractFrameworkFromId(chunk.id) || extractFrameworkFromMetadata(chunk.metadata) || 'Unknown',
          text_chunk: chunk.metadata?.content || 'Content not available',
          source_url: extractSourceUrl(chunk.id, chunk.metadata),
          score: calculateLexicalScore(processed.normalized, chunk.metadata?.content || '') + 0.2 // Boost framework results
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
          framework: extractFrameworkFromId(chunk.id) || extractFrameworkFromMetadata(chunk.metadata) || 'Unknown',
          text_chunk: chunk.metadata?.content || 'Content not available',
          source_url: extractSourceUrl(chunk.id, chunk.metadata),
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

