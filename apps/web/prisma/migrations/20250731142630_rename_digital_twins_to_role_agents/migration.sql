/*
  Warnings:

  - You are about to drop the column `digitalTwinId` on the `blockchain_transactions` table. All the data in the column will be lost.
  - You are about to drop the column `digitalTwinId` on the `certifications` table. All the data in the column will be lost.
  - You are about to drop the column `digitalTwinId` on the `signals` table. All the data in the column will be lost.
  - You are about to drop the `digital_twins` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roleAgentId` to the `certifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleAgentId` to the `signals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "blockchain_transactions" DROP CONSTRAINT "blockchain_transactions_digitalTwinId_fkey";

-- DropForeignKey
ALTER TABLE "certifications" DROP CONSTRAINT "certifications_digitalTwinId_fkey";

-- DropForeignKey
ALTER TABLE "digital_twins" DROP CONSTRAINT "digital_twins_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "digital_twins" DROP CONSTRAINT "digital_twins_roleTemplateId_fkey";

-- DropForeignKey
ALTER TABLE "signals" DROP CONSTRAINT "signals_digitalTwinId_fkey";

-- DropIndex
DROP INDEX "idx_certifications_digital_twin";

-- DropIndex
DROP INDEX "idx_signals_digital_twin";

-- AlterTable
ALTER TABLE "blockchain_transactions" DROP COLUMN "digitalTwinId",
ADD COLUMN     "roleAgentId" TEXT;

-- AlterTable
ALTER TABLE "certifications" DROP COLUMN "digitalTwinId",
ADD COLUMN     "roleAgentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "signals" DROP COLUMN "digitalTwinId",
ADD COLUMN     "roleAgentId" TEXT NOT NULL;

-- DropTable
DROP TABLE "digital_twins";

-- CreateTable
CREATE TABLE "role_agents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "blockchainAddress" TEXT,
    "soulboundTokenId" TEXT,
    "blockchainNetwork" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "level" INTEGER NOT NULL DEFAULT 1,
    "organizationId" TEXT NOT NULL,
    "roleTemplateId" TEXT NOT NULL,
    "assignedToDid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assignedTo" TEXT,
    "isEligibleForMint" BOOLEAN NOT NULL DEFAULT false,
    "lastTrustCheck" TIMESTAMP(3),
    "trustScore" DOUBLE PRECISION,

    CONSTRAINT "role_agents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_role_agents_assigned" ON "role_agents"("assignedToDid");

-- CreateIndex
CREATE INDEX "idx_role_agents_blockchain" ON "role_agents"("blockchainAddress");

-- CreateIndex
CREATE INDEX "idx_role_agents_eligible" ON "role_agents"("isEligibleForMint");

-- CreateIndex
CREATE INDEX "idx_role_agents_org" ON "role_agents"("organizationId");

-- CreateIndex
CREATE INDEX "idx_role_agents_role" ON "role_agents"("roleTemplateId");

-- CreateIndex
CREATE INDEX "idx_role_agents_status" ON "role_agents"("status");

-- CreateIndex
CREATE INDEX "idx_role_agents_trust" ON "role_agents"("trustScore");

-- CreateIndex
CREATE INDEX "idx_certifications_role_agent" ON "certifications"("roleAgentId");

-- CreateIndex
CREATE INDEX "idx_signals_role_agent" ON "signals"("roleAgentId");

-- AddForeignKey
ALTER TABLE "blockchain_transactions" ADD CONSTRAINT "blockchain_transactions_roleAgentId_fkey" FOREIGN KEY ("roleAgentId") REFERENCES "role_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_roleAgentId_fkey" FOREIGN KEY ("roleAgentId") REFERENCES "role_agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_agents" ADD CONSTRAINT "role_agents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_agents" ADD CONSTRAINT "role_agents_roleTemplateId_fkey" FOREIGN KEY ("roleTemplateId") REFERENCES "role_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signals" ADD CONSTRAINT "signals_roleAgentId_fkey" FOREIGN KEY ("roleAgentId") REFERENCES "role_agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
