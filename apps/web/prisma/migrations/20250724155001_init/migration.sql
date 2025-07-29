-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockchain_transactions" (
    "id" TEXT NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "blockNumber" INTEGER,
    "gasUsed" TEXT,
    "gasPrice" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "digitalTwinId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blockchain_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "credentialUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "digitalTwinId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_twins" (
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

    CONSTRAINT "digital_twins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_members" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "domain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_templates" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "focus" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "selectable" BOOLEAN NOT NULL DEFAULT true,
    "responsibilities" JSONB NOT NULL,
    "securityContributions" JSONB NOT NULL,
    "organizationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_templates_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "signals" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "value" DOUBLE PRECISION,
    "source" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "digitalTwinId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT,

    CONSTRAINT "signals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_audit_action" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "idx_audit_created" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "idx_audit_entity" ON "audit_logs"("entity");

-- CreateIndex
CREATE UNIQUE INDEX "blockchain_transactions_transactionHash_key" ON "blockchain_transactions"("transactionHash");

-- CreateIndex
CREATE INDEX "idx_blockchain_tx_hash" ON "blockchain_transactions"("transactionHash");

-- CreateIndex
CREATE INDEX "idx_blockchain_tx_network" ON "blockchain_transactions"("network");

-- CreateIndex
CREATE INDEX "idx_blockchain_tx_status" ON "blockchain_transactions"("status");

-- CreateIndex
CREATE INDEX "idx_certifications_digital_twin" ON "certifications"("digitalTwinId");

-- CreateIndex
CREATE INDEX "idx_certifications_expires" ON "certifications"("expiresAt");

-- CreateIndex
CREATE INDEX "idx_certifications_verified" ON "certifications"("verified");

-- CreateIndex
CREATE INDEX "idx_digital_twins_assigned" ON "digital_twins"("assignedToDid");

-- CreateIndex
CREATE INDEX "idx_digital_twins_blockchain" ON "digital_twins"("blockchainAddress");

-- CreateIndex
CREATE INDEX "idx_digital_twins_eligible" ON "digital_twins"("isEligibleForMint");

-- CreateIndex
CREATE INDEX "idx_digital_twins_org" ON "digital_twins"("organizationId");

-- CreateIndex
CREATE INDEX "idx_digital_twins_role" ON "digital_twins"("roleTemplateId");

-- CreateIndex
CREATE INDEX "idx_digital_twins_status" ON "digital_twins"("status");

-- CreateIndex
CREATE INDEX "idx_digital_twins_trust" ON "digital_twins"("trustScore");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_domain_key" ON "organizations"("domain");

-- CreateIndex
CREATE INDEX "idx_organizations_active" ON "organizations"("isActive");

-- CreateIndex
CREATE INDEX "idx_organizations_domain" ON "organizations"("domain");

-- CreateIndex
CREATE INDEX "idx_role_threshold_org" ON "role_trust_thresholds"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "role_trust_thresholds_organizationId_roleTitle_key" ON "role_trust_thresholds"("organizationId", "roleTitle");

-- CreateIndex
CREATE INDEX "idx_signals_digital_twin" ON "signals"("digitalTwinId");

-- CreateIndex
CREATE INDEX "idx_signals_type" ON "signals"("type");

-- CreateIndex
CREATE INDEX "idx_signals_verified" ON "signals"("verified");

-- AddForeignKey
ALTER TABLE "blockchain_transactions" ADD CONSTRAINT "blockchain_transactions_digitalTwinId_fkey" FOREIGN KEY ("digitalTwinId") REFERENCES "digital_twins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_digitalTwinId_fkey" FOREIGN KEY ("digitalTwinId") REFERENCES "digital_twins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_twins" ADD CONSTRAINT "digital_twins_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_twins" ADD CONSTRAINT "digital_twins_roleTemplateId_fkey" FOREIGN KEY ("roleTemplateId") REFERENCES "role_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_templates" ADD CONSTRAINT "role_templates_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_trust_thresholds" ADD CONSTRAINT "role_trust_thresholds_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signals" ADD CONSTRAINT "signals_digitalTwinId_fkey" FOREIGN KEY ("digitalTwinId") REFERENCES "digital_twins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
