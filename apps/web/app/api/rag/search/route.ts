import { NextRequest, NextResponse } from "next/server";
import { retrieveHybrid } from "@/lib/rag/retrieval";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, organizationId } = body;
    const result = await retrieveHybrid({ query, organizationId });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

