-- AlterTable
ALTER TABLE "digital_twins" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "isEligibleForMint" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastTrustCheck" TIMESTAMP(3),
ADD COLUMN     "trustScore" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "role_trust_thresholds" (
    "id" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "minTrustScore" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_trust_thresholds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_role_threshold_org" ON "role_trust_thresholds"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "role_trust_thresholds_organizationId_roleTitle_key" ON "role_trust_thresholds"("organizationId", "roleTitle");

-- CreateIndex
CREATE INDEX "idx_digital_twins_trust" ON "digital_twins"("trustScore");

-- CreateIndex
CREATE INDEX "idx_digital_twins_eligible" ON "digital_twins"("isEligibleForMint");

-- AddForeignKey
ALTER TABLE "role_trust_thresholds" ADD CONSTRAINT "role_trust_thresholds_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
