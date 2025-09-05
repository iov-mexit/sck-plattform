import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const projectId = searchParams.get('projectId');

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    let whereClause: any = { organizationId };
    if (projectId) {
      whereClause.projectId = projectId;
    }

    const phases = await prisma.projectPhase.findMany({
      where: whereClause,
      include: {
        organization: {
          select: { name: true, domain: true }
        }
      },
      orderBy: { startDate: 'asc' }
    });

    return NextResponse.json({ phases });
  } catch (error) {
    console.error('Error fetching project phases:', error);
    return NextResponse.json({ error: 'Failed to fetch project phases' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, projectId, phaseName, startDate, endDate, requiredSkills } = body;

    if (!organizationId || !projectId || !phaseName || !requiredSkills) {
      return NextResponse.json({ 
        error: 'Organization ID, project ID, phase name, and required skills are required' 
      }, { status: 400 });
    }

    const phase = await prisma.projectPhase.create({
      data: {
        organizationId,
        projectId,
        phaseName,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        requiredSkills
      },
      include: {
        organization: {
          select: { name: true, domain: true }
        }
      }
    });

    return NextResponse.json({ phase }, { status: 201 });
  } catch (error) {
    console.error('Error creating project phase:', error);
    return NextResponse.json({ error: 'Failed to create project phase' }, { status: 500 });
  }
}
