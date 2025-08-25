import { NextRequest, NextResponse } from "next/server";
import { advancedPolicyEngine } from "../../../../lib/policy/advanced-policy-engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, componentIds, organizationId, complexity } = body;

    // Validate required fields
    if (!name || !description || !componentIds || !organizationId || !complexity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Compose policy using advanced engine
    const composition = await advancedPolicyEngine.composePolicy({
      name,
      description,
      componentIds,
      organizationId,
      complexity
    });

    return NextResponse.json({
      success: true,
      composition,
      message: "Policy composed successfully"
    });

  } catch (error) {
    console.error("Error composing policy:", error);
    return NextResponse.json(
      { error: "Failed to compose policy" },
      { status: 500 }
    );
  }
}
