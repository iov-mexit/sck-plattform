import prisma from "@/lib/database";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { createTrustLedgerEvent } from "@/lib/governance/trust-ledger";

export type TokenIssueInput = {
  organizationId: string;
  artifactId: string;
  artifactType: string;
  loaLevel: number;
  scope: string[];
  bundleVersion?: string;
  issuedFor?: string;
  issuerId: string;
  ttlSeconds?: number;
};

export type TokenIntrospection = {
  valid: boolean;
  tokenId: string;
  artifactId: string;
  artifactType: string;
  loaLevel: number;
  scope: string[];
  bundleVersion?: string;
  issuedAt: number;
  expiresAt: number;
  revoked: boolean;
  issuer: string;
};

export async function issueGatewayToken(input: TokenIssueInput) {
  // 1. Validate issuer permissions
  const issuer = await prisma.roleAgent.findUnique({
    where: { id: input.issuerId }
  });

  if (!issuer) throw new Error("Issuer not found");
  if (issuer.organizationId !== input.organizationId) throw new Error("Issuer not in organization");

  // 2. Validate artifact approval
  const approval = await prisma.approvalRequest.findFirst({
    where: {
      artifactId: input.artifactId,
      organizationId: input.organizationId,
      status: "APPROVED"
    }
  });

  if (!approval) throw new Error("Artifact not approved");

  // 3. Generate JWT token
  const tokenId = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  const ttl = input.ttlSeconds || 900; // 15 minutes default
  const expiresAt = now + ttl;

  const payload = {
    sub: input.artifactId,
    loa: input.loaLevel,
    scope: input.scope,
    bnd: input.bundleVersion,
    exp: expiresAt,
    iat: now,
    jti: tokenId,
    org: input.organizationId,
    iss: input.issuerId
  };

  const secret = process.env.JWT_SECRET || "default-secret";
  const token = jwt.sign(payload, secret, { algorithm: "HS256" });

  // 4. Store token record
  const tokenRecord = await prisma.gatewayToken.create({
    data: {
      organizationId: input.organizationId,
      tokenId,
      artifactId: input.artifactId,
      artifactType: input.artifactType,
      loaLevel: input.loaLevel,
      scope: input.scope,
      bundleVersion: input.bundleVersion,
      expiresAt: new Date(expiresAt * 1000),
      issuedBy: input.issuerId,
      issuedFor: input.issuedFor
    }
  });

  // 5. Log to trust ledger
  await createTrustLedgerEvent({
    artifactType: "GATEWAY_TOKEN",
    artifactId: tokenId,
    action: "TOKEN_ISSUED",
    payload: {
      tokenId,
      artifactId: input.artifactId,
      loaLevel: input.loaLevel,
      scope: input.scope,
      expiresAt: new Date(expiresAt * 1000).toISOString()
    }
  });

  return {
    token,
    tokenId,
    expiresAt: new Date(expiresAt * 1000),
    metadata: {
      artifactId: input.artifactId,
      loaLevel: input.loaLevel,
      scope: input.scope
    }
  };
}

export async function revokeGatewayToken(tokenId: string, organizationId: string) {
  const token = await prisma.gatewayToken.findUnique({
    where: { tokenId }
  });

  if (!token) throw new Error("Token not found");
  if (token.organizationId !== organizationId) throw new Error("Token not in organization");
  if (token.revokedAt) throw new Error("Token already revoked");

  const updatedToken = await prisma.gatewayToken.update({
    where: { tokenId },
    data: { revokedAt: new Date() }
  });

  // Log to trust ledger
  await createTrustLedgerEvent({
    artifactType: "GATEWAY_TOKEN",
    artifactId: tokenId,
    action: "TOKEN_REVOKED",
    payload: {
      tokenId,
      artifactId: token.artifactId,
      revokedAt: new Date().toISOString()
    }
  });

  return updatedToken;
}

export async function introspectGatewayToken(token: string): Promise<TokenIntrospection> {
  try {
    const secret = process.env.JWT_SECRET || "default-secret";
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] }) as any;

    // Check if token is revoked
    const tokenRecord = await prisma.gatewayToken.findUnique({
      where: { tokenId: decoded.jti }
    });

    if (!tokenRecord) {
      return {
        valid: false,
        tokenId: decoded.jti,
        artifactId: decoded.sub,
        artifactType: "",
        loaLevel: 0,
        scope: [],
        issuedAt: decoded.iat,
        expiresAt: decoded.exp,
        revoked: true,
        issuer: decoded.iss
      };
    }

    return {
      valid: !tokenRecord.revokedAt && Date.now() < tokenRecord.expiresAt.getTime(),
      tokenId: decoded.jti,
      artifactId: decoded.sub,
      artifactType: tokenRecord.artifactType,
      loaLevel: tokenRecord.loaLevel,
      scope: tokenRecord.scope,
      bundleVersion: tokenRecord.bundleVersion || undefined,
      issuedAt: decoded.iat,
      expiresAt: decoded.exp,
      revoked: !!tokenRecord.revokedAt,
      issuer: decoded.iss
    };
  } catch (error) {
    return {
      valid: false,
      tokenId: "",
      artifactId: "",
      artifactType: "",
      loaLevel: 0,
      scope: [],
      issuedAt: 0,
      expiresAt: 0,
      revoked: false,
      issuer: ""
    };
  }
}

export async function validateTokenForAccess(
  token: string,
  requiredScope: string,
  requiredLoA: number
): Promise<boolean> {
  const introspection = await introspectGatewayToken(token);

  if (!introspection.valid) return false;
  if (introspection.revoked) return false;
  if (introspection.loaLevel < requiredLoA) return false;
  if (!introspection.scope.includes(requiredScope)) return false;

  return true;
}
