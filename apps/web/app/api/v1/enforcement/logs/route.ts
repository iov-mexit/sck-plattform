import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/database";

export async function POST(req: NextRequest) {
  try {
    const logData = await req.json();
    
    // Log OPA decision to enforcement calls
    const enforcementCall = await prisma.enforcementCall.create({
      data: {
        organizationId: logData.input?.organizationId || 'unknown',
        upstreamId: logData.input?.requestId || `opa-${Date.now()}`,
        method: logData.input?.method || 'UNKNOWN',
        path: logData.input?.path || '/unknown',
        result: logData.result?.allow ? 'ALLOW' : 'DENY',
        decisionReason: logData.result?.reason || 'OPA policy evaluation',
        metadata: {
          opa_decision: logData.result,
          input: logData.input,
          timestamp: new Date().toISOString(),
          bundle_id: logData.bundle_id
        }
      }
    });

    return NextResponse.json({
      success: true,
      log_id: enforcementCall.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error logging OPA decision:', error);
    return NextResponse.json(
      { error: 'Failed to log decision' },
      { status: 500 }
    );
  }
}
