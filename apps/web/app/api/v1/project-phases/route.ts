import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId') || 'default-org';
    const projectId = searchParams.get('projectId');

    const where: any = { organizationId };
    if (projectId) {
      where.projectId = projectId;
    }

    const phases = await prisma.projectPhase.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      phases
    });
  } catch (error) {
    console.error("Failed to fetch project phases:", error);
    return NextResponse.json(
      { error: "Failed to fetch project phases" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { projectId, phaseName, startDate, endDate, requiredSkills, organizationId = 'default-org' } = await req.json();

    if (!projectId || !phaseName || !requiredSkills) {
      return NextResponse.json({ 
        error: "projectId, phaseName, and requiredSkills are required" 
      }, { status: 400 });
    }

    const phase = await prisma.projectPhase.create({
      data: {
        projectId,
        phaseName,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        requiredSkills,
        organizationId
      }
    });

    return NextResponse.json({
      success: true,
      phase
    });
  } catch (error) {
    console.error("Failed to create project phase:", error);
    return NextResponse.json(
      { error: "Failed to create project phase" },
      { status: 500 }
    );
  }
}