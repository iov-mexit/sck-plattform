import prisma from './lib/database';

async function checkOrganizations() {
  try {
    console.log('🔍 Checking organization in database...\n');
    
    const organization = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        domain: true,
        isActive: true,
        onboardingComplete: true,
        createdAt: true,
        _count: {
          select: {
            roleAgents: true,
            roleTemplates: true
          }
        }
      }
    });

    if (organization.length === 0) {
      console.log('❌ No organization found in database');
    } else {
      console.log(`✅ Found ${organization.length} organization(s):\n`);
      
      organization.forEach((org: any, index: number) => {
        console.log(`${index + 1}. ${org.name}`);
        console.log(`   📧 Domain: "${org.domain}"`);
        console.log(`   🆔 ID: ${org.id}`);
        console.log(`   ✅ Active: ${org.isActive}`);
        console.log(`   🎯 Onboarded: ${org.onboardingComplete}`);
        console.log(`   👥 Role Agents: ${org._count.roleAgent}`);
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
      const matchingOrg = organization.find((org: any) => org.domain === domain);
      console.log(`   📧 ${email} → domain: "${domain}" → ${matchingOrg ? '✅ MATCH' : '❌ NO MATCH'}`);
    });

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrganizations(); 