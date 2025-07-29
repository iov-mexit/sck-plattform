// Test script for onboarding flow
const { mockOrganizationService } = require('./lib/services/mock-organization.ts');

async function testOnboardingFlow() {
  console.log('🧪 Testing Onboarding Flow...\n');

  // Test 1: New organization (needs onboarding)
  console.log('1. Testing new organization (securecorp.com):');
  const newOrg = await mockOrganizationService.getByDomain('securecorp.com');
  console.log(`   - Organization: ${newOrg?.name}`);
  console.log(`   - Onboarding Complete: ${newOrg?.onboardingComplete}`);
  console.log(`   - Should redirect to: ${newOrg?.onboardingComplete ? 'dashboard' : 'onboarding'}`);
  console.log('   ✅ Expected: redirect to onboarding\n');

  // Test 2: Existing organization (onboarding complete)
  console.log('2. Testing existing organization (acme.com):');
  const existingOrg = await mockOrganizationService.getByDomain('acme.com');
  console.log(`   - Organization: ${existingOrg?.name}`);
  console.log(`   - Onboarding Complete: ${existingOrg?.onboardingComplete}`);
  console.log(`   - Should redirect to: ${existingOrg?.onboardingComplete ? 'dashboard' : 'onboarding'}`);
  console.log('   ✅ Expected: redirect to dashboard\n');

  // Test 3: Unknown organization
  console.log('3. Testing unknown organization (unknown.com):');
  const unknownOrg = await mockOrganizationService.getByDomain('unknown.com');
  console.log(`   - Organization: ${unknownOrg ? 'Found' : 'Not found'}`);
  console.log(`   - Should redirect to: onboarding (no org data)`);
  console.log('   ✅ Expected: redirect to onboarding\n');

  // Test 4: Complete onboarding
  console.log('4. Testing onboarding completion:');
  try {
    const updatedOrg = await mockOrganizationService.updateOnboarding('securecorp.com', true);
    console.log(`   - Updated organization: ${updatedOrg.name}`);
    console.log(`   - Onboarding Complete: ${updatedOrg.onboardingComplete}`);
    console.log('   ✅ Expected: onboarding marked as complete\n');
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  console.log('🎉 All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  testOnboardingFlow().catch(console.error);
}

module.exports = { testOnboardingFlow }; 