import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/database';
import { embedText } from '@/lib/rag/embeddings';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      content,
      organizationId = null,
      sourceType = 'manual',
      sourceRef = null,
      jurisdiction = null,
      framework = null,
      version = null,
      language = 'en',
      chunkSize = 1200
    } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'title and content required' }, { status: 400 });
    }

    const chunks: string[] = [];
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize));
    }

    const createdIds: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const hash = crypto.createHash('sha256').update(chunk).digest('hex');
      const embedding = await embedText(chunk);

      const row = await prisma.knowledge_documents.create({
        data: {
          title: i === 0 ? title : `${title} (chunk ${i})`,
          content: chunk,
          organizationId,
          sourceType,
          sourceRef,
          jurisdiction,
          framework,
          version,
          language,
          chunkIndex: i,
          hash,
          // store embedding as Bytes or Vector depending on your schema
          embedding: Buffer.from(new Float32Array(embedding).buffer)
        }
      });
      createdIds.push(row.id);
    }

    return NextResponse.json({ ok: true, created: createdIds.length, ids: createdIds });
  } catch (e: any) {
    console.error('ingest error', e);
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}
