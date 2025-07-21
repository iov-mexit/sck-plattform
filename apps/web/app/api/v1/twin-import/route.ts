import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/v1/twin-import - Import digital twins with trust score validation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organizationId,
      roleTemplateId,
      did,
      assignedTo,
      trustScore,
      roleTitle,
    } = body;

    // Validate required fields
    if (!organizationId || !roleTemplateId || !did || !roleTitle) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: organizationId, roleTemplateId, did, roleTitle' },
        { status: 400 }
      );
    }

    // Get the role trust threshold
    const threshold = await prisma.roleTrustThreshold.findUnique({
      where: {
        idx_role_threshold_org_role: {
          organizationId,
          roleTitle,
        },
      },
    });

    const minTrustScore = threshold?.minTrustScore || 0;
    const isEligibleForMint = (trustScore || 0) >= minTrustScore;

    // Check if DID is already assigned
    const existingTwin = await prisma.digitalTwin.findFirst({
      where: {
        assignedToDid: did,
        organizationId,
      },
    });

    if (existingTwin) {
      return NextResponse.json(
        { success: false, error: 'DID is already assigned to another digital twin in this organization' },
        { status: 409 }
      );
    }

    // Get role template for name generation
    const roleTemplate = await prisma.roleTemplate.findUnique({
      where: { id: roleTemplateId },
    });

    if (!roleTemplate) {
      return NextResponse.json(
        { success: false, error: 'Role template not found' },
        { status: 404 }
      );
    }

    // Create the digital twin
    const digitalTwin = await prisma.digitalTwin.create({
      data: {
        name: `${roleTemplate.title} Digital Twin`,
        description: `Digital twin for ${roleTemplate.title} role`,
        assignedToDid: did,
        assignedTo,
        trustScore,
        isEligibleForMint,
        lastTrustCheck: new Date(),
        status: isEligibleForMint ? 'active' : 'idle',
        level: 1,
        organizationId,
        roleTemplateId,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        roleTemplate: {
          select: {
            id: true,
            title: true,
            category: true,
            focus: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'import',
        entity: 'digital_twin',
        entityId: digitalTwin.id,
        metadata: {
          organizationId,
          roleTemplateId,
          did,
          assignedTo,
          trustScore,
          roleTitle,
          minTrustScore,
          isEligibleForMint,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: digitalTwin,
      trustCheck: {
        trustScore,
        minTrustScore,
        isEligibleForMint,
        roleTitle,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error importing digital twin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import digital twin' },
      { status: 500 }
    );
  }
} 