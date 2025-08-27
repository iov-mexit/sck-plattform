import prisma from "@/lib/database";

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
  console.log("🔍 retrieveHybrid called with:", opts);
  
  const maxDocs = opts.maxDocs ?? Number(process.env.RAG_MAX_DOCS ?? 6);
  const maxChunks = opts.maxChunks ?? Number(process.env.RAG_MAX_CHUNKS ?? 20);
  const useVectors = String(process.env.RAG_VECTORS ?? "false") === "true";
  
  console.log("⚙️ Configuration:", { maxDocs, maxChunks, useVectors });

  // 1) Curated snippets first (if any)
  console.log("🔍 Step 1: Checking for curated documents...");
  try {
    const curatedDocs = await prisma.knowledgeDocument.findMany({
      where: {
        sourceType: "CURATED",
        ...(opts.organizationId ? { OR: [{ organizationId: opts.organizationId }, { organizationId: null }] } : {})
      },
      take: maxDocs
    });
    
    console.log("📊 Curated docs found:", curatedDocs.length);
    
    if (curatedDocs.length > 0) {
      const docIds = curatedDocs.map(d => d.id);
      const curatedChunks = await prisma.knowledgeChunk.findMany({
        where: { documentId: { in: docIds } },
        orderBy: { ordinal: "asc" },
        take: maxChunks
      });
      
      console.log("📊 Curated chunks found:", curatedChunks.length);
      
      if (curatedChunks.length > 0) {
        const grouped = groupChunksByDoc(curatedChunks);
        console.log("✅ Returning curated results");
        return {
          usedMode: "curated",
          snippets: curatedChunks.map(c => ({ id: c.id, content: c.content, documentId: c.documentId, ordinal: c.ordinal })),
          citations: Object.entries(grouped).map(([docId, chunks]) => ({
            documentId: docId,
            chunkIds: chunks.map(c => c.id)
          }))
        };
      }
    }
  } catch (error) {
    console.error("💥 Error in curated search:", error);
  }

  // 2) Lexical (fast, default)
  console.log("🔍 Step 2: Performing lexical search...");
  if (!useVectors) {
    try {
      console.log("🔍 Executing lexical SQL query for:", opts.query);
      
      const chunks = await prisma.$queryRawUnsafe<any[]>(`
        SELECT c.id, c."documentId", c.ordinal, c.content
        FROM "KnowledgeChunk" c
        WHERE c.content ILIKE '%' || $1 || '%'
        ORDER BY c.ordinal ASC
        LIMIT ${maxChunks};
      `, opts.query);
      
      console.log("📊 Lexical search found chunks:", chunks.length);
      
      const grouped = groupChunksByDoc(chunks);
      console.log("✅ Returning lexical results");
      return {
        usedMode: "lexical",
        snippets: chunks.map(c => ({ id: c.id, content: c.content, documentId: c.documentId, ordinal: c.ordinal })),
        citations: Object.entries(grouped).map(([docId, rows]) => ({
          documentId: docId,
          chunkIds: rows.map((r: any) => r.id)
        }))
      };
    } catch (error) {
      console.error("💥 Error in lexical search:", error);
      throw error;
    }
  }

  // 3) Vector (Phase 3 migration will replace; keep stub)
  // For now, we emulate vector with lexical to keep behavior consistent.
  console.log("🔍 Step 3: Performing vector search (emulated lexical)...");
  const vecChunks = await prisma.$queryRawUnsafe<any[]>(`
    SELECT c.id, c."documentId", c.ordinal, c.content
    FROM "KnowledgeChunk" c
    WHERE c.content ILIKE '%' || $1 || '%'
    ORDER BY c.ordinal ASC
    LIMIT ${maxChunks};
  `, opts.query);

  console.log("📊 Vector search found chunks:", vecChunks.length);

  const groupedVec = groupChunksByDoc(vecChunks);
  console.log("✅ Returning vector results");
  return {
    usedMode: "vector",
    snippets: vecChunks.map(c => ({ id: c.id, content: c.content, documentId: c.documentId, ordinal: c.ordinal })),
    citations: Object.entries(groupedVec).map(([docId, rows]) => ({
      documentId: docId,
      chunkIds: rows.map((r: any) => r.id)
    }))
  };
}

function groupChunksByDoc<T extends { documentId: string }>(rows: T[]) {
  return rows.reduce<Record<string, T[]>>((acc, r) => {
    acc[r.documentId] = acc[r.documentId] || [];
    acc[r.documentId].push(r);
    return acc;
  }, {});
}
