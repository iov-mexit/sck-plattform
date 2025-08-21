import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedComprehensiveTrustThresholds() {
  console.log('🌱 Seeding comprehensive trust thresholds...');

  try {
    // Find the organization
    const organization = await prisma.organization.findUnique({
      where: { domain: 'securecodecorp.com' },
    });

    if (!organization) {
      console.error('❌ Organization not found');
      return;
    }

    // Define trust thresholds for all roles
    const trustThresholds = [
      // =============================================================================
      // DESIGN ROLES - Lower thresholds as they focus on UX/UI
      // =============================================================================
      { roleTitle: 'Product Designer', minTrustScore: 65 },
      { roleTitle: 'User Experience Designer', minTrustScore: 60 },
      { roleTitle: 'User Interface Designer', minTrustScore: 55 },

      // =============================================================================
      // DEVELOPMENT ROLES - Higher thresholds for technical security
      // =============================================================================
      { roleTitle: 'Backend Developer', minTrustScore: 85 },
      { roleTitle: 'Mobile Developer', minTrustScore: 80 },
      { roleTitle: 'Web Developer (Frontend)', minTrustScore: 75 },
      { roleTitle: 'Full Stack Developer', minTrustScore: 85 },
      { roleTitle: 'Blockchain Developer', minTrustScore: 90 },

      // =============================================================================
      // QA AUTOMATION ROLES - Medium-high thresholds for security testing
      // =============================================================================
      { roleTitle: 'Test Automation Engineer', minTrustScore: 70 },
      { roleTitle: 'Performance Test Engineer', minTrustScore: 65 },
      { roleTitle: 'Security Test Engineer', minTrustScore: 85 },

      // =============================================================================
      // QA MANUAL TESTING ROLES - Medium thresholds for security awareness
      // =============================================================================
      { roleTitle: 'QA Analyst', minTrustScore: 70 },
      { roleTitle: 'QA Tester', minTrustScore: 60 },
      { roleTitle: 'UAT Tester', minTrustScore: 55 },
      { roleTitle: 'Release QA Engineer', minTrustScore: 75 },
    ];

    // Create trust thresholds
    const createdThresholds = await Promise.all(
      trustThresholds.map(async (threshold) => {
        return await prisma.roleTrustThreshold.upsert({
          where: {
            organizationId_roleTitle: {
              organizationId: organization.id,
              roleTitle: threshold.roleTitle,
            },
          },
          update: {
            minTrustScore: threshold.minTrustScore,
            isActive: true,
            updatedAt: new Date(),
          },
          create: {
            organizationId: organization.id,
            roleTitle: threshold.roleTitle,
            minTrustScore: threshold.minTrustScore,
            isActive: true,
          },
        });
      })
    );

    console.log('✅ Created comprehensive trust thresholds:', createdThresholds.length);
    console.log('');
    console.log('Trust Thresholds by Category:');

    // Group by category
    const categories = {
      'Design': createdThresholds.filter(t => ['Product Designer', 'User Experience Designer', 'User Interface Designer'].includes(t.roleTitle)),
      'Development': createdThresholds.filter(t => ['Backend Developer', 'Mobile Developer', 'Web Developer (Frontend)', 'Full Stack Developer', 'Blockchain Developer'].includes(t.roleTitle)),
      'QA Automation': createdThresholds.filter(t => ['Test Automation Engineer', 'Performance Test Engineer', 'Security Test Engineer'].includes(t.roleTitle)),
      'QA Manual': createdThresholds.filter(t => ['QA Analyst', 'QA Tester', 'UAT Tester', 'Release QA Engineer'].includes(t.roleTitle)),
    };

    Object.entries(categories).forEach(([category, thresholds]: [string, any[]]) => {
      console.log(`  📊 ${category}:`);
      thresholds.forEach((threshold: any) => {
        console.log(`    - ${threshold.roleTitle}: ${threshold.minTrustScore}/100`);
      });
    });

    console.log('');
    console.log('Security Focus Levels:');
    console.log('  🔒 High Security (85-90): Backend, Full Stack, Blockchain, Security Test Engineer');
    console.log('  🛡️ Medium-High (75-80): Mobile, Web Frontend, QA Analyst, Release QA');
    console.log('  🔧 Medium (65-70): Test Automation, Performance Test, Product Designer');
    console.log('  📊 Lower (55-60): UI/UX Design, QA Tester, UAT Tester');

  } catch (error) {
    console.error('❌ Error seeding comprehensive trust thresholds:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedComprehensiveTrustThresholds(); 