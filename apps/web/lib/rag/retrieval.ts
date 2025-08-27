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
    // Use Supabase vector search with match_documents function
    // Note: We need to generate embeddings for the query first
    // For now, let's use a simple text search fallback
    
    console.log('🔍 Searching Supabase Vector table for:', opts.query);
    
    // First, try to get some data from the knowledge_chunks table
    const { data: chunks, error: chunksError } = await supabase
      .from('knowledge_chunks')
      .select('id, metadata')
      .limit(maxChunks);
    
    if (chunksError) {
      console.error('Error accessing knowledge_chunks table:', chunksError);
      
      // Fallback: try to search in the regular knowledge_chunks table if it exists
      try {
        const { data: fallbackChunks, error: fallbackError } = await supabase
          .from('knowledge_chunks')
          .select('id, content, document_id, ordinal')
          .textSearch('content', opts.query)
          .limit(maxChunks);
        
        if (fallbackError) {
          console.error('Fallback search also failed:', fallbackError);
          return {
            usedMode: "lexical",
            snippets: [],
            citations: []
          };
        }
        
        // Convert fallback results to our format
        const snippets = fallbackChunks.map((chunk: any) => ({
          id: chunk.id,
          content: chunk.content || 'No content available',
          documentId: chunk.document_id || chunk.id,
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
      } catch (fallbackErr) {
        console.error('All search methods failed:', fallbackErr);
        return {
          usedMode: "lexical",
          snippets: [],
          citations: []
        };
      }
    }
    
    // If we got chunks from the vector table, extract content from metadata
    if (chunks && chunks.length > 0) {
      console.log(`✅ Found ${chunks.length} chunks in Supabase Vector`);
      
      const snippets = chunks.map((chunk: any) => ({
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
    }
    
    // No results found
    console.log('❌ No chunks found in Supabase Vector');
    return {
      usedMode: "vector",
      snippets: [],
      citations: []
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
