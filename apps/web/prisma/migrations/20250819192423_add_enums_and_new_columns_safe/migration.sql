/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `role_agents` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BlockchainTxStatus" AS ENUM ('pending', 'confirmed', 'failed');

-- CreateEnum
CREATE TYPE "BlockchainTxType" AS ENUM ('NFT_MINT', 'TRANSFER', 'OTHER');

-- CreateEnum
CREATE TYPE "RoleAgentStatus" AS ENUM ('active', 'inactive', 'suspended', 'retired');

-- CreateEnum
CREATE TYPE "ArtifactType" AS ENUM ('RoleAgent', 'MCP');

-- CreateEnum
CREATE TYPE "ApprovalFacet" AS ENUM ('security', 'compliance', 'policy', 'risk');

-- CreateEnum
CREATE TYPE "ApprovalDecision" AS ENUM ('approve', 'reject');

-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('draft', 'active', 'archived');

-- AlterTable
ALTER TABLE "approvals" ADD COLUMN     "artifactTypeNew" "ArtifactType",
ADD COLUMN     "decisionNew" "ApprovalDecision",
ADD COLUMN     "facetNew" "ApprovalFacet";

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "roleAgentId" TEXT;

-- AlterTable
ALTER TABLE "blockchain_transactions" ADD COLUMN     "statusNew" "BlockchainTxStatus",
ADD COLUMN     "transactionTypeNew" "BlockchainTxType";

-- AlterTable
ALTER TABLE "certifications" ADD COLUMN     "verificationMethod" TEXT;

-- AlterTable
ALTER TABLE "loa_policies" ADD COLUMN     "artifactTypeNew" "ArtifactType",
ADD COLUMN     "requiredFacetsNew" "ApprovalFacet"[];

-- AlterTable
ALTER TABLE "mcp_policies" ADD COLUMN     "statusNew" "PolicyStatus";

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "complianceTags" JSONB;

-- AlterTable
ALTER TABLE "role_agents" DROP COLUMN "assignedTo",
ADD COLUMN     "assignedToUserId" TEXT,
ADD COLUMN     "statusNew" "RoleAgentStatus",
ALTER COLUMN "assignedToDid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "role_trust_thresholds" ADD COLUMN     "minLoALevel" INTEGER;

-- AlterTable
ALTER TABLE "signals" ADD COLUMN     "confidence" DOUBLE PRECISION,
ADD COLUMN     "sourceType" TEXT;

-- CreateTable
CREATE TABLE "trust_histories" (
    "id" TEXT NOT NULL,
    "roleAgentId" TEXT NOT NULL,
    "trustScore" DOUBLE PRECISION NOT NULL,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "trust_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_trust_histories_role_agent" ON "trust_histories"("roleAgentId");

-- CreateIndex
CREATE INDEX "idx_trust_histories_time" ON "trust_histories"("computedAt");

-- CreateIndex
CREATE INDEX "idx_role_agents_assigned_user" ON "role_agents"("assignedToUserId");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_roleAgentId_fkey" FOREIGN KEY ("roleAgentId") REFERENCES "role_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trust_histories" ADD CONSTRAINT "trust_histories_roleAgentId_fkey" FOREIGN KEY ("roleAgentId") REFERENCES "role_agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "idx_role_agents_assigned" RENAME TO "idx_role_agents_assigned_did";
