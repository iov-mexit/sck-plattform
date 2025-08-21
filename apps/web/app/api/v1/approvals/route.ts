import prisma from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const status = searchParams.get('status');

    const where: any = {};
    if (organizationId) {
      where.organizationId = organizationId;
    }

    const approvals = await prisma.approvals.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        organizations: {
          select: {
            name: true,
            domain: true
          }
        }
      }
    });

    // If status filter is requested, filter the results
    let filteredApprovals = approvals;
    if (status === 'pending') {
      // For pending status, we need to check if the approval meets the LoA requirements
      // This is a simplified check - in production you'd want more sophisticated logic
      filteredApprovals = approvals.filter((approval: any) => {
        // For now, consider all approvals as pending if they don't have a clear status
        // In a real implementation, you'd check against LoA policies
        return true; // Simplified for MVP
      });
    }

    return NextResponse.json({ success: true, data: filteredApprovals });
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch approvals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, artifactId, artifactType, reviewerId, facet, decision, comment } = body;

    if (!organizationId || !artifactId || !artifactType || !reviewerId || !facet || !decision) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newApproval = await prisma.approvals.create({
      data: {
        organizationId,
        artifactId,
        artifactType,
        reviewerId,
        facet,
        decision,
        comment,
      },
      include: {
        organizations: {
          select: {
            name: true,
            domain: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: newApproval }, { status: 201 });
  } catch (error) {
    console.error('Error submitting approval:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit approval' }, { status: 500 });
  }
}


