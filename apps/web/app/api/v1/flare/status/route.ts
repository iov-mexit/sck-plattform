import { NextRequest, NextResponse } from "next/server";
import { getFlareStatus } from "@/lib/blockchain/flare";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest) {
  try {
    const status = await getFlareStatus();
    return NextResponse.json({ success: true, status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch Flare status" },
      { status: 500 }
    );
  }
}


