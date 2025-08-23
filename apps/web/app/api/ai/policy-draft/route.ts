import { NextRequest, NextResponse } from 'next/server';
import { retrieveKnowledge } from '@/lib/rag/retrieval';
import { llmChat } from '@/lib/ai/llm';
import { prisma } from '@/lib/database';
import crypto from 'crypto';

export const runtime = 'nodejs';

const SYSTEM = `You are the Policy Intelligence Agent for Secure Knaight (SCK).
- OUTPUT JSON ONLY with keys: policyRego, suggestedLoA, rationale, citations.
- NEVER auto-approve. Always recommend and explain.
- Incorporate the provided knowledge snippets as citations.
- Assume LoA scale 1..5 where 5 is highest authority/human oversight.
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      artifact = { type: 'MCP', id: 'mcp-temp' },
      organizationId = null,
      goal = 'Create initial MCP access policy',
      riskHint = 'medium'
    } = body;

    // 1) Retrieve context
    const query = `${artifact.type} ${goal} ${riskHint}`;
    const ctx = await retrieveKnowledge(query, 5);

    // 2) Prompt LLM
    const contextText = ctx.map((c, i) => `[#${i+1}] ${c.title}\n${c.snippet}`).join('\n\n');
    const user = `Artifact: ${JSON.stringify(artifact)}
OrganizationId: ${organizationId}
Goal: ${goal}
RiskHint: ${riskHint}

Knowledge:
${contextText}

Return JSON exactly with:
{
  "policyRego": "string",
  "suggestedLoA": number,
  "rationale": "string",
  "citations": ["id-or-url", "..."]
}`;

    const content = await llmChat([
      { role: 'system', content: SYSTEM },
      { role: 'user', content: user }
    ]);

    // 3) Parse model output safely
    let parsed: any = null;
    try {
      // attempt to find JSON block
      const start = content.indexOf('{');
      const end = content.lastIndexOf('}');
      const json = start >= 0 && end > start ? content.slice(start, end + 1) : '{}';
      parsed = JSON.parse(json);
    } catch {
      parsed = { policyRego: '', suggestedLoA: 3, rationale: 'LLM parse fallback', citations: [] };
    }

    // 4) Persist recommendation + ledger
    const rec = await prisma.ai_recommendations.create({
      data: {
        organizationId,
        agentType: 'PolicyIntelligence',
        inputRef: `${artifact.type}:${artifact.id}`,
        outputJson: parsed,
        confidence: 0.6,
        rationale: parsed.rationale?.slice(0, 1000) || null,
        citations: Array.isArray(parsed.citations) ? parsed.citations : []
      }
    });

    const payload = {
      recommendationId: rec.id,
      artifact,
      organizationId,
      output: parsed,
      knowledgeRefs: ctx.map(d => d.id)
    };
    const payloadHash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');

    await prisma.trust_ledger.create({
      data: {
        prevHash: null, // can thread later
        eventType: 'AI_RECOMMENDATION',
        payloadHash,
        payload
      }
    });

    return NextResponse.json({
      ok: true,
      recommendationId: rec.id,
      output: parsed,
      knowledge: ctx
    });
  } catch (e: any) {
    console.error('policy-draft error', e);
    return NextResponse.json({ error: e?.message || 'unknown error' }, { status: 500 });
  }
}
