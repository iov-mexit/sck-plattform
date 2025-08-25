import { NextRequest, NextResponse } from "next/server";
import { issueGatewayToken } from "@/lib/enforcement/gateway-token-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      organizationId,
      artifactId,
      artifactType,
      loaLevel,
      scope,
      bundleVersion,
      issuedFor,
      issuerId,
      ttlSeconds
    } = body;

    if (!organizationId || !artifactId || !artifactType || !loaLevel || !scope || !issuerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await issueGatewayToken({
      organizationId,
      artifactId,
      artifactType,
      loaLevel,
      scope,
      bundleVersion,
      issuedFor,
      issuerId,
      ttlSeconds
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
