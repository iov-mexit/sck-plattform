import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/database";

export async function GET(req: NextRequest) {
  try {
    // Get enforcement system status
    const activeBundles = await prisma.policyBundle.count({
      where: { status: 'ACTIVE' }
    });

    const totalTokens = await prisma.gatewayToken.count({
      where: { 
        revokedAt: null,
        expiresAt: { gt: new Date() }
      }
    });

    const recentEnforcementCalls = await prisma.enforcementCall.count({
      where: {
        createdAt: { gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
      }
    });

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      enforcement: {
        active_bundles: activeBundles,
        active_tokens: totalTokens,
        calls_last_24h: recentEnforcementCalls
      },
      version: '1.0.0',
      uptime: process.uptime()
    });

  } catch (error) {
    console.error('Error fetching enforcement status:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: 'Failed to fetch enforcement status',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
