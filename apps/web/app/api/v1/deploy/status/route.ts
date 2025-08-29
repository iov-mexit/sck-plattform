import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Deployment status check requested');

    // Check database connectivity and seeding status
    const status = {
      database: {
        connected: false,
        error: null as string | null
      },
      seeding: {
        organizations: 0,
        roleTemplates: 0,
        trustThresholds: 0,
        loaPolicies: 0,
        mcpPolicies: 0,
        roleAgents: 0,
        signals: 0,
        certifications: 0,
        ragKnowledgeBase: 0
      },
      timestamp: new Date().toISOString()
    };

    try {
      // Test database connection
      await prisma.$connect();
      status.database.connected = true;

      // Check seeding status for each data category
      status.seeding.organizations = await prisma.organization.count();
      status.seeding.roleTemplates = await prisma.roleTemplate.count();
      status.seeding.trustThresholds = await prisma.roleTrustThreshold.count();
      status.seeding.loaPolicies = await prisma.loaPolicy.count();
      status.seeding.mcpPolicies = await prisma.mcpPolicy.count();
      status.seeding.roleAgents = await prisma.roleAgent.count();
      status.seeding.signals = await prisma.signal.count();
      status.seeding.certifications = await prisma.certification.count();

      // Check if RAG knowledge base table exists
      try {
        status.seeding.ragKnowledgeBase = await prisma.$queryRaw`SELECT COUNT(*) FROM rag_knowledge_base`;
      } catch (ragError) {
        status.seeding.ragKnowledgeBase = 0;
      }

    } catch (dbError) {
      status.database.error = dbError instanceof Error ? dbError.message : 'Unknown database error';
    } finally {
      await prisma.$disconnect();
    }

    // Determine overall status
    const totalSeeded = Object.values(status.seeding).reduce((sum, count) => sum + count, 0);
    const isFullySeeded = totalSeeded > 0 && status.database.connected;

    return NextResponse.json({
      success: true,
      message: 'Deployment status retrieved successfully',
      status: {
        ...status,
        overall: {
          fullySeeded: isFullySeeded,
          totalSeeded,
          ready: isFullySeeded
        }
      }
    });

  } catch (error) {
    console.error('❌ Deployment status check failed:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get deployment status',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
