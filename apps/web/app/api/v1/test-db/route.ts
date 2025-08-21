import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');

    // Test basic connection
    const organization = await prisma.organization.findMany({
      take: 1,
    });

    console.log('Found organization:', organization.length);

    // Test role agents table
    const roleAgent = await prisma.roleAgent.findMany({
      take: 1,
    });

    console.log('Found role agents:', roleAgent.length);

    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      organizationCount: organization.length,
      roleAgentsCount: roleAgent.length,
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