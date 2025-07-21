import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/v1/digital-twins/[id] - Get a specific digital twin
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const digitalTwin = await prisma.digitalTwin.findUnique({
      where: { id: context.params.id },
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
export async function PATCH(request: NextRequest, context: { params: { id: string } }) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      status,
      level,
      blockchainAddress,
      soulboundTokenId,
      blockchainNetwork,
    } = body;

    // Check if digital twin exists
    const existingTwin = await prisma.digitalTwin.findUnique({
      where: { id: context.params.id },
    });

    if (!existingTwin) {
      return NextResponse.json(
        { success: false, error: 'Digital twin not found' },
        { status: 404 }
      );
    }

    // Update the digital twin
    const updatedTwin = await prisma.digitalTwin.update({
      where: { id: context.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(level && { level }),
        ...(blockchainAddress && { blockchainAddress }),
        ...(soulboundTokenId && { soulboundTokenId }),
        ...(blockchainNetwork && { blockchainNetwork }),
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
        action: 'update',
        entity: 'digital_twin',
        entityId: context.params.id,
        metadata: {
          updatedFields: Object.keys(body),
          previousStatus: existingTwin.status,
          newStatus: status,
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
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    // Check if digital twin exists
    const existingTwin = await prisma.digitalTwin.findUnique({
      where: { id: context.params.id },
    });

    if (!existingTwin) {
      return NextResponse.json(
        { success: false, error: 'Digital twin not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting status to 'deleted'
    const deletedTwin = await prisma.digitalTwin.update({
      where: { id: context.params.id },
      data: {
        status: 'deleted',
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'delete',
        entity: 'digital_twin',
        entityId: context.params.id,
        metadata: {
          previousStatus: existingTwin.status,
          assignedToDid: existingTwin.assignedToDid,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: deletedTwin,
      message: 'Digital twin deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting digital twin:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete digital twin' },
      { status: 500 }
    );
  }
} 