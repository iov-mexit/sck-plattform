const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');

    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Basic connection test passed:', result);

    // Test reading from organizations table
    const organizations = await prisma.organization.findMany();
    console.log('✅ Organizations query passed:', organizations.length, 'organizations found');

    // Test reading from role_templates table
    const roleTemplates = await prisma.roleTemplate.findMany();
    console.log('✅ Role templates query passed:', roleTemplates.length, 'role templates found');

    console.log('🎉 All database tests passed!');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 