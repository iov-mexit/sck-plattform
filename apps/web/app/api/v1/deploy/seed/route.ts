import { NextRequest, NextResponse } from 'next/server';
import { deploySeed } from '@/scripts/deploy-seed';

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Post-deployment seeding triggered via API');

    // Validate request (optional: add authentication/authorization)
    const body = await request.json();
    const { force = false, organizationId } = body;

    // Run the comprehensive seeding
    await deploySeed();

    return NextResponse.json({
      success: true,
      message: 'Post-deployment seeding completed successfully',
      timestamp: new Date().toISOString(),
      data: {
        seeded: true,
        force,
        organizationId
      }
    });

  } catch (error) {
    console.error('❌ Post-deployment seeding failed:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Post-deployment seeding failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return seeding status and information
    return NextResponse.json({
      success: true,
      message: 'Post-deployment seeding endpoint is ready',
      endpoint: '/api/v1/deploy/seed',
      method: 'POST',
      description: 'Trigger comprehensive database seeding after deployment',
      usage: {
        method: 'POST',
        body: {
          force: 'boolean (optional) - Force re-seeding even if data exists',
          organizationId: 'string (optional) - Specific organization to seed'
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get seeding endpoint info',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
