-- AlterTable
ALTER TABLE "role_agents" ADD COLUMN     "ansIdentifier" TEXT,
ADD COLUMN     "ansRegistrationError" TEXT,
ADD COLUMN     "ansRegistrationStatus" TEXT DEFAULT 'not_registered',
ADD COLUMN     "ansVerificationUrl" TEXT;

-- CreateIndex
CREATE INDEX "idx_role_agents_ans" ON "role_agents"("ansIdentifier");

-- CreateIndex
CREATE INDEX "idx_role_agents_ans_status" ON "role_agents"("ansRegistrationStatus");
