import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { suggestTeam } from "@/lib/team/suggester";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { projectPhaseId, requirements } = await req.json();
    
    let phase;
    if (projectPhaseId) {
      phase = await prisma.projectPhase.findUnique({
        where: { id: projectPhaseId },
      });
      
      if (!phase) {
        return NextResponse.json({ error: "Phase not found" }, { status: 404 });
      }
    } else if (requirements) {
      // Direct requirements provided
      phase = {
        phaseName: requirements.phaseName || "Custom Phase",
        requiredSkills: requirements
      };
    } else {
      return NextResponse.json({ error: "Either projectPhaseId or requirements required" }, { status: 400 });
    }

    const team = await suggestTeam(phase);

    const record = await prisma.teamComposition.create({
      data: {
        projectPhase: phase.phaseName,
        requirements: phase.requiredSkills,
        suggestedTeam: team.suggestions,
        gaps: team.gaps,
        organizationId: "default-org" // TODO: Get from auth context
      },
    });

    return NextResponse.json({
      success: true,
      teamComposition: record,
      suggestions: team.suggestions,
      gaps: team.gaps,
      confidence: team.confidence
    });
  } catch (error) {
    console.error("Team suggestion error:", error);
    return NextResponse.json(
      { error: "Failed to suggest team", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const compositions = await prisma.teamComposition.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json({
      success: true,
      compositions
    });
  } catch (error) {
    console.error("Failed to fetch team compositions:", error);
    return NextResponse.json(
      { error: "Failed to fetch team compositions" },
      { status: 500 }
    );
  }
}
