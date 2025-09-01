import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, sessionToken } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    console.log('🔌 Wallet disconnection request:', { address });

    // Find user by wallet address
    const user = await prisma.user.findFirst({
      where: { walletAddress: address }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user's last logout
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogoutAt: new Date(),
        walletChainId: null
      }
    });

    // Invalidate session token (in a real implementation, you'd store this in Redis/database)
    console.log('✅ Session invalidated for user:', user.id);

    return NextResponse.json({
      success: true,
      message: 'Wallet disconnected successfully',
      data: {
        userId: user.id,
        walletAddress: address,
        disconnectedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Wallet disconnection error:', error);

    return NextResponse.json(
      {
        error: 'Wallet disconnection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Wallet disconnection endpoint',
    status: 'active'
  });
}
