import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, chainId, signature, message } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    console.log('🔗 Wallet connection request:', { address, chainId });

    // Check if user exists with this wallet address
    let user = await prisma.user.findFirst({
      where: { walletAddress: address },
      include: { organization: true }
    });

    // If user doesn't exist, create a new user
    if (!user) {
      console.log('👤 Creating new user for wallet address:', address);
      
      user = await prisma.user.create({
        data: {
          walletAddress: address,
          email: `${address.slice(0, 6)}...${address.slice(-4)}@wallet.local`,
          name: `Wallet User ${address.slice(0, 6)}...${address.slice(-4)}`,
          // Create a default organization for wallet users
          organization: {
            create: {
              name: `Wallet Organization ${address.slice(0, 6)}...${address.slice(-4)}`,
              domain: `wallet-${address.slice(2, 8)}.local`,
              type: 'WALLET_ONLY'
            }
          }
        },
        include: { organization: true }
      });

      console.log('✅ Created new user and organization:', user.id);
    }

    // Update user's last login
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLoginAt: new Date(),
        walletChainId: chainId || null
      }
    });

    // Create a session token (simplified for now)
    const sessionToken = `wallet_${user.id}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: 'Wallet connected successfully',
      data: {
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          email: user.email,
          name: user.name,
          organization: user.organization
        },
        sessionToken,
        chainId: chainId || null
      }
    });

  } catch (error) {
    console.error('❌ Wallet connection error:', error);
    
    return NextResponse.json(
      {
        error: 'Wallet connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Wallet connection endpoint',
    status: 'active',
    supportedNetworks: ['ethereum', 'polygon', 'flare']
  });
}
