import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTrustThresholds() {
  console.log('🌱 Seeding trust thresholds...');

  try {
    // Find the organization
    const organization = await prisma.organization.findUnique({
      where: { domain: 'securecodecorp.com' },
    });

    if (!organization) {
      console.error('❌ Organization not found');
      return;
    }

    // Create trust thresholds for different roles
    const thresholds = await Promise.all([
      prisma.roleTrustThreshold.upsert({
        where: {
          idx_role_threshold_org_role: {
            organizationId: organization.id,
            roleTitle: 'Security Engineer',
          },
        },
        update: {
          minTrustScore: 80,
          isActive: true,
        },
        create: {
          organizationId: organization.id,
          roleTitle: 'Security Engineer',
          minTrustScore: 80,
          isActive: true,
        },
      }),
      prisma.roleTrustThreshold.upsert({
        where: {
          idx_role_threshold_org_role: {
            organizationId: organization.id,
            roleTitle: 'DevOps Engineer',
          },
        },
        update: {
          minTrustScore: 75,
          isActive: true,
        },
        create: {
          organizationId: organization.id,
          roleTitle: 'DevOps Engineer',
          minTrustScore: 75,
          isActive: true,
        },
      }),
      prisma.roleTrustThreshold.upsert({
        where: {
          idx_role_threshold_org_role: {
            organizationId: organization.id,
            roleTitle: 'Developer',
          },
        },
        update: {
          minTrustScore: 70,
          isActive: true,
        },
        create: {
          organizationId: organization.id,
          roleTitle: 'Developer',
          minTrustScore: 70,
          isActive: true,
        },
      }),
      prisma.roleTrustThreshold.upsert({
        where: {
          idx_role_threshold_org_role: {
            organizationId: organization.id,
            roleTitle: 'Analyst',
          },
        },
        update: {
          minTrustScore: 60,
          isActive: true,
        },
        create: {
          organizationId: organization.id,
          roleTitle: 'Analyst',
          minTrustScore: 60,
          isActive: true,
        },
      }),
    ]);

    console.log('✅ Created trust thresholds:', thresholds.length);
    console.log('');
    console.log('Trust Thresholds:');
    thresholds.forEach((threshold: any) => {
      console.log(`  - ${threshold.roleTitle}: ${threshold.minTrustScore}/100`);
    });

  } catch (error) {
    console.error('❌ Error seeding trust thresholds:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTrustThresholds(); 