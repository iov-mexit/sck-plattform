import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      agentId,
      roleTemplate,
      trustLevel,
      endpoint,
      environment,
      urgency,
      contextSnippets,
      recentSignals,
      metadata
    } = body;

    // Validate required fields
    if (!agentId || !roleTemplate || !trustLevel || !endpoint || !environment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get agent and organization details
    const agent = await prisma.roleAgent.findUnique({
      where: { id: agentId },
      include: { organization: true }
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Call Policy LLM service
    const policyLlmUrl = process.env.POLICY_LLM_URL || "http://localhost:8080";

    const decisionRequest = {
      agentId,
      roleTemplate,
      trustLevel,
      endpoint,
      environment,
      urgency: urgency || "medium",
      contextSnippets: contextSnippets || [],
      recentSignals: recentSignals || [],
      metadata
    };

    console.log(`🤖 Calling Policy LLM for agent ${agentId}...`);

    const llmResponse = await fetch(`${policyLlmUrl}/api/v1/ai/decide`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(decisionRequest),
    });

    if (!llmResponse.ok) {
      const errorText = await llmResponse.text();
      console.error(`Policy LLM error: ${errorText}`);
      return NextResponse.json(
        { error: "Policy LLM service unavailable", details: errorText },
        { status: 503 }
      );
    }

    const decision = await llmResponse.json();

    // Store decision in database
    const aiDecision = await prisma.aiDecision.create({
      data: {
        agentId,
        organizationId: agent.organizationId,
        promptHash: `hash_${Date.now()}`, // TODO: Implement actual hash
        retrievedDocs: contextSnippets || [],
        llmResponse: decision.action,
        policyResult: decision.policyEvaluation,
        decision: decision.decision,
        signature: decision.signature.signature,
        requiresApproval: decision.action.requiresApproval || false,
        approvalsNeeded: decision.action.approvalsNeeded || [],
        confidence: decision.action.confidence || 0.0,
        metadata: {
          timestamp: new Date().toISOString(),
          endpoint,
          environment,
          urgency,
          ...metadata
        }
      }
    });

    console.log(`✅ AI Decision stored: ${aiDecision.id}`);

    // Return decision with audit ID
    return NextResponse.json({
      ...decision,
      auditId: aiDecision.id,
      agent: {
        id: agent.id,
        name: agent.name,
        roleTemplate: agent.roleTemplate,
        trustLevel: agent.level,
        organization: agent.organization.name
      }
    });

  } catch (error) {
    console.error("AI Decision error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get("agentId");
    const organizationId = searchParams.get("organizationId");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (agentId) where.agentId = agentId;
    if (organizationId) where.organizationId = organizationId;

    const decisions = await prisma.aiDecision.findMany({
      where,
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            roleTemplate: true,
            level: true
          }
        },
        organization: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: limit
    });

    return NextResponse.json({
      decisions,
      count: decisions.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("AI Decision query error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
