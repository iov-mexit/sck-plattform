import { NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { getDomainConfig } from '@/lib/domains';

export async function GET() {
  try {
    const startTime = Date.now();

    // Check database connection
    const dbCheck = await prisma.$queryRaw`SELECT 1 as health_check`;
    const dbHealthy = Array.isArray(dbCheck) && dbCheck.length > 0;

    // Check domain configuration
    const domainConfig = getDomainConfig();

    // Check ANS integration
    const ansHealthy = domainConfig.ansRegistry && domainConfig.autoRegisterANS;

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Get basic stats
    const roleAgentsCount = await prisma.roleAgent.count();
    const organizationCount = await prisma.organization.count();
    const roleTemplatesCount = await prisma.roleTemplate.count();
    const signalsCount = await prisma.signal.count();
    const certificationsCount = await prisma.certification.count();
    const blockchainTransactionsCount = await prisma.blockchainTransaction.count();
    const ansRegisteredCount = await prisma.roleAgent.count({
      where: { ansRegistrationStatus: 'registered' }
    });

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
      responseTime: `${responseTime}ms`,
      checks: {
        database: dbHealthy,
        ansIntegration: ansHealthy,
        domainConfig: !!domainConfig.baseUrl
      },
      stats: {
        roleAgents: roleAgentsCount,
        organization: organizationCount,
        roleTemplates: roleTemplatesCount,
        ansRegistered: ansRegisteredCount
      },
      config: {
        baseUrl: domainConfig.baseUrl,
        ansRegistry: domainConfig.ansRegistry,
        autoRegisterANS: domainConfig.autoRegisterANS,
        isDevelopment: domainConfig.isDevelopment
      }
    };

    const statusCode = dbHealthy && ansHealthy ? 200 : 503;

    return NextResponse.json(healthStatus, { status: statusCode });

  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {
        database: false,
        ansIntegration: false,
        domainConfig: false
      }
    }, { status: 503 });
  }
} 