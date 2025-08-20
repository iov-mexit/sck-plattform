-- CreateTable
CREATE TABLE "mcp_policies" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL,
    "regoModule" TEXT NOT NULL,
    "sha256" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "scope" JSONB NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mcp_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mcp_policy_tests" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "expected" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mcp_policy_tests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_mcp_policies_org" ON "mcp_policies"("organizationId");

-- CreateIndex
CREATE INDEX "idx_mcp_policies_status" ON "mcp_policies"("status");

-- CreateIndex
CREATE INDEX "idx_mcp_policy_tests_policy" ON "mcp_policy_tests"("policyId");

-- AddForeignKey
ALTER TABLE "mcp_policies" ADD CONSTRAINT "mcp_policies_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mcp_policy_tests" ADD CONSTRAINT "mcp_policy_tests_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "mcp_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
