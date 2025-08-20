// Quick script to create default organization for localhost
const { prisma } = require('./lib/database');

async function createDefaultOrg() {
  try {
    const existing = await prisma.organizations.findUnique({
      where: { domain: 'localhost' }
    });

    if (!existing) {
      const org = await prisma.organizations.create({
        data: {
          id: 'org-localhost-dev',
          name: 'Local Development Org',
          description: 'Default organization for local development',
          domain: 'localhost',
          isActive: true,
          onboardingComplete: true
        }
      });
      console.log('✅ Created default organization:', org);
    } else {
      console.log('✅ Default organization already exists');
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
  }
}

createDefaultOrg(); 