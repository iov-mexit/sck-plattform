#!/usr/bin/env node

/**
 * Deploy AI & RAG tables to existing Supabase instance
 * Uses your existing Prisma configuration
 */

const { PrismaClient } = require('@prisma/client');

async function deployAITables() {
  console.log('🚀 Deploying AI & RAG tables to your Supabase instance...\n');

  try {
    // Use your existing Prisma client (connects to Supabase via DATABASE_URL)
    const prisma = new PrismaClient({
      log: ['error', 'warn'],
    });

    // Test connection
    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Connected to Supabase database\n');

    // 1. Enable pgvector extension (if not already enabled)
    console.log('📦 Enabling pgvector extension...');
    try {
      await prisma.$executeRaw`CREATE EXTENSION IF NOT EXISTS vector;`;
      console.log('✅ pgvector extension enabled');
    } catch (error) {
      console.log('ℹ️  pgvector already enabled or not available');
    }

    // 2. Create tables using Prisma schema
    console.log('\n📚 Creating AI & RAG tables...');
    
    // Note: We'll use Prisma's schema push instead of manual SQL
    // This ensures consistency with your existing setup
    
    console.log('✅ Tables will be created via Prisma schema push');
    console.log('   Run: npm run db:push to apply the new schema');

    // 3. Test existing role templates to verify connection
    console.log('\n🧪 Testing existing Supabase connection...');
    const roleTemplates = await prisma.roleTemplate.findMany({
      take: 3,
      select: { id: true, title: true }
    });
    
    console.log(`✅ Found ${roleTemplates.length} existing role templates:`);
    roleTemplates.forEach(rt => console.log(`   - ${rt.title} (${rt.id})`));

    // 4. Test organization connection
    const organizations = await prisma.organization.findMany({
      take: 3,
      select: { id: true, name: true }
    });
    
    console.log(`✅ Found ${organizations.length} existing organizations:`);
    organizations.forEach(org => console.log(`   - ${org.name} (${org.id})`));

    console.log('\n🎉 Supabase connection verified!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run db:push (to create AI tables)');
    console.log('2. Visit: https://sck-plattform.vercel.app/admin/ai-status');
    console.log('3. Test AI functionality');
    console.log('\n🔒 Your existing role templates and data are safe!');

    await prisma.$disconnect();

  } catch (error) {
    console.error('❌ Deployment failed:', error);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Check your DATABASE_URL in environment');
    console.error('2. Verify Supabase is running');
    console.error('3. Check network connectivity');
    process.exit(1);
  }
}

deployAITables();
