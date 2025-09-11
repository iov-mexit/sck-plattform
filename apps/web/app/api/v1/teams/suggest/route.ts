import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { suggestTeam } from "@/lib/team/suggester";
import fs from "fs";
import path from "path";

export const dynamic = 'force-dynamic';

function loadOntology() {
  const ontologyPath = path.join(process.cwd(), 'apps/web/config/ontology.json');
  const raw = fs.readFileSync(ontologyPath, 'utf-8');
  return JSON.parse(raw);
}

function computeCompetenciesFromRoles(roles: string[], existingCompetencies: string[] = []) {
  const ontology = loadOntology();
  const competencyIndex: Record<string, any> = Object.fromEntries(
    ontology.competencies.map((c: any) => [c.id, c])
  );
  const required: string[] = roles
    .map((roleId) => {
      const role = ontology.roles.find((r: any) => r.id === roleId);
      return role ? (role.requiredCompetencies || []) : [];
    })
    .flat();
  const uniqueRequired = Array.from(new Set(required)).filter((id) => !!competencyIndex[id]);
  const gaps = uniqueRequired.filter((id) => !existingCompetencies.includes(id));
  return { requiredCompetencies: uniqueRequired, gaps };
}

export async function POST(req: Request) {
  try {
    const { projectPhaseId, requirements, roles, existingCompetencies } = await req.json();

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
    } else if (Array.isArray(roles)) {
      const agg = computeCompetenciesFromRoles(roles, existingCompetencies || []);
      return NextResponse.json({ success: true, roles, ...agg });
    } else {
      return NextResponse.json({ error: "Either projectPhaseId, requirements, or roles required" }, { status: 400 });
    }

    const team = await suggestTeam(phase, requirements?.organizationId);

    const record = await prisma.teamComposition.create({
      data: {
        projectPhase: phase.phaseName,
        requirements: phase.requiredSkills as any,
        suggestedTeam: team.suggestions as any,
        gaps: team.gaps as any,
        organizationId: requirements?.organizationId || (phase as any)?.organizationId || "default-org"
      },
    });

    const response: any = {
      success: true,
      teamComposition: record,
      suggestions: team.suggestions,
      gaps: team.gaps,
      confidence: team.confidence
    };

    if (Array.isArray(roles)) {
      const agg = computeCompetenciesFromRoles(roles, existingCompetencies || []);
      response.requiredCompetencies = agg.requiredCompetencies;
      response.competencyGaps = agg.gaps;
    }

    return NextResponse.json(response);
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
