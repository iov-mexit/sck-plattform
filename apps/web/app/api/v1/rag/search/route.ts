import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

// Simple cache for the embedder to avoid re-initialization on hot paths
let embedderPromise: Promise<any> | null = null

async function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = (async () => {
      const { pipeline } = await import('@xenova/transformers')
      return pipeline('feature-extraction', process.env.EMBEDDING_MODEL || 'Xenova/all-MiniLM-L6-v2')
    })()
  }
  return embedderPromise
}

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars missing: SUPABASE_URL and SERVICE_ROLE/ANON key')
  return createClient(url, key)
}

export async function POST(req: Request) {
  try {
    const { query, topK = 5, threshold = 0.7 } = await req.json()
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }

    const embedder = await getEmbedder()
    const output = await embedder(query, { pooling: 'mean', normalize: true })
    const queryEmbedding = Array.from(output.data)

    const supabase = getSupabase()
    const table = process.env.SUPABASE_TABLE || 'knowledge_chunks'
    // Use RPC function for semantic search
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: topK,
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      query,
      count: data?.length || 0,
      results: (data || []).map((r: any) => ({
        id: r.id,
        similarity: r.similarity,
        metadata: r.metadata,
      })),
    })
  } catch (e: any) {
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
