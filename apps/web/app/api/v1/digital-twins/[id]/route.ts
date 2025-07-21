import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/v1/digital-twins/[id] - Get a specific digital twin
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const digitalTwin = await prisma.digitalTwin.findUnique({
      where: { id },
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
            responsibilities: true,
            securityContributions: true,
          },
        },
        signals: {
          select: {
            id: true,
            type: true,
            title: true,
            description: true,
            value: true,
            source: true,
            url: true,
            verified: true,
            metadata: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        certifications: {
          select: {
            id: true,
            name: true,
            issuer: true,
            issuedAt: true,
            expiresAt: true,
            credentialUrl: true,
            verified: true,
            createdAt: true,
          },
          orderBy: {
            issuedAt: 'desc',
          },
        },
        blockchainTransactions: {
          select: {
            id: true,
            transactionHash: true,
            network: true,
            blockNumber: true,
            gasUsed: true,
            gasPrice: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!digitalTwin) {
      return NextResponse.json(
        { success: false, error: 'Digital twin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: digitalTwin,
    });
  } catch (error) {
    console.error('Error fetching digital twin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch digital twin' },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/digital-twins/[id] - Update a digital twin
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const body = await req.json();
    const { name, description, trustScore, status, isEligibleForMint } = body;

    // Check if digital twin exists
    const existingTwin = await prisma.digitalTwin.findUnique({
      where: { id },
    });

    if (!existingTwin) {
      return NextResponse.json(
        { success: false, error: 'Digital twin not found' },
        { status: 404 }
      );
    }

    // Update the digital twin
    const updatedTwin = await prisma.digitalTwin.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(trustScore !== undefined && { trustScore }),
        ...(status && { status }),
        ...(isEligibleForMint !== undefined && { isEligibleForMint }),
        lastTrustCheck: trustScore !== undefined ? new Date() : existingTwin.lastTrustCheck,
      },
      include: {
        organization: true,
        roleTemplate: true,
      },
    });

    // Optionally, log the update
    await prisma.auditLog.create({
      data: {
        action: 'update',
        entity: 'digital_twin',
        entityId: id,
        metadata: {
          updatedFields: Object.keys(body),
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedTwin,
    });
  } catch (error) {
    console.error('Error updating digital twin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update digital twin' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/digital-twins/[id] - Delete a digital twin (soft delete)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    // Check if digital twin exists
    const existingTwin = await prisma.digitalTwin.findUnique({
      where: { id },
    });

    if (!existingTwin) {
      return NextResponse.json(
        { success: false, error: 'Digital twin not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting status to 'deleted'
    const deletedTwin = await prisma.digitalTwin.update({
      where: { id },
      data: {
        status: 'deleted',
      },
    });

    // Optionally, log the deletion
    await prisma.auditLog.create({
      data: {
        action: 'delete',
        entity: 'digital_twin',
        entityId: id,
        metadata: {
          previousStatus: existingTwin.status,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: deletedTwin,
    });
  } catch (error) {
    console.error('Error deleting digital twin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete digital twin' },
      { status: 500 }
    );
  }
} 