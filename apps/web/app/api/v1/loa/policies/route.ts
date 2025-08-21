import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/database';

// GET /api/v1/loa/policies?organizationId=org-123&artifactType=RoleAgent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || undefined;
    const artifactType = searchParams.get('artifactType') || undefined;

    const where: any = {};
    if (organizationId) where.organizationId = organizationId;
    if (artifactType) where.artifactType = artifactType;

    const policies = await prisma.loaPolicy.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            domain: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: policies });
  } catch (error) {
    console.error('GET /loa/policies error', error);
    return NextResponse.json({ success: false, error: 'INTERNAL_SERVER_ERROR' }, { status: 500 });
  }
}

// POST /api/v1/loa/policies
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { organizationId, artifactType, minReviewers, requiredFacets } = body || {};

    // Validate required fields
    if (!artifactType || typeof minReviewers !== 'number' || !Array.isArray(requiredFacets)) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Missing required fields: artifactType, minReviewers, or requiredFacets'
      }, { status: 400 });
    }

    // If no organizationId provided, use the first available organization
    if (!organizationId) {
      const defaultOrg = await prisma.organization.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' }
      });

      if (!defaultOrg) {
        return NextResponse.json({
          success: false,
          error: 'NO_ORGANIZATION',
          message: 'No active organization found. Please create an organization first.'
        }, { status: 400 });
      }

      organizationId = defaultOrg.id;
      console.log(`Using default organization: ${defaultOrg.name} (${defaultOrg.id})`);
    }

    // Verify the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (!organization) {
      return NextResponse.json({
        success: false,
        error: 'ORGANIZATION_NOT_FOUND',
        message: `Organization with ID ${organizationId} not found`
      }, { status: 404 });
    }

    // Validate artifactType enum
    if (!['RoleAgent', 'MCP'].includes(artifactType)) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_ARTIFACT_TYPE',
        message: 'artifactType must be either "RoleAgent" or "MCP"'
      }, { status: 400 });
    }

    // Validate requiredFacets enum values
    const validFacets = ['security', 'compliance', 'policy', 'risk'];
    const invalidFacets = requiredFacets.filter(facet => !validFacets.includes(facet));
    if (invalidFacets.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_FACETS',
        message: `Invalid facets: ${invalidFacets.join(', ')}. Valid facets are: ${validFacets.join(', ')}`
      }, { status: 400 });
    }

    const policy = await prisma.loaPolicy.create({
      data: {
        organizationId,
        artifactType,
        minReviewers,
        requiredFacets,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            domain: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: policy }, { status: 201 });
  } catch (error: any) {
    console.error('POST /loa/policies error', error);

    // Handle Prisma constraint violations
    if (error.code === 'P2003') {
      return NextResponse.json({
        success: false,
        error: 'FOREIGN_KEY_CONSTRAINT_VIOLATION',
        message: 'Referenced organization does not exist'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to create LoA policy'
    }, { status: 500 });
  }
}


