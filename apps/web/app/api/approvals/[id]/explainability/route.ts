import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const snap = await prisma.explainabilitySnapshot.findUnique({
      where: { approvalRequestId: params.id }
    });
    if (!snap) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ snapshot: snap });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
