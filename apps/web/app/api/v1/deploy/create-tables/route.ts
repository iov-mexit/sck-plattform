import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Creating Team Composition Engine tables...');

    // Create TeamComposition table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "team_compositions" (
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
    `;

    // Create ProjectPhase table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "project_phases" (
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
    `;

    // Create indexes
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "idx_team_compositions_org" ON "team_compositions"("organizationId");
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "idx_team_compositions_phase" ON "team_compositions"("projectPhase");
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "idx_team_compositions_created" ON "team_compositions"("createdAt");
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "idx_project_phases_org" ON "project_phases"("organizationId");
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "idx_project_phases_project" ON "project_phases"("projectId");
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "idx_project_phases_name" ON "project_phases"("phaseName");
    `;

    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "idx_project_phases_start" ON "project_phases"("startDate");
    `;

    // Add foreign key constraints
    await prisma.$executeRaw`
      ALTER TABLE "team_compositions" 
      ADD CONSTRAINT IF NOT EXISTS "team_compositions_organizationId_fkey" 
      FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `;

    await prisma.$executeRaw`
      ALTER TABLE "project_phases" 
      ADD CONSTRAINT IF NOT EXISTS "project_phases_organizationId_fkey" 
      FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `;

    console.log('✅ Team Composition Engine tables created successfully');

    return NextResponse.json({
      success: true,
      message: 'Team Composition Engine tables created successfully',
      tables: ['team_compositions', 'project_phases'],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create tables',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}


