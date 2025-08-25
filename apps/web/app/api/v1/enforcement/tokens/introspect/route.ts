import { NextRequest, NextResponse } from "next/server";
import { introspectGatewayToken } from "@/lib/enforcement/gateway-token-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Missing token" },
        { status: 400 }
      );
    }

    const introspection = await introspectGatewayToken(token);
    return NextResponse.json({ introspection });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
