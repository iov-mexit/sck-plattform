import { prisma } from '../database'; // adjust import to your prisma client path

// naive retrieval for now (full-text-ish). Replace with vector similarity query if using pgvector
export async function retrieveKnowledge(query: string, limit = 5) {
  // Simple LIKE search to avoid requiring pgvector immediately
  const docs = await prisma.knowledge_documents.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: limit,
    orderBy: { createdAt: 'desc' }
  });
  return docs.map(d => ({
    id: d.id,
    title: d.title,
    snippet: d.content.slice(0, 280)
  }));
}
