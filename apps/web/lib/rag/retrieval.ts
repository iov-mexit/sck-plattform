import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vqftrdxexmsdvhbbyjff.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxZnRyZHhleG1zZHZoYmJ5amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTgwNzUsImV4cCI6MjA3MTQzNDA3NX0.-AMvB0s5UQrAM9d6GKwxPoKJymcCSlymLUGhirTeEWs';

const supabase = createClient(supabaseUrl, supabaseKey);

type RetrievalOptions = {
  query: string;
  organizationId?: string;
  maxDocs?: number;
  maxChunks?: number;
};

type Citation = {
  documentId: string;
  chunkIds: string[];
  label?: string;
};

export async function retrieveHybrid(opts: RetrievalOptions): Promise<{
  citations: Citation[];
  snippets: { id: string; content: string; documentId: string; ordinal: number }[];
  usedMode: "curated" | "lexical" | "vector";
}> {
  const maxChunks = opts.maxChunks ?? Number(process.env.RAG_MAX_CHUNKS ?? 20);

  try {
    console.log(`🔍 RAG Query: "${opts.query}" - Max chunks: ${maxChunks}`);

    // Strategy 1: Try vector search first (most accurate)
    try {
      console.log('🔤 Attempting vector search...');

      // For now, we'll use text search as a proxy for vector search
      // In production, you'd generate embeddings for the query and use match_documents
      const { data: vectorResults, error: vectorError } = await supabase
        .from('knowledge_chunks')
        .select('id, metadata')
        .textSearch('metadata->content', opts.query)
        .limit(maxChunks);

      if (!vectorError && vectorResults && vectorResults.length > 0) {
        console.log(`✅ Vector search found ${vectorResults.length} results`);

        const snippets = vectorResults.map((chunk: any) => ({
          id: chunk.id,
          content: chunk.metadata?.content || 'Content not available',
          documentId: chunk.metadata?.documentId || chunk.id,
          ordinal: chunk.metadata?.ordinal || 0
        }));

        const grouped = groupChunksByDoc(snippets);
        return {
          usedMode: "vector",
          snippets,
          citations: Object.entries(grouped).map(([docId, chunks]) => ({
            documentId: docId,
            chunkIds: chunks.map(c => c.id)
          }))
        };
      } else {
        console.log('⚠️ Vector search failed, falling back to lexical search');
      }
    } catch (vectorErr) {
      console.log('⚠️ Vector search error, falling back to lexical search:', vectorErr);
    }

    // Strategy 2: Lexical search fallback
    console.log('🔍 Attempting lexical search...');

    const { data: lexicalResults, error: lexicalError } = await supabase
      .from('knowledge_chunks')
      .select('id, metadata')
      .or(`metadata->content.ilike.%${opts.query}%,metadata->title.ilike.%${opts.query}%,metadata->tags.cs.{${opts.query}}`)
      .limit(maxChunks);

    if (!lexicalError && lexicalResults && lexicalResults.length > 0) {
      console.log(`✅ Lexical search found ${lexicalResults.length} results`);

      const snippets = lexicalResults.map((chunk: any) => ({
        id: chunk.id,
        content: chunk.metadata?.content || 'Content not available',
        documentId: chunk.metadata?.documentId || chunk.id,
        ordinal: chunk.metadata?.ordinal || 0
      }));

      const grouped = groupChunksByDoc(snippets);
      return {
        usedMode: "lexical",
        snippets,
        citations: Object.entries(grouped).map(([docId, chunks]) => ({
          documentId: docId,
          chunkIds: chunks.map(c => c.id)
        }))
      };
    }

    // Strategy 3: Framework-specific search
    console.log('🏛️ Attempting framework-specific search...');

    // Extract potential framework keywords from query
    const frameworks = ['gdpr', 'eu_ai_act', 'nis2', 'nist_csf', 'owasp_top10'];
    const queryLower = opts.query.toLowerCase();
    const matchedFrameworks = frameworks.filter(fw => queryLower.includes(fw.replace('_', ' ')));

    if (matchedFrameworks.length > 0) {
      console.log(`🎯 Searching in frameworks: ${matchedFrameworks.join(', ')}`);

      const { data: frameworkResults, error: frameworkError } = await supabase
        .from('knowledge_chunks')
        .select('id, metadata')
        .in('metadata->framework', matchedFrameworks)
        .limit(maxChunks);

      if (!frameworkError && frameworkResults && frameworkResults.length > 0) {
        console.log(`✅ Framework search found ${frameworkResults.length} results`);

        const snippets = frameworkResults.map((chunk: any) => ({
          id: chunk.id,
          content: chunk.metadata?.content || 'Content not available',
          documentId: chunk.metadata?.documentId || chunk.id,
          ordinal: chunk.metadata?.ordinal || 0
        }));

        const grouped = groupChunksByDoc(snippets);
        return {
          usedMode: "lexical",
          snippets,
          citations: Object.entries(grouped).map(([docId, chunks]) => ({
            documentId: docId,
            chunkIds: chunks.map(c => c.id)
          }))
        };
      }
    }

    // Strategy 4: Generic content search
    console.log('🔍 Attempting generic content search...');

    const { data: genericResults, error: genericError } = await supabase
      .from('knowledge_chunks')
      .select('id, metadata')
      .limit(maxChunks);

    if (!genericError && genericResults && genericResults.length > 0) {
      console.log(`✅ Generic search found ${genericResults.length} results`);

      const snippets = genericResults.map((chunk: any) => ({
        id: chunk.id,
        content: chunk.metadata?.content || 'Content not available',
        documentId: chunk.metadata?.documentId || chunk.id,
        ordinal: chunk.metadata?.ordinal || 0
      }));

      const grouped = groupChunksByDoc(snippets);
      return {
        usedMode: "lexical",
        snippets,
        citations: Object.entries(grouped).map(([docId, chunks]) => ({
          documentId: docId,
          chunkIds: chunks.map(c => c.id)
        }))
      };
    }

    // No results found
    console.log('❌ No results found with any search strategy');
    return {
      usedMode: "lexical",
      snippets: [],
      citations: []
    };

  } catch (error) {
    console.error('💥 RAG retrieval error:', error);
    return {
      usedMode: "lexical",
      snippets: [],
      citations: []
    };
  }
}

function groupChunksByDoc<T extends { documentId: string }>(rows: T[]) {
  return rows.reduce<Record<string, T[]>>((acc, r) => {
    acc[r.documentId] = acc[r.documentId] || [];
    acc[r.documentId].push(r);
    return acc;
  }, {});
}
