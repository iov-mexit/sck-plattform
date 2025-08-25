import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      artifactType,
      artifactId,
      organizationId,
      loaLevel,
      riskContext,
      aiGenerated = false
    } = body;

    if (!artifactType || !artifactId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Generate search queries for knowledge retrieval
    const searchQueries = [
      `${artifactType} ${artifactId}`,
      `LoA level ${loaLevel}`,
      `compliance requirements`,
      `risk assessment`
    ];

    // 2. Retrieve relevant knowledge (lexical search for now, vector later)
    // For now, we'll use a simple approach - in the future this will use the RAG system
    const knowledgeResults = await prisma.knowledge_documents.findMany({
      where: {
        OR: [
          { title: { contains: artifactType, mode: 'insensitive' } },
          { content: { contains: artifactType, mode: 'insensitive' } },
          { title: { contains: 'compliance', mode: 'insensitive' } },
          { content: { contains: 'compliance', mode: 'insensitive' } }
        ]
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    const citations = knowledgeResults.map((doc: any) => ({
      docId: doc.id,
      title: doc.title,
      chunkId: doc.id,
      score: 0.8, // Placeholder - will be vector similarity score later
      snippet: doc.content.slice(0, 200)
    }));

    // 3. Generate risk assessment
    const riskFactors = [];
    let riskScore = 0;

    // Basic risk heuristics based on artifact type and LoA level
    if (loaLevel >= 4) {
      riskScore += 30;
      riskFactors.push({
        label: 'High LoA Level',
        score: 30,
        detail: `LoA level ${loaLevel} requires elevated scrutiny`
      });
    }

    if (artifactType === 'AI_MODEL') {
      riskScore += 25;
      riskFactors.push({
        label: 'AI Model',
        score: 25,
        detail: 'AI models require additional compliance considerations'
      });
    }

    if (artifactType === 'MCP_POLICY') {
      riskScore += 20;
      riskFactors.push({
        label: 'Policy Change',
        score: 20,
        detail: 'Policy modifications affect organizational governance'
      });
    }

    // Add risk context if provided
    if (riskContext) {
      riskScore += 15;
      riskFactors.push({
        label: 'Context Risk',
        score: 15,
        detail: riskContext
      });
    }

    // Cap risk score at 100
    riskScore = Math.min(riskScore, 100);

    // 4. Generate summary
    const summary = `This ${artifactType.toLowerCase()} requires LoA level ${loaLevel} approval. ` +
      `Risk assessment indicates ${riskScore < 50 ? 'low' : riskScore < 75 ? 'medium' : 'high'} risk level. ` +
      `Key considerations include ${riskFactors.map(f => f.label.toLowerCase()).join(', ')}.`;

    // 5. Create explainability record
    const explainability = await prisma.explainability.create({
      data: {
        summary,
        riskScore,
        riskFactors,
        citations,
        aiReasoning: aiGenerated ? {
          model: 'stub-model',
          reasoning: 'AI-generated recommendation requires human review',
          confidence: 0.7
        } : undefined,
        modelRef: aiGenerated ? 'stub-model/v1.0' : null,
        redactionSummary: 'No PII detected in processing'
      }
    });

    // 6. Create trust ledger event
    const explainPayload = {
      explainabilityId: explainability.id,
      artifactType,
      artifactId,
      riskScore,
      riskFactors: riskFactors.length,
      citations: citations.length,
      timestamp: new Date().toISOString()
    };

    const contentHash = crypto.createHash('sha256')
      .update(JSON.stringify(explainPayload))
      .digest('hex');

    // Get previous hash for threading
    const lastEvent = await prisma.trustLedgerEvent.findFirst({
      where: { artifactId },
      orderBy: { createdAt: 'desc' }
    });

    await prisma.trustLedgerEvent.create({
      data: {
        artifactType: artifactType as any,
        artifactId,
        action: 'EXPLAINABILITY_GENERATED',
        payload: explainPayload,
        contentHash,
        prevHash: lastEvent?.contentHash || null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Explainability pack generated successfully',
      data: {
        explainabilityId: explainability.id,
        summary,
        riskScore,
        riskFactors,
        citations: citations.length
      }
    });

  } catch (error) {
    console.error('Error generating explainability:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate explainability',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
