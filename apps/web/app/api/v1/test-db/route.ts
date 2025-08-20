import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');

    // Test basic connection
    const organizations = await prisma.organizations.findMany({
      take: 1,
    });

    console.log('Found organizations:', organizations.length);

    // Test role agents table
    const role_agents = await prisma.role_agents.findMany({
      take: 1,
    });

    console.log('Found role agents:', role_agents.length);

    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      organizationsCount: organizations.length,
      roleAgentsCount: role_agents.length,
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
} 