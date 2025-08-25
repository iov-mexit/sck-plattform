import { prisma } from "@/lib/database";
import { retrieveHybrid } from "@/lib/rag/retrieval";
import { llmGenerate } from "@/lib/ai/llm-client";

type BuildInput = {
  approvalRequestId: string;
  query: string; // short description of what's being approved
  organizationId?: string;
  loaLevel: number;
};

export async function buildExplainabilitySnapshot(input: BuildInput) {
  const approval = await prisma.approvalRequest.findUnique({
    where: { id: input.approvalRequestId }
  });
  if (!approval) throw new Error("ApprovalRequest not found");

  const { citations, snippets, usedMode } = await retrieveHybrid({
    query: input.query,
    organizationId: input.organizationId
  });

  const provider = (process.env.LLM_PROVIDER || "none").toLowerCase();
  const system = `You are generating a governance rationale for an approval request. Be concise, cite by [docId:chunkId] where relevant.`;
  const prompt = [
    `Context Mode: ${usedMode.toUpperCase()}`,
    `LoA Level: L${input.loaLevel}`,
    `Goal: Explain what is being approved and why, highlight risks, and map to citations.`,
    `Snippets (truncated):`,
    ...snippets.slice(0, 6).map(s => `- [${s.documentId}:${s.id}] ${s.content.slice(0, 300)}...`)
  ].join("\n");

  const { text, meta } = await llmGenerate({ system, prompt, maxTokens: 400, temperature: 0.2 });

  const riskScore = estimateRiskScore(snippets, input.loaLevel);
  const snapshot = await prisma.explainabilitySnapshot.upsert({
    where: { approvalRequestId: input.approvalRequestId },
    update: {
      rationale: text,
      riskScore,
      riskVector: { privacy: Math.min(100, riskScore - 10), security: riskScore, legal: Math.min(100, riskScore - 5) },
      loaLevel: input.loaLevel,
      citations,
      policyMap: await inferPolicyMap(citations),
      aiInvolved: provider !== "none",
      aiMeta: meta
    },
    create: {
      approvalRequestId: input.approvalRequestId,
      rationale: text,
      riskScore,
      riskVector: { privacy: Math.min(100, riskScore - 10), security: riskScore, legal: Math.min(100, riskScore - 5) },
      loaLevel: input.loaLevel,
      citations,
      policyMap: await inferPolicyMap(citations),
      aiInvolved: provider !== "none",
      aiMeta: meta
    }
  });

  return snapshot;
}

function estimateRiskScore(snippets: { content: string }[], loaLevel: number) {
  // Placeholder: simple heuristic by LoA and snippet count
  const base = 20 + loaLevel * 15;
  const contentFactor = Math.min(40, Math.floor(snippets.length * 2));
  return Math.min(95, base + contentFactor);
}

async function inferPolicyMap(citations: any[]): Promise<any[]> {
  // Map citations to policies; placeholder queries (extend later)
  const docIds = citations.map(c => c.documentId);
  const docs = await prisma.knowledgeDocument.findMany({
    where: { id: { in: docIds } },
    select: { id: true, title: true, tags: true }
  });
  return docs.map(d => ({ policyId: d.id, title: d.title, version: 1, tags: d.tags }));
}
