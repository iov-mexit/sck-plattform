import { NextRequest, NextResponse } from "next/server";
import { trustEconomySystem } from "../../../../../lib/trust-economy/trust-token-system";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, organizationId, rewardType, amount, reason } = body;

    // Validate required fields
    if (!userId || !organizationId || !rewardType || !amount || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Award trust tokens
    const reward = await trustEconomySystem.awardTrustTokens({
      userId,
      organizationId,
      rewardType,
      amount,
      reason
    });

    return NextResponse.json({
      success: true,
      reward,
      message: "Trust tokens awarded successfully"
    });

  } catch (error) {
    console.error("Error awarding trust tokens:", error);
    return NextResponse.json(
      { error: "Failed to award trust tokens" },
      { status: 500 }
    );
  }
}
