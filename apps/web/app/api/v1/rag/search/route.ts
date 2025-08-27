import { NextResponse } from 'next/server'
import prisma from '@/lib/database'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { query, topK = 5, threshold = 0.7 } = await req.json()
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }

    console.log(`🔍 Searching for: "${query}"`);

    // Search in Prisma database using text search
    const chunks = await prisma.knowledgeChunk.findMany({
      where: {
        OR: [
          { content: { contains: query, mode: 'insensitive' } },
          { documentId: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        document: true
      },
      take: topK,
      orderBy: {
        documentId: 'asc'
      }
    });

    console.log(`📊 Found ${chunks.length} chunks`);

    const results = chunks.map((chunk) => ({
      id: chunk.id,
      similarity: 0.85, // Default similarity for text search
      metadata: {
        title: chunk.document?.title || 'Unknown',
        source: chunk.document?.sourceType || 'Unknown',
        content: chunk.content.substring(0, 200) + '...',
        tags: chunk.document?.tags || []
      }
    }));

    return NextResponse.json({
      query,
      count: results.length,
      results: results,
    })
  } catch (e: any) {
    console.error('❌ RAG search error:', e);
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  // Convenience GET handler: /api/v1/rag/search?query=...
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')
  const topK = Number(searchParams.get('topK') || '5')
  const threshold = Number(searchParams.get('threshold') || '0.7')
  return POST(new Request(req.url, { method: 'POST', body: JSON.stringify({ query, topK, threshold }) }))
}
