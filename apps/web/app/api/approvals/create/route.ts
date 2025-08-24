import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      artifactId,
      artifactType,
      loaLevel,
      organizationId,
      requestorId,
      requestorType = 'SYSTEM',
      requestReason,
      priority = 'MEDIUM',
      dueDate,
      reviewers,
      metadata
    } = body;

    // Validate required fields
    if (!artifactId || !artifactType || !loaLevel) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: artifactId, artifactType, loaLevel'
        },
        { status: 400 }
      );
    }

    // Validate LoA level
    if (loaLevel < 1 || loaLevel > 5) {
      return NextResponse.json(
        {
          success: false,
          message: 'LoA level must be between 1 and 5'
        },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Parse due date if provided
    let parsedDueDate: Date | undefined;
    if (dueDate) {
      parsedDueDate = new Date(dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        return NextResponse.json(
          { success: false, message: 'Invalid due date format' },
          { status: 400 }
        );
      }
    }

    // Create the approval request
    const approvalRequest = await prisma.approvalRequest.create({
      data: {
        artifactId,
        artifactType,
        loaLevel,
        organizationId,
        requestorId,
        requestorType,
        requestReason,
        priority,
        dueDate: parsedDueDate,
        reviewers: reviewers || [],
        metadata: metadata || {},
        status: 'PENDING'
      },
      include: {
        organization: {
          select: { name: true, domain: true }
        }
      }
    });

    // Create initial trust ledger entry
    await prisma.trust_ledger.create({
      data: {
        eventType: 'APPROVAL_REQUEST_CREATED',
        payloadHash: `approval-${approvalRequest.id}-${Date.now()}`,
        payload: {
          approvalRequestId: approvalRequest.id,
          artifactType,
          artifactId,
          loaLevel,
          requestorId,
          priority,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Approval request created successfully',
      data: approvalRequest
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating approval request:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create approval request',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
