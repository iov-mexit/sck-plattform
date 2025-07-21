import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/v1/digital-twins - List all digital twins
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const status = searchParams.get('status');
    const roleTemplateId = searchParams.get('roleTemplateId');

    // Use Record<string, unknown> for where clause
    const where: Record<string, unknown> = {};

    if (organizationId) {
      where.organizationId = organizationId;
    }

    if (status) {
      where.status = status;
    }

    if (roleTemplateId) {
      where.roleTemplateId = roleTemplateId;
    }

    const digitalTwins = await prisma.digitalTwin.findMany({
      where,
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
        signals: {
          select: {
            id: true,
            type: true,
            title: true,
            value: true,
            verified: true,
            createdAt: true,
          },
        },
        certifications: {
          select: {
            id: true,
            name: true,
            issuer: true,
            issuedAt: true,
            expiresAt: true,
            verified: true,
          },
        },
        blockchainTransactions: {
          where: {
            status: 'confirmed',
          },
          select: {
            transactionHash: true,
            network: true,
            blockNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: digitalTwins,
      count: digitalTwins.length,
    });
  } catch (error) {
    console.error('Error fetching digital twins:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch digital twins' },
      { status: 500 }
    );
  }
}

// POST /api/v1/digital-twins - Create a new digital twin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      organizationId,
      roleTemplateId,
      assignedToDid,
      blockchainAddress,
      soulboundTokenId,
      blockchainNetwork = 'ethereum',
    } = body;

    // Validate required fields
    if (!name || !organizationId || !roleTemplateId || !assignedToDid) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if DID is already assigned
    const existingTwin = await prisma.digitalTwin.findFirst({
      where: {
        assignedToDid,
        organizationId,
      },
    });

    if (existingTwin) {
      return NextResponse.json(
        { success: false, error: 'DID is already assigned to another digital twin in this organization' },
        { status: 409 }
      );
    }

    // Create the digital twin
    const digitalTwin = await prisma.digitalTwin.create({
      data: {
        name,
        description,
        organizationId,
        roleTemplateId,
        assignedToDid,
        blockchainAddress,
        soulboundTokenId,
        blockchainNetwork,
        status: 'active',
        level: 1,
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
        action: 'create',
        entity: 'digital_twin',
        entityId: digitalTwin.id,
        metadata: {
          organizationId,
          roleTemplateId,
          assignedToDid,
          blockchainAddress,
          soulboundTokenId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: digitalTwin,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating digital twin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create digital twin' },
      { status: 500 }
    );
  }
} 