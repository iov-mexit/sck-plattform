import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const domain = searchParams.get('domain');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause based on parameters
    let whereClause = {};

    if (organizationId) {
      whereClause = { id: organizationId };
    } else if (domain) {
      whereClause = { domain: domain };
    }

    // If we have a specific organizationId or domain, return single organization
    if (organizationId || domain) {
      const organization = await prisma.organizations.findUnique({
        where: organizationId ? { id: organizationId } : { domain: domain || undefined },
        select: {
          id: true,
          name: true,
          description: true,
          domain: true,
          isActive: true,
          onboardingComplete: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              role_agents: true,
              role_templates: true
            }
          }
        }
      });

      if (!organization) {
        return NextResponse.json({
          success: false,
          error: 'Organization not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: organization
      });
    }

    // Otherwise, return list of organizations
    const organizations = await prisma.organizations.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        description: true,
        domain: true,
        isActive: true,
        onboardingComplete: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            role_agents: true,
            role_templates: true
          }
        }
      }
    });

    const totalCount = await prisma.organizations.count({
      where: whereClause
    });

    return NextResponse.json({
      success: true,
      data: organizations,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch organizations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, domain } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Organization name is required' },
        { status: 400 }
      );
    }

    const organization = await prisma.organizations.create({
      data: {
        name,
        description: description || '',
        id: `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        domain: domain || '',
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: organization
    });

  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create organization',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 