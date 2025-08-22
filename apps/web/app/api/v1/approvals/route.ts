import { NextRequest, NextResponse } from 'next/server';
import LoAService from '@/lib/services/loa-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const status = searchParams.get('status');

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    let approvals;
    if (status === 'pending') {
      approvals = await LoAService.getPendingApprovals(organizationId);
    } else {
      // For now, just return pending approvals
      // TODO: Add filtering by status
      approvals = await LoAService.getPendingApprovals(organizationId);
    }

    return NextResponse.json({
      success: true,
      data: approvals
    });
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch approvals',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { approvalId, reviewerId, decision, comment } = body;

    // Validation
    if (!approvalId || !reviewerId || !decision) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: approvalId, reviewerId, decision' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(decision)) {
      return NextResponse.json(
        { success: false, error: 'Decision must be either "approve" or "reject"' },
        { status: 400 }
      );
    }

    const result = await LoAService.submitReview(approvalId, reviewerId, decision, comment);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit review',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


