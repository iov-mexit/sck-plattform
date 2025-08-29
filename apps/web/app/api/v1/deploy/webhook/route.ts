import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Post-deployment webhook triggered');

    // Verify this is a legitimate webhook (optional: add signature verification)
    const body = await request.json();
    const { deployment, project, event } = body;

    // Only run seeding for successful deployments
    if (event === 'deployment.success') {
      console.log(`✅ Deployment successful for project: ${project?.name}`);
      console.log(`🌱 Triggering comprehensive post-deployment seeding...`);

      // Set default seeding configuration for webhook-triggered seeding
      process.env.SEED_DEMO_DATA = 'true';
      process.env.SEED_EXTENDED_ORGS = 'false';
      process.env.SEED_AI_FEATURES = 'false';

      // Run comprehensive seeding
      const { fullSeed } = require('../../../../../scripts/full-seed.js');
      await fullSeed();

      console.log('✅ Post-deployment comprehensive seeding completed successfully');

      return NextResponse.json({
        success: true,
        message: 'Post-deployment comprehensive seeding completed',
        deployment: deployment?.id,
        project: project?.name,
        event,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(`ℹ️ Skipping seeding for event: ${event}`);

      return NextResponse.json({
        success: true,
        message: 'Event not requiring seeding',
        event,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Post-deployment webhook failed:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Post-deployment webhook failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'Post-deployment webhook endpoint is ready',
      endpoint: '/api/v1/deploy/webhook',
      method: 'POST',
      description: 'Webhook endpoint for Vercel post-deployment events',
      events: ['deployment.success'],
      usage: 'Configure in Vercel dashboard as a webhook endpoint',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get webhook endpoint info',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
