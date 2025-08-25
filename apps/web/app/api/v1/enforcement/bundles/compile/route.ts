import { NextRequest, NextResponse } from "next/server";
import { compilePolicyBundle } from "@/lib/enforcement/policy-bundle-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizationId, version, artifacts, policies, controls } = body;

    if (!organizationId || !version || !artifacts || !policies) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bundle = await compilePolicyBundle({
      organizationId,
      version,
      artifacts: artifacts || [],
      policies: policies || [],
      controls: controls || []
    });

    return NextResponse.json({ bundle });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
