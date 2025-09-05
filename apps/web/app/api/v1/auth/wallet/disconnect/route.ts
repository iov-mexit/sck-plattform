import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  // TODO: Implement wallet disconnection when schema supports wallet fields
  return NextResponse.json(
    {
      error: 'Wallet disconnection not yet implemented',
      message: 'Wallet fields not available in current schema'
    },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json({
    message: 'Wallet disconnection endpoint',
    status: 'active'
  });
}
