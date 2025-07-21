import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/v1/blockchain-transactions - List blockchain transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const digitalTwinId = searchParams.get('digitalTwinId');
    const network = searchParams.get('network');
    const status = searchParams.get('status');

    const where: any = {};

    if (digitalTwinId) {
      where.digitalTwinId = digitalTwinId;
    }

    if (network) {
      where.network = network;
    }

    if (status) {
      where.status = status;
    }

    const transactions = await prisma.blockchainTransaction.findMany({
      where,
      include: {
        digitalTwin: {
          select: {
            id: true,
            name: true,
            assignedToDid: true,
            soulboundTokenId: true,
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: transactions,
      count: transactions.length,
    });
  } catch (error) {
    console.error('Error fetching blockchain transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blockchain transactions' },
      { status: 500 }
    );
  }
}

// POST /api/v1/blockchain-transactions - Create a new blockchain transaction record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transactionHash,
      network,
      blockNumber,
      gasUsed,
      gasPrice,
      status = 'pending',
      digitalTwinId,
    } = body;

    // Validate required fields
    if (!transactionHash || !network) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: transactionHash, network' },
        { status: 400 }
      );
    }

    // Check if transaction already exists
    const existingTransaction = await prisma.blockchainTransaction.findUnique({
      where: { transactionHash },
    });

    if (existingTransaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction already exists' },
        { status: 409 }
      );
    }

    // Create the blockchain transaction record
    const transaction = await prisma.blockchainTransaction.create({
      data: {
        transactionHash,
        network,
        blockNumber,
        gasUsed,
        gasPrice,
        status,
        digitalTwinId,
      },
      include: {
        digitalTwin: {
          select: {
            id: true,
            name: true,
            assignedToDid: true,
            soulboundTokenId: true,
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'create',
        entity: 'blockchain_transaction',
        entityId: transaction.id,
        metadata: {
          transactionHash,
          network,
          digitalTwinId,
          status,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: transaction,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blockchain transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blockchain transaction' },
      { status: 500 }
    );
  }
} 