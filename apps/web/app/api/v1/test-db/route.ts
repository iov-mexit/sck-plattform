import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');

    // Test basic connection
    const organizations = await prisma.organizations.findMany({
      take: 1,
    });

    console.log('Found organizations:', organizations.length);

    // Test digital twins table
    const digitalTwins = await prisma.digital_twins.findMany({
      take: 1,
    });

    console.log('Found digital twins:', digitalTwins.length);

    return NextResponse.json({
      success: true,
      message: 'Database connection working',
      organizationsCount: organizations.length,
      digitalTwinsCount: digitalTwins.length,
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