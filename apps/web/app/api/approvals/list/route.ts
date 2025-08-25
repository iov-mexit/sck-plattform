import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const status = searchParams.get('status');
    const artifactType = searchParams.get('artifactType');
    const loaLevel = searchParams.get('loaLevel');

    const whereClause: any = {};

    // Filter by organization if provided
    if (organizationId) {
      whereClause.organizationId = organizationId;
    }

    // Filter by status if provided
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    // Filter by artifact type if provided
    if (artifactType) {
      whereClause.artifactType = artifactType;
    }

    // Filter by LoA level if provided
    if (loaLevel) {
      whereClause.loaLevel = parseInt(loaLevel);
    }

    const approvals = await prisma.approvalRequest.findMany({
      where: whereClause,
      include: {
        organization: {
          select: { name: true, domain: true }
        },
        votes: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: { votes: true, blockchainTransactions: true }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: approvals,
      count: approvals.length
    });

  } catch (error) {
    console.error('Error fetching approval requests:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch approval requests',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
