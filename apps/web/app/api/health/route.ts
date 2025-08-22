import { NextResponse } from 'next/server';
import { testDatabaseConnection } from '@/lib/database';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Test database connection
    const dbConnection = await testDatabaseConnection();
    
    // Check environment variables
    const envCheck = {
      databaseUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
      vercelUrl: process.env.VERCEL_URL,
    };

    const responseTime = Date.now() - startTime;
    
    const healthStatus = {
      status: dbConnection.success ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: {
        status: dbConnection.success ? 'connected' : 'disconnected',
        error: dbConnection.error || null,
      },
      environment: envCheck,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    const statusCode = dbConnection.success ? 200 : 503;
    
    return NextResponse.json(healthStatus, { status: statusCode });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    const errorStatus = {
      status: 'error',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.stack : undefined : undefined,
    };

    return NextResponse.json(errorStatus, { status: 500 });
  }
}
