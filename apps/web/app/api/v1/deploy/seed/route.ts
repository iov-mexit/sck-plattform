import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🌱 Post-deployment comprehensive seeding triggered via API');

    // Validate request (optional: add authentication/authorization)
    const body = await request.json();
    const {
      force = false,
      organizationId,
      extendedOrgs = false,
      demoData = true,
      aiFeatures = false
    } = body;

    // Set environment variables for seeding configuration
    if (extendedOrgs) process.env.SEED_EXTENDED_ORGS = 'true';
    if (demoData) process.env.SEED_DEMO_DATA = 'true';
    if (aiFeatures) process.env.SEED_AI_FEATURES = 'true';

    // Run the comprehensive seeding
    const { fullSeed } = require('../../../../../scripts/full-seed.js');
    await fullSeed();

    return NextResponse.json({
      success: true,
      message: 'Post-deployment comprehensive seeding completed successfully',
      timestamp: new Date().toISOString(),
      data: {
        seeded: true,
        force,
        organizationId,
        extendedOrgs,
        demoData,
        aiFeatures
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
