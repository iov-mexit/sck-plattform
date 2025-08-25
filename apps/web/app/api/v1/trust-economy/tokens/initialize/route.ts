import { NextRequest, NextResponse } from "next/server";
import { trustEconomySystem } from "../../../../lib/trust-economy/trust-token-system";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizationId, symbol, name, initialSupply, network } = body;

    // Validate required fields
    if (!organizationId || !symbol || !name || !initialSupply || !network) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize trust token
    const trustToken = await trustEconomySystem.initializeTrustToken({
      organizationId,
      symbol,
      name,
      initialSupply,
      network
    });

    return NextResponse.json({
      success: true,
      trustToken,
      message: "Trust token initialized successfully"
    });

  } catch (error) {
    console.error("Error initializing trust token:", error);
    return NextResponse.json(
      { error: "Failed to initialize trust token" },
      { status: 500 }
    );
  }
}
