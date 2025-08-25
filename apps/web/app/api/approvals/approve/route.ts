import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      decision,
      reviewerId,
      reviewerType = 'USER',
      comment,
      evidence
    } = body;

    if (!id || !decision || !reviewerId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: id, decision, reviewerId' },
        { status: 400 }
      );
    }

    if (!['APPROVED', 'REJECTED'].includes(decision)) {
      return NextResponse.json(
        { success: false, message: 'Invalid decision. Must be APPROVED or REJECTED' },
        { status: 400 }
      );
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update the approval request status
      const updatedRequest = await tx.approvalRequest.update({
        where: { id },
        data: {
          status: decision,
          updatedAt: new Date()
        },
        include: {
          organization: true
        }
      });

      // 2. Create the approval decision record (only if organizationId exists)
      let approvalDecision = null;
      if (updatedRequest.organizationId) {
        approvalDecision = await tx.approval.create({
          data: {
            organizationId: updatedRequest.organizationId,
            artifactId: updatedRequest.artifactId,
            artifactType: updatedRequest.artifactType as any,
            loaLevel: updatedRequest.loaLevel as any,
            reviewerId,
            facet: 'policy', // Default facet for general approvals
            decision: decision as any,
            comment,
            reviewedAt: new Date()
          }
        });
      }

      // 3. Create blockchain audit log
      const auditPayload = {
        approvalRequestId: id,
        artifactType: updatedRequest.artifactType,
        artifactId: updatedRequest.artifactId,
        loaLevel: updatedRequest.loaLevel,
        decision,
        reviewerId,
        reviewerType,
        reviewDate: new Date().toISOString(),
        organizationId: updatedRequest.organizationId,
        organizationName: updatedRequest.organization?.name
      };

      const payloadHash = crypto.createHash('sha256')
        .update(JSON.stringify(auditPayload))
        .digest('hex');

      const blockchainTx = await tx.blockchainTransaction.create({
        data: {
          transactionHash: `approval-${id}-${Date.now()}`,
          network: 'governance',
          transactionType: 'APPROVAL_DECISION',
          status: 'confirmed',
          metadata: auditPayload,
          approvalRequestId: id
        }
      });

      // 4. Update the trust ledger
      await tx.trustLedgerEvent.create({
        data: {
          artifactType: updatedRequest.artifactType as any,
          artifactId: updatedRequest.artifactId,
          action: 'APPROVAL_DECISION',
          payload: {
            approvalRequestId: id,
            decision,
            reviewerId,
            blockchainTxId: blockchainTx.id,
            timestamp: new Date().toISOString()
          },
          contentHash: payloadHash,
          prevHash: null // Will be threaded later
        }
      });

      return {
        approvalRequest: updatedRequest,
        decision: approvalDecision,
        blockchainTx,
        payloadHash,
        approvalCreated: !!approvalDecision
      };
    });

    return NextResponse.json({
      success: true,
      message: `Approval request ${decision.toLowerCase()} successfully`,
      data: result
    });

  } catch (error) {
    console.error('Error processing approval decision:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process approval decision',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
