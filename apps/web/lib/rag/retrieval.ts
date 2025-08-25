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
  const maxDocs = opts.maxDocs ?? Number(process.env.RAG_MAX_DOCS ?? 6);
  const maxChunks = opts.maxChunks ?? Number(process.env.RAG_MAX_CHUNKS ?? 20);
  const useVectors = String(process.env.RAG_VECTORS ?? "false") === "true";

  // 1) Curated snippets first (if any)
  // Policy authors can mark KnowledgeDocument.sourceType="CURATED"
  const curatedDocs = await prisma.knowledgeDocument.findMany({
    where: {
      sourceType: "CURATED",
      ...(opts.organizationId ? { OR: [{ organizationId: opts.organizationId }, { organizationId: null }] } : {})
    },
    take: maxDocs
  });

  if (curatedDocs.length > 0) {
    const docIds = curatedDocs.map(d => d.id);
    const curatedChunks = await prisma.knowledgeChunk.findMany({
      where: { documentId: { in: docIds } },
      orderBy: { ordinal: "asc" },
      take: maxChunks
    });

    if (curatedChunks.length > 0) {
      const grouped = groupChunksByDoc(curatedChunks);
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

  // 2) Lexical (fast, default)
  if (!useVectors) {
    const chunks = await prisma.$queryRawUnsafe<any[]>(`
      SELECT c.id, c."documentId", c.ordinal, c.content
      FROM "KnowledgeChunk" c
      WHERE c.content ILIKE '%' || $1 || '%'
      ORDER BY c.ordinal ASC
      LIMIT ${maxChunks};
    `, opts.query);

    const grouped = groupChunksByDoc(chunks);
    return {
      usedMode: "lexical",
      snippets: chunks.map(c => ({ id: c.id, content: c.content, documentId: c.documentId, ordinal: c.ordinal })),
      citations: Object.entries(grouped).map(([docId, rows]) => ({
        documentId: docId,
        chunkIds: rows.map((r: any) => r.id)
      }))
    };
  }

  // 3) Vector (Phase 3 migration will replace; keep stub)
  // For now, we emulate vector with lexical to keep behavior consistent.
  const vecChunks = await prisma.$queryRawUnsafe<any[]>(`
    SELECT c.id, c."documentId", c.ordinal, c.content
    FROM "KnowledgeChunk" c
    WHERE c.content ILIKE '%' || $1 || '%'
    ORDER BY c.ordinal ASC
    LIMIT ${maxChunks};
  `, opts.query);

  const groupedVec = groupChunksByDoc(vecChunks);
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
