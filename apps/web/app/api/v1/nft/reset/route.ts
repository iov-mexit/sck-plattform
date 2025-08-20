import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting NFT data reset...');

    // Reset all role agents to unminted state
    const updateResult = await prisma.role_agents.updateMany({
      where: {
        OR: [
          { soulboundTokenId: { not: null } },
          { blockchainAddress: { not: null } },
          { blockchainNetwork: { not: null } }
        ]
      },
      data: {
        soulboundTokenId: null,
        blockchainAddress: null,
        blockchainNetwork: null,
      },
    });

    // Optional: Clear blockchain transaction records (commented out to preserve history)
    // const deleteTransactions = await prisma.blockchain_transactions.deleteMany({
    //   where: {
    //     digitalTwinId: { not: null }
    //   }
    // });

    console.log(`✅ Reset complete: ${updateResult.count} role agents cleared`);

    return NextResponse.json({
      success: true,
      message: `Successfully reset ${updateResult.count} role agents to unminted state`,
      data: {
        roleAgentsReset: updateResult.count,
        // transactionsDeleted: deleteTransactions.count
      }
    });

  } catch (error: any) {
    console.error('❌ Reset failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to reset NFT data',
      details: error.message
    }, { status: 500 });
  }
} 