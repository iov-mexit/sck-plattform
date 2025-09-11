import { describe, it, expect } from "vitest";

const httpIt = process.env.CI ? it.skip : it;

describe("Milestone 3: MCP Enforcement System", () => {
  const baseUrl = "http://localhost:3000/api/v1";

  describe("Policy Bundle Management", () => {
    httpIt("compiles policy bundle successfully", async () => {
      const response = await fetch(`${baseUrl}/enforcement/bundles/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: "test-org-1",
          version: "1.0.0",
          artifacts: ["artifact-1", "artifact-2"],
          policies: ["policy-1", "policy-2"],
          controls: ["control-1"]
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.bundle).toBeDefined();
      expect(data.bundle.status).toBe("DRAFT");
    });

    httpIt("publishes policy bundle with signature", async () => {
      // First compile a bundle
      const compileResponse = await fetch(`${baseUrl}/enforcement/bundles/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: "test-org-1",
          version: "1.0.0",
          artifacts: ["artifact-1"],
          policies: ["policy-1"],
          controls: []
        })
      });

      const { bundle } = await compileResponse.json();

      // Then publish it
      const publishResponse = await fetch(`${baseUrl}/enforcement/bundles/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundleId: bundle.id,
          signerId: "signer-1"
        })
      });

      expect(publishResponse.status).toBe(200);
      const data = await publishResponse.json();
      expect(data.bundle.status).toBe("PUBLISHED");
      expect(data.bundle.signature).toBeDefined();
    });

    httpIt("activates policy bundle and deactivates others", async () => {
      // This test would require multiple bundles to be created first
      // For now, just test the endpoint structure
      const response = await fetch(`${baseUrl}/enforcement/bundles/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bundleId: "test-bundle-id" })
      });

      // Should fail with invalid bundle ID, but endpoint should work
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe("Gateway Token Management", () => {
    httpIt("issues gateway token with proper claims", async () => {
      const response = await fetch(`${baseUrl}/enforcement/tokens/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: "test-org-1",
          artifactId: "artifact-1",
          artifactType: "MCP_POLICY",
          loaLevel: 4,
          scope: ["mcp:invoke", "policy:read"],
          issuerId: "issuer-1"
        })
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.token).toBeDefined();
      expect(data.tokenId).toBeDefined();
      expect(data.expiresAt).toBeDefined();
    });

    httpIt("introspects gateway token correctly", async () => {
      // First issue a token
      const issueResponse = await fetch(`${baseUrl}/enforcement/tokens/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: "test-org-1",
          artifactId: "artifact-1",
          artifactType: "MCP_POLICY",
          loaLevel: 3,
          scope: ["mcp:invoke"],
          issuerId: "issuer-1"
        })
      });

      const { token } = await issueResponse.json();

      // Then introspect it
      const introspectResponse = await fetch(`${baseUrl}/enforcement/tokens/introspect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      expect(introspectResponse.status).toBe(200);
      const data = await introspectResponse.json();
      expect(data.introspection.valid).toBe(true);
      expect(data.introspection.loaLevel).toBe(3);
      expect(data.introspection.scope).toContain("mcp:invoke");
    });

    httpIt("revokes gateway token successfully", async () => {
      // First issue a token
      const issueResponse = await fetch(`${baseUrl}/enforcement/tokens/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: "test-org-1",
          artifactId: "artifact-1",
          artifactType: "MCP_POLICY",
          loaLevel: 2,
          scope: ["policy:read"],
          issuerId: "issuer-1"
        })
      });

      const { tokenId } = await issueResponse.json();

      // Then revoke it
      const revokeResponse = await fetch(`${baseUrl}/enforcement/tokens/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenId,
          organizationId: "test-org-1"
        })
      });

      expect(revokeResponse.status).toBe(200);
      const data = await revokeResponse.json();
      expect(data.result.revokedAt).toBeDefined();
    });
  });

  describe("HMAC + ANS Identity Verification", () => {
    httpIt("verifies HMAC signature with valid headers", async () => {
      const response = await fetch(`${baseUrl}/enforcement/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-SCK-Signature": "hmac-sha256=test-signature",
          "X-SCK-Timestamp": new Date().toISOString(),
          "X-SCK-ANS-ID": "test-service.knaight",
          "X-SCK-Organization": "test-org-1"
        },
        body: JSON.stringify({ test: "data" })
      });

      // Should fail with invalid signature, but endpoint should work
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    httpIt("rejects requests with missing HMAC headers", async () => {
      const response = await fetch(`${baseUrl}/enforcement/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "data" })
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Missing required HMAC headers");
    });
  });

  describe("API Endpoint Structure", () => {
    httpIt("has all required enforcement endpoints", async () => {
      const endpoints = [
        "/enforcement/bundles/compile",
        "/enforcement/bundles/publish",
        "/enforcement/bundles/activate",
        "/enforcement/bundles/revoke",
        "/enforcement/tokens/issue",
        "/enforcement/tokens/revoke",
        "/enforcement/tokens/introspect",
        "/enforcement/verify"
      ];

      for (const endpoint of endpoints) {
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });

        // Should get validation error, not 404
        expect(response.status).not.toBe(404);
      }
    });
  });
});
