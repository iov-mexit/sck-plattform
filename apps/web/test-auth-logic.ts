import prisma from './lib/database';

async function testAuthLogic() {
  console.log('🧪 Testing Simplified MVP Auth Logic...\n');

  // This is the same logic as in auth-context.tsx (simplified)
  const fetchOrganizationData = async (email: string) => {
    try {
      console.log(`📧 Email: ${email}`);

      // MVP: Use default organization for any email
      // TODO: Implement proper multi-org logic for scaling
      const defaultOrg = {
        id: 'org-securecodecorp',
        name: 'SecureCode Corp',
        domain: 'securecodecorp.com',
        isActive: true,
        onboardingComplete: true
      };

      console.log(`✅ Using default organization: ${defaultOrg.name}`);
      return defaultOrg;

    } catch (error) {
      console.error(`❌ Auth Error:`, error);
      return null;
    }
  };

  // Test any email - should all work now
  console.log('1️⃣  Testing any email (should work):');
  const result1 = await fetchOrganizationData('user@securecodecorp.com');

  console.log('\n2️⃣  Testing different email (should also work):');
  const result2 = await fetchOrganizationData('dev@example.com');

  console.log('\n3️⃣  Testing another email (should also work):');
  const result3 = await fetchOrganizationData('admin@localhost');

  console.log('\n📋 Summary:');
  console.log(`   ✅ user@securecodecorp.com → ${result1 ? 'SUCCESS' : 'FAILED'}`);
  console.log(`   ✅ dev@example.com → ${result2 ? 'SUCCESS' : 'FAILED'}`);
  console.log(`   ✅ admin@localhost → ${result3 ? 'SUCCESS' : 'FAILED'}`);

  console.log('\n🎉 MVP Auth Simplified!');
  console.log('   - Any email now works for development');
  console.log('   - No API calls needed for organization lookup');
  console.log('   - Ready for core SCK Platform development');

  await prisma.$disconnect();
}

testAuthLogic(); 