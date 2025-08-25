import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      approvalRequestId,
      facet,
      vote,
      reviewerId,
      comment,
      signature,
      publicKeyRef
    } = body;

    // Validate required fields
    if (!approvalRequestId || !facet || !vote || !reviewerId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate vote value
    if (!['approve', 'reject', 'abstain'].includes(vote)) {
      return NextResponse.json(
        { success: false, message: 'Invalid vote value' },
        { status: 400 }
      );
    }

    // Validate facet
    const validFacets = ['security', 'compliance', 'policy', 'risk', 'legal', 'privacy', 'architecture'];
    if (!validFacets.includes(facet)) {
      return NextResponse.json(
        { success: false, message: 'Invalid facet' },
        { status: 400 }
      );
    }

    // Start transaction for vote + status update
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Create or update the vote
      const approvalVote = await tx.approvalVote.upsert({
        where: {
          approvalRequestId_facet_reviewerId: {
            approvalRequestId,
            facet,
            reviewerId
          }
        },
        update: {
          vote,
          comment,
          signature: signature ? Buffer.from(signature) : null,
          publicKeyRef,
          createdAt: new Date()
        },
        create: {
          approvalRequestId,
          facet,
          reviewerId,
          vote,
          comment,
          signature: signature ? Buffer.from(signature) : null,
          publicKeyRef
        }
      });

      // 2. Get the approval request with current votes
      const approvalRequest = await tx.approvalRequest.findUnique({
        where: { id: approvalRequestId },
        include: {
          votes: true,
          organization: true
        }
      });

      if (!approvalRequest) {
        throw new Error('Approval request not found');
      }

      // 3. Calculate quorum status for each required facet
      const facetStatus = new Map<string, { approve: number; reject: number; total: number }>();
      
      // Initialize facet counters
      approvalRequest.requiredFacets.forEach((f: string) => {
        facetStatus.set(f, { approve: 0, reject: 0, total: 0 });
      });

      // Count votes per facet
      approvalRequest.votes.forEach((v: any) => {
        const status = facetStatus.get(v.facet);
        if (status) {
          status.total++;
          if (v.vote === 'approve') status.approve++;
          if (v.vote === 'reject') status.reject++;
        }
      });

      // 4. Determine overall status
      let newStatus = approvalRequest.status;
      let approvalsSatisfied = false;
      let rejectionCount = 0;

      // Check if all required facets meet quorum (default: 1 approval)
      const allFacetsSatisfied = approvalRequest.requiredFacets.every((facet: string) => {
        const status = facetStatus.get(facet);
        if (!status) return false;
        
        // Default quorum is 1, but could be enhanced with policy-driven quorums
        const quorum = 1;
        const satisfied = status.approve >= quorum;
        
        if (status.reject > 0) rejectionCount++;
        
        return satisfied;
      });

      if (allFacetsSatisfied) {
        newStatus = 'APPROVED';
        approvalsSatisfied = true;
      } else if (rejectionCount > 0) {
        newStatus = 'REJECTED';
      } else if (approvalRequest.status === 'PENDING') {
        newStatus = 'UNDER_REVIEW';
      }

      // 5. Update approval request status
      const updatedRequest = await tx.approvalRequest.update({
        where: { id: approvalRequestId },
        data: {
          status: newStatus,
          approvalsSatisfied,
          rejectionCount,
          updatedAt: new Date()
        }
      });

      // 6. Create trust ledger event
      const votePayload = {
        approvalRequestId,
        artifactType: approvalRequest.artifactType,
        artifactId: approvalRequest.artifactId,
        facet,
        vote,
        reviewerId,
        timestamp: new Date().toISOString()
      };

      const contentHash = crypto.createHash('sha256')
        .update(JSON.stringify(votePayload))
        .digest('hex');

      // Get previous hash for threading
      const lastEvent = await tx.trustLedgerEvent.findFirst({
        where: { artifactId: approvalRequest.artifactId },
        orderBy: { createdAt: 'desc' }
      });

      const trustEvent = await tx.trustLedgerEvent.create({
        data: {
          artifactType: approvalRequest.artifactType,
          artifactId: approvalRequest.artifactId,
          action: 'APPROVAL_VOTE',
          payload: votePayload,
          contentHash,
          prevHash: lastEvent?.contentHash || null
        }
      });

      return {
        approvalVote,
        updatedRequest,
        trustEvent,
        facetStatus: Object.fromEntries(facetStatus),
        overallStatus: newStatus
      };
    });

    return NextResponse.json({
      success: true,
      message: `Vote recorded successfully`,
      data: result
    });

  } catch (error) {
    console.error('Error processing approval vote:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process approval vote',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
