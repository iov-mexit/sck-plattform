const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    console.log('🔍 Testing Prisma connection...');

    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Basic connection test passed:', result);

    // Test reading from organizations table
    const organizations = await prisma.organization.findMany();
    console.log('✅ Organizations query passed:', organizations.length, 'organizations found');

    // Test reading from role_templates table
    const roleTemplates = await prisma.roleTemplate.findMany();
    console.log('✅ Role templates query passed:', roleTemplates.length, 'role templates found');

    // Test reading from digital_twins table
    const digitalTwins = await prisma.digitalTwin.findMany();
    console.log('✅ Digital twins query passed:', digitalTwins.length, 'digital twins found');

    // Test reading from signals table
    const signals = await prisma.signal.findMany();
    console.log('✅ Signals query passed:', signals.length, 'signals found');

    console.log('🎉 All Prisma tests passed!');

  } catch (error) {
    console.error('❌ Prisma test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma(); 