import { NextRequest, NextResponse } from "next/server";
import { advancedPolicyEngine } from "@/lib/policy/advanced-policy-engine";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const policyId = searchParams.get("policyId");

    if (!policyId) {
      return NextResponse.json(
        { error: "Policy ID is required" },
        { status: 400 }
      );
    }

    // Get comprehensive policy analytics
    const analytics = await advancedPolicyEngine.getPolicyAnalytics(policyId);

    return NextResponse.json({
      success: true,
      analytics,
      message: "Policy analytics retrieved successfully"
    });

  } catch (error) {
    console.error("Error retrieving policy analytics:", error);
    return NextResponse.json(
      { error: "Failed to retrieve policy analytics" },
      { status: 500 }
    );
  }
}
