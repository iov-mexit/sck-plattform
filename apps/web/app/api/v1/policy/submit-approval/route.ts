import { NextResponse } from "next/server";
import prisma from "@/lib/database";

export async function POST(req: Request) {
  try {
    const { query, draft } = await req.json();

    if (!query || !draft) {
      return NextResponse.json(
        { error: "Missing query or draft" },
        { status: 400 }
      );
    }

    const saved = await prisma.policyDraft.create({
      data: { query, draft },
    });

    return NextResponse.json({ success: true, policy: saved });
  } catch (err) {
    console.error("❌ Error saving policy draft:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    
    const policies = await prisma.policyDraft.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, policies });
  } catch (err) {
    console.error("❌ Error fetching policy drafts:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
