import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...');

    // Log environment variables (without sensitive data)
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_PREFIX: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'NOT_SET',
      SUPABASE_URL_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    };

    console.log('Environment info:', envInfo);

    // Try to create a Prisma client directly
    let prisma;
    try {
      const { PrismaClient } = require('@prisma/client');
      prisma = new PrismaClient();

      console.log('✅ Prisma client created successfully');

      // Test connection
      await prisma.$connect();
      console.log('✅ Database connection successful');

      // Test a simple query
      const result = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('✅ Test query successful:', result);

      await prisma.$disconnect();

      return NextResponse.json({
        success: true,
        message: 'Database connection test successful',
        envInfo,
        timestamp: new Date().toISOString()
      });

    } catch (dbError) {
      console.error('❌ Database test failed:', dbError);

      return NextResponse.json({
        success: false,
        message: 'Database connection test failed',
        error: dbError instanceof Error ? dbError.message : 'Unknown error',
        envInfo,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Test endpoint failed:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Test endpoint failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
