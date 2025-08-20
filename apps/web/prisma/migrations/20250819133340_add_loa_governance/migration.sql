-- CreateTable
CREATE TABLE "loa_policies" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "artifactType" TEXT NOT NULL,
    "minReviewers" INTEGER NOT NULL,
    "requiredFacets" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loa_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approvals" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "artifactId" TEXT NOT NULL,
    "artifactType" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "facet" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approvals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_loa_policies_org" ON "loa_policies"("organizationId");

-- CreateIndex
CREATE INDEX "idx_approvals_org" ON "approvals"("organizationId");

-- AddForeignKey
ALTER TABLE "loa_policies" ADD CONSTRAINT "loa_policies_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
