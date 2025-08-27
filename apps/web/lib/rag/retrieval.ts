import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type RetrievalOptions = {
  query: string;
  organizationId?: string | null;
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
    // Use Supabase vector search for semantic similarity
    const { data: vectorResults, error: vectorError } = await supabase.rpc('match_documents', {
      query_embedding: opts.query, // Supabase will handle embedding generation
      similarity_threshold: 0.7,
      match_count: maxChunks
    });

    if (vectorError) {
      console.warn('Vector search failed, falling back to lexical:', vectorError);
      
      // Fallback to lexical search using Supabase text search
      const { data: lexicalResults, error: lexicalError } = await supabase
        .from('knowledge_chunks')
        .select('id, content, document_id, ordinal')
        .textSearch('content', opts.query)
        .limit(maxChunks);

      if (lexicalError) {
        console.error('Lexical search also failed:', lexicalError);
        return {
          usedMode: "lexical",
          snippets: [],
          citations: []
        };
      }

      // Convert Supabase results to our format
      const snippets = lexicalResults.map((chunk: any) => ({
        id: chunk.id,
        content: chunk.content,
        documentId: chunk.document_id,
        ordinal: chunk.ordinal || 0
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

    // Vector search succeeded
    const snippets = vectorResults.map((chunk: any) => ({
      id: chunk.id,
      content: chunk.content,
      documentId: chunk.document_id,
      ordinal: chunk.ordinal || 0
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

  } catch (error) {
    console.error('RAG retrieval error:', error);
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
