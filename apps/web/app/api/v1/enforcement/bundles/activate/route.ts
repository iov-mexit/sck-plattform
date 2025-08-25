import { NextRequest, NextResponse } from "next/server";
import { activatePolicyBundle } from "@/lib/enforcement/policy-bundle-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bundleId } = body;

    if (!bundleId) {
      return NextResponse.json(
        { error: "Missing bundleId" },
        { status: 400 }
      );
    }

    const bundle = await activatePolicyBundle(bundleId);
    return NextResponse.json({ bundle });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
