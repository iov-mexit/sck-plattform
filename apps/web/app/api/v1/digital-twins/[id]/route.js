import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/v1/digital-twins/[id]
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const digitalTwin = await prisma.digitalTwin.findUnique({
      where: { id },
    });

    if (!digitalTwin) {
      return NextResponse.json(
        { success: false, error: 'Digital twin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: digitalTwin });
  } catch (error) {
    console.error('GET digital twin failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch digital twin' },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/digital-twins/[id]
export async function PATCH(request, { params }) {
  const id = params.id;

  try {
    const body = await request.json();
    const { name, description, trustScore, status, isEligibleForMint } = body;

    const existingTwin = await prisma.digitalTwin.findUnique({ where: { id } });

    if (!existingTwin) {
      return NextResponse.json(
        { success: false, error: 'Digital twin not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json({ success: true, data: updatedTwin });
  } catch (error) {
    console.error('PATCH digital twin failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update digital twin' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/digital-twins/[id]
export async function DELETE(request, { params }) {
  const id = params.id;

  try {
    const existingTwin = await prisma.digitalTwin.findUnique({ where: { id } });

    if (!existingTwin) {
      return NextResponse.json(
        { success: false, error: 'Digital twin not found' },
        { status: 404 }
      );
    }

    const deletedTwin = await prisma.digitalTwin.update({
      where: { id },
      data: {
        status: 'deleted',
      },
    });

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

    return NextResponse.json({ success: true, data: deletedTwin });
  } catch (error) {
    console.error('DELETE digital twin failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete digital twin' },
      { status: 500 }
    );
  }
}
