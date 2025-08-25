import { describe, it, expect } from "vitest";

describe("Explainability API", () => {
  it("builds snapshot when POST /api/explainability/build", async () => {
    const res = await fetch("http://localhost:3000/api/explainability/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approvalRequestId: "test-approval-1",
        query: "Approve deployment of MCP Gateway v1.2 for OrgA",
        loaLevel: 3,
        organizationId: "org-a"
      })
    });
    const json = await res.json();
    expect(res.status).toBeLessThan(500);
    expect(json.snapshot).toBeDefined();
    expect(json.snapshot.rationale).toBeDefined();
  });
});
