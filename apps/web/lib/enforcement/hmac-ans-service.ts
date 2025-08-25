import crypto from "crypto";
import { createTrustLedgerEvent } from "@/lib/governance/trust-ledger";

export type HMACSignatureInput = {
  method: string;
  path: string;
  timestamp: string;
  bodyHash: string;
  upstreamId: string;
  organizationId: string;
};

export type HMACVerificationInput = {
  signature: string;
  method: string;
  path: string;
  timestamp: string;
  body: string;
  upstreamId: string;
  organizationId: string;
};

export function generateHMACSignature(input: HMACSignatureInput): string {
  const canonicalString = [
    input.method.toUpperCase(),
    input.path,
    input.timestamp,
    input.bodyHash,
    input.upstreamId
  ].join("\n");

  const secret = getSharedSecret(input.upstreamId, input.organizationId);
  return crypto.createHmac("sha256", secret)
    .update(canonicalString)
    .digest("hex");
}

export function verifyHMACSignature(input: HMACVerificationInput): boolean {
  try {
    // 1. Check timestamp (allow 5 minute clock skew)
    const requestTime = new Date(input.timestamp).getTime();
    const now = Date.now();
    const timeDiff = Math.abs(now - requestTime);
    
    if (timeDiff > 5 * 60 * 1000) { // 5 minutes
      return false;
    }

    // 2. Generate expected signature
    const bodyHash = crypto.createHash("sha256").update(input.body).digest("hex");
    const expectedSignature = generateHMACSignature({
      method: input.method,
      path: input.path,
      timestamp: input.timestamp,
      bodyHash,
      upstreamId: input.upstreamId,
      organizationId: input.organizationId
    });

    // 3. Compare signatures
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "hex"),
      Buffer.from(input.signature, "hex")
    );
  } catch (error) {
    return false;
  }
}

export function generateANSHeaders(
  input: HMACSignatureInput,
  signature: string
): Record<string, string> {
  return {
    "X-SCK-Signature": `hmac-sha256=${signature}`,
    "X-SCK-Timestamp": input.timestamp,
    "X-SCK-ANS-ID": input.upstreamId,
    "X-SCK-Organization": input.organizationId
  };
}

export async function logEnforcementCall(
  organizationId: string,
  upstreamId: string,
  method: string,
  path: string,
  result: "ALLOW" | "DENY" | "ERROR",
  decisionReason?: string,
  metadata?: any
) {
  // Log to trust ledger
  await createTrustLedgerEvent({
    artifactType: "ENFORCEMENT_CALL",
    artifactId: crypto.randomUUID(),
    action: "ENFORCEMENT_CALL_SIGNED",
    payload: {
      upstreamId,
      method,
      path,
      result,
      decisionReason,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        organizationId,
        hmacValid: result === "ALLOW"
      }
    }
  });
}

function getSharedSecret(upstreamId: string, organizationId: string): string {
  // In production, this should be stored securely and rotated regularly
  const baseSecret = process.env.HMAC_SHARED_SECRET || "default-hmac-secret";
  return crypto.createHash("sha256")
    .update(`${baseSecret}:${upstreamId}:${organizationId}`)
    .digest("hex");
}

export function validateANSIdentity(upstreamId: string, expectedScopes: string[]): boolean {
  // Placeholder: in production, resolve ANS ID and verify scopes
  // For now, accept any valid ANS ID format
  const ansPattern = /^[a-zA-Z0-9-]+\.knaight$/;
  return ansPattern.test(upstreamId);
}

export function extractHMACHeaders(headers: Record<string, string>): {
  signature: string;
  timestamp: string;
  ansId: string;
  organization: string;
} {
  const signature = headers["x-sck-signature"]?.replace("hmac-sha256=", "") || "";
  const timestamp = headers["x-sck-timestamp"] || "";
  const ansId = headers["x-sck-ans-id"] || "";
  const organization = headers["x-sck-organization"] || "";

  return { signature, timestamp, ansId, organization };
}
