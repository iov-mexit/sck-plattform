import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const roleAgent = await prisma.role_agents.findUnique({
      where: { id },
      include: {
        role_templates: true,
        organizations: true
      }
    });

    if (!roleAgent) {
      return NextResponse.json(
        { success: false, error: 'Role agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: roleAgent
    });

  } catch (error) {
    console.error('Error fetching role agent:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch role agent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    // Validate that the role agent exists
    const existingAgent = await prisma.role_agents.findUnique({
      where: { id }
    });

    if (!existingAgent) {
      return NextResponse.json(
        { success: false, error: 'Role agent not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    };

    // Add fields that can be updated
    if (body.soulboundTokenId !== undefined) {
      updateData.soulboundTokenId = body.soulboundTokenId;
    }
    if (body.trustScore !== undefined) {
      updateData.trustScore = body.trustScore;
      updateData.isEligibleForMint = body.trustScore >= 750;
      updateData.lastTrustCheck = new Date();
    }
    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    if (body.name !== undefined) {
      updateData.name = body.name;
    }
    if (body.description !== undefined) {
      updateData.description = body.description;
    }

    // Update the role agent
    const updatedAgent = await prisma.role_agents.update({
      where: { id },
      data: updateData,
      include: {
        role_templates: true,
        organizations: true
      }
    });

    // If NFT information was provided, also create a blockchain transaction record
    if (body.nftTransactionHash && body.soulboundTokenId) {
      try {
        await prisma.blockchain_transactions.create({
          data: {
            id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            roleAgentId: id,
            transactionHash: body.nftTransactionHash,
            transactionType: 'NFT_MINT',
            status: 'confirmed',
            network: 'sepolia',
            tokenId: body.soulboundTokenId,
            contractAddress: body.nftContractAddress || '',
            metadata: {
              achievementType: body.achievementType || 'Security Achievement',
              mintedAt: new Date().toISOString(),
              recipient: body.recipientAddress || ''
            },
            gasUsed: body.gasUsed || '0',
            gasPrice: body.gasPrice || '0',
            blockNumber: body.blockNumber || 0,
            updatedAt: new Date()
          }
        });
      } catch (txError) {
        console.warn('Failed to create blockchain transaction record:', txError);
        // Don't fail the whole request if blockchain transaction record creation fails
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedAgent,
      message: 'Role agent updated successfully'
    });

  } catch (error) {
    console.error('Error updating role agent:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update role agent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Check if role agent exists
    const existingAgent = await prisma.role_agents.findUnique({
      where: { id }
    });

    if (!existingAgent) {
      return NextResponse.json(
        { success: false, error: 'Role agent not found' },
        { status: 404 }
      );
    }

    // Delete related blockchain transactions first
    await prisma.blockchain_transactions.deleteMany({
      where: { roleAgentId: id }
    });

    // Delete the role agent
    await prisma.role_agents.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Role agent deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting role agent:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete role agent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 