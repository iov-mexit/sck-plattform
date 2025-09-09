import { NextResponse } from "next/server";
import { recommendPrivileges } from "@/lib/team/risk";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { teamId, projectPhaseId, teamMembers, projectSensitivity } = await req.json();
    
    if (!teamId && !teamMembers) {
      return NextResponse.json({ 
        error: "Either teamId or teamMembers required" 
      }, { status: 400 });
    }

    const result = await recommendPrivileges({
      teamId,
      projectPhaseId,
      teamMembers,
      projectSensitivity
    });

    return NextResponse.json({
      success: true,
      recommendations: result
    });
  } catch (error) {
    console.error("Failed to recommend privileges:", error);
    return NextResponse.json(
      { error: "Failed to recommend privileges" },
      { status: 500 }
    );
  }
}
