import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const projectPhase = searchParams.get('projectPhase');

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
    }

    let whereClause: any = { organizationId };
    if (projectPhase) {
      whereClause.projectPhase = projectPhase;
    }

    const compositions = await prisma.teamComposition.findMany({
      where: whereClause,
      include: {
        organization: {
          select: { name: true, domain: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ compositions });
  } catch (error) {
    console.error('Error fetching team compositions:', error);
    return NextResponse.json({ error: 'Failed to fetch team compositions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, projectPhase, requirements, suggestedTeam, gaps } = body;

    if (!organizationId || !projectPhase || !requirements) {
      return NextResponse.json({ 
        error: 'Organization ID, project phase, and requirements are required' 
      }, { status: 400 });
    }

    const composition = await prisma.teamComposition.create({
      data: {
        organizationId,
        projectPhase,
        requirements,
        suggestedTeam: suggestedTeam || [],
        gaps: gaps || null
      },
      include: {
        organization: {
          select: { name: true, domain: true }
        }
      }
    });

    return NextResponse.json({ composition }, { status: 201 });
  } catch (error) {
    console.error('Error creating team composition:', error);
    return NextResponse.json({ error: 'Failed to create team composition' }, { status: 500 });
  }
}
