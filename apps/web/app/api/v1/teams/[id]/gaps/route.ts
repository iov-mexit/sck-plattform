import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const record = await prisma.teamComposition.findUnique({
      where: { id: params.id },
    });

    if (!record) {
      return NextResponse.json({ error: "Team composition not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      gaps: record.gaps || {},
      teamComposition: {
        id: record.id,
        projectPhase: record.projectPhase,
        requirements: record.requirements,
        suggestedTeam: record.suggestedTeam
      }
    });
  } catch (error) {
    console.error("Failed to fetch team gaps:", error);
    return NextResponse.json(
      { error: "Failed to fetch team gaps" },
      { status: 500 }
    );
  }
}
