import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/v1/role-trust-thresholds - List role trust thresholds
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

    const thresholds = await prisma.roleTrustThreshold.findMany({
      where: {
        organizationId,
        isActive: true,
      },
      orderBy: {
        roleTitle: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: thresholds,
      count: thresholds.length,
    });
  } catch (error) {
    console.error('Error fetching role trust thresholds:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch role trust thresholds' },
      { status: 500 }
    );
  }
}

// POST /api/v1/role-trust-thresholds - Create or update role trust threshold
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organizationId,
      roleTitle,
      minTrustScore,
    } = body;

    // Validate required fields
    if (!organizationId || !roleTitle || minTrustScore === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: organizationId, roleTitle, minTrustScore' },
        { status: 400 }
      );
    }

    // Validate trust score range
    if (minTrustScore < 0 || minTrustScore > 100) {
      return NextResponse.json(
        { success: false, error: 'Trust score must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Upsert the threshold (create or update)
    const threshold = await prisma.roleTrustThreshold.upsert({
      where: {
        idx_role_threshold_org_role: {
          organizationId,
          roleTitle,
        },
      },
      update: {
        minTrustScore,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        organizationId,
        roleTitle,
        minTrustScore,
        isActive: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'create',
        entity: 'role_trust_threshold',
        entityId: threshold.id,
        metadata: {
          organizationId,
          roleTitle,
          minTrustScore,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: threshold,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating role trust threshold:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create role trust threshold' },
      { status: 500 }
    );
  }
} 