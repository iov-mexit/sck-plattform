import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import LoAService from '@/lib/services/loa-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    const policies = await LoAService.getLoAPolicies(organizationId);

    return NextResponse.json({
      success: true,
      data: policies
    });
  } catch (error) {
    console.error('Error fetching LoA policies:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch LoA policies',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organizationId,
      artifactType,
      level,
      minReviewers,
      requiredFacets,
      externalRequired = false,
      description,
      isActive = true
    } = body;

    // Validation
    if (!organizationId || !artifactType || !level || !minReviewers || !requiredFacets) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(requiredFacets) || requiredFacets.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Required facets must be a non-empty array' },
        { status: 400 }
      );
    }

    if (minReviewers < 1) {
      return NextResponse.json(
        { success: false, error: 'Minimum reviewers must be at least 1' },
        { status: 400 }
      );
    }

    const policy = await LoAService.upsertLoAPolicy(
      organizationId,
      artifactType,
      level,
      {
        minReviewers,
        requiredFacets,
        externalRequired,
        description,
        isActive
      }
    );

    return NextResponse.json({
      success: true,
      data: policy
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating LoA policy:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create/update LoA policy',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


