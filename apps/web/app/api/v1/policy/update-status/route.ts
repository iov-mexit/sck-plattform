import { NextResponse } from "next/server";
import prisma from "@/lib/database";

export async function PUT(req: Request) {
  try {
    const { policyId, status } = await req.json();

    if (!policyId || !status) {
      return NextResponse.json(
        { error: "Missing policyId or status" },
        { status: 400 }
      );
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be pending, approved, or rejected" },
        { status: 400 }
      );
    }

    const updated = await prisma.policyDraft.update({
      where: { id: policyId },
      data: { status },
    });

    return NextResponse.json({ success: true, policy: updated });
  } catch (err) {
    console.error("❌ Error updating policy status:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
