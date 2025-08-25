import { NextRequest, NextResponse } from "next/server";
import { publishPolicyBundle } from "@/lib/enforcement/policy-bundle-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bundleId, signerId } = body;

    if (!bundleId || !signerId) {
      return NextResponse.json(
        { error: "Missing bundleId or signerId" },
        { status: 400 }
      );
    }

    const bundle = await publishPolicyBundle(bundleId, signerId);
    return NextResponse.json({ bundle });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
