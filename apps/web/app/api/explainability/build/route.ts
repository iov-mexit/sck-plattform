import { NextRequest, NextResponse } from "next/server";
import { buildExplainabilitySnapshot } from "@/lib/explainability/build";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { approvalRequestId, query, loaLevel, organizationId } = body;
    if (!approvalRequestId || !query || !loaLevel) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const snapshot = await buildExplainabilitySnapshot({ approvalRequestId, query, loaLevel, organizationId });
    return NextResponse.json({ snapshot });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
