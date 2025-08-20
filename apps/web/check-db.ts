import prisma from './lib/database';

async function checkOrganizations() {
  try {
    console.log('🔍 Checking organizations in database...\n');
    
    const organizations = await prisma.organizations.findMany({
      select: {
        id: true,
        name: true,
        domain: true,
        isActive: true,
        onboardingComplete: true,
        createdAt: true,
        _count: {
          select: {
            role_agents: true
          }
        }
      }
    });

    if (organizations.length === 0) {
      console.log('❌ No organizations found in database');
    } else {
      console.log(`✅ Found ${organizations.length} organization(s):\n`);
      
      organizations.forEach((org: any, index: number) => {
        console.log(`${index + 1}. ${org.name}`);
        console.log(`   📧 Domain: "${org.domain}"`);
        console.log(`   🆔 ID: ${org.id}`);
        console.log(`   ✅ Active: ${org.isActive}`);
        console.log(`   🎯 Onboarded: ${org.onboardingComplete}`);
        console.log(`   👥 Role Agents: ${org._count.role_agents}`);
        console.log(`   📅 Created: ${org.createdAt.toISOString()}`);
        console.log('');
      });
    }

    // Test the email extraction logic
    console.log('🧪 Testing email domain extraction:');
    const testEmails = [
      'user@securecorp.com',
      'admin@securecorp',
      'test@localhost',
      'dev@example.com'
    ];

    testEmails.forEach((email: string) => {
      const domain = email.split('@')[1] || '';
      const matchingOrg = organizations.find((org: any) => org.domain === domain);
      console.log(`   📧 ${email} → domain: "${domain}" → ${matchingOrg ? '✅ MATCH' : '❌ NO MATCH'}`);
    });

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrganizations(); 