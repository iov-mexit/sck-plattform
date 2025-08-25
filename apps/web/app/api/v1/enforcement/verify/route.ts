import { NextRequest, NextResponse } from "next/server";
import { verifyHMACSignature, extractHMACHeaders, validateANSIdentity, logEnforcementCall } from "@/lib/enforcement/hmac-ans-service";

export async function POST(req: NextRequest) {
  try {
    const headers = extractHMACHeaders(req.headers as any);
    const body = await req.text();

    if (!headers.signature || !headers.timestamp || !headers.ansId || !headers.organization) {
      return NextResponse.json(
        { error: "Missing required HMAC headers" },
        { status: 400 }
      );
    }

    // 1. Validate ANS identity
    if (!validateANSIdentity(headers.ansId, ["mcp:invoke", "policy:read"])) {
      await logEnforcementCall(
        headers.organization,
        headers.ansId,
        req.method,
        req.nextUrl.pathname,
        "DENY",
        "Invalid ANS identity"
      );
      return NextResponse.json(
        { error: "Invalid ANS identity" },
        { status: 403 }
      );
    }

    // 2. Verify HMAC signature
    const isValid = verifyHMACSignature({
      signature: headers.signature,
      method: req.method,
      path: req.nextUrl.pathname,
      timestamp: headers.timestamp,
      body,
      upstreamId: headers.ansId,
      organizationId: headers.organization
    });

    if (!isValid) {
      await logEnforcementCall(
        headers.organization,
        headers.ansId,
        req.method,
        req.nextUrl.pathname,
        "DENY",
        "HMAC signature verification failed"
      );
      return NextResponse.json(
        { error: "Signature verification failed" },
        { status: 403 }
      );
    }

    // 3. Log successful enforcement call
    await logEnforcementCall(
      headers.organization,
      headers.ansId,
      req.method,
      req.nextUrl.pathname,
      "ALLOW",
      "HMAC signature verified successfully",
      {
        bodyHash: require("crypto").createHash("sha256").update(body).digest("hex"),
        headers: Object.fromEntries(req.headers.entries())
      }
    );

    // 4. Return success
    return NextResponse.json({
      verified: true,
      upstreamId: headers.ansId,
      organization: headers.organization,
      timestamp: headers.timestamp
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
