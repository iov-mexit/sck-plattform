-- CreateTable
CREATE TABLE "team_compositions" (
    "id" TEXT NOT NULL,
    "projectPhase" TEXT NOT NULL,
    "requirements" JSONB NOT NULL,
    "suggestedTeam" JSONB NOT NULL,
    "gaps" JSONB,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_compositions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_phases" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "phaseName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "requiredSkills" JSONB NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_phases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_team_compositions_org" ON "team_compositions"("organizationId");

-- CreateIndex
CREATE INDEX "idx_team_compositions_phase" ON "team_compositions"("projectPhase");

-- CreateIndex
CREATE INDEX "idx_team_compositions_created" ON "team_compositions"("createdAt");

-- CreateIndex
CREATE INDEX "idx_project_phases_org" ON "project_phases"("organizationId");

-- CreateIndex
CREATE INDEX "idx_project_phases_project" ON "project_phases"("projectId");

-- CreateIndex
CREATE INDEX "idx_project_phases_name" ON "project_phases"("phaseName");

-- CreateIndex
CREATE INDEX "idx_project_phases_start" ON "project_phases"("startDate");

-- AddForeignKey
ALTER TABLE "team_compositions" ADD CONSTRAINT "team_compositions_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_phases" ADD CONSTRAINT "project_phases_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
