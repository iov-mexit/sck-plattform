import { NextRequest, NextResponse } from "next/server";
import { revokeGatewayToken } from "@/lib/enforcement/gateway-token-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tokenId, organizationId } = body;

    if (!tokenId || !organizationId) {
      return NextResponse.json(
        { error: "Missing tokenId or organizationId" },
        { status: 400 }
      );
    }

    const result = await revokeGatewayToken(tokenId, organizationId);
    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
