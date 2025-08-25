import { NextRequest, NextResponse } from "next/server";
import { trustEconomySystem } from "../../../../lib/trust-economy/trust-token-system";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      credentialId,
      sellerId,
      price,
      currency,
      description,
      trustScore,
      verificationStatus,
      expiresInDays
    } = body;

    // Validate required fields
    if (!credentialId || !sellerId || !price || !currency || !description || !trustScore || !verificationStatus || !expiresInDays) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // List credential in marketplace
    const marketplace = await trustEconomySystem.listCredential({
      credentialId,
      sellerId,
      price,
      currency,
      description,
      trustScore,
      verificationStatus,
      expiresInDays
    });

    return NextResponse.json({
      success: true,
      marketplace,
      message: "Credential listed successfully"
    });

  } catch (error) {
    console.error("Error listing credential:", error);
    return NextResponse.json(
      { error: "Failed to list credential" },
      { status: 500 }
    );
  }
}
