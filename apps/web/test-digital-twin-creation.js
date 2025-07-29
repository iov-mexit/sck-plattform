// Test script for digital twin creation
const testDigitalTwinCreation = async () => {
  console.log('🧪 Testing Digital Twin Creation...\n');

  // Test 1: Create a digital twin with trust score
  console.log('1️⃣ Creating digital twin with trust score...');
  try {
    const response1 = await fetch('http://localhost:3000/api/v1/digital-twins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationId: 'test-org-1',
        roleTemplateId: 'role-backend-developer',
        assignedToDid: 'did:ethr:0x123456789abcdef',
        name: 'Alice Developer',
        trustScore: 85,
        description: 'Senior backend developer with strong security skills'
      }),
    });

    const result1 = await response1.json();
    console.log('✅ Result:', JSON.stringify(result1, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 2: Create a digital twin without trust score
  console.log('\n2️⃣ Creating digital twin without trust score...');
  try {
    const response2 = await fetch('http://localhost:3000/api/v1/digital-twins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationId: 'test-org-1',
        roleTemplateId: 'role-frontend-developer',
        assignedToDid: 'did:ethr:0x987654321fedcba',
        name: 'Bob Designer',
        description: 'Frontend developer focused on user experience'
      }),
    });

    const result2 = await response2.json();
    console.log('✅ Result:', JSON.stringify(result2, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 3: Send trust score signal from Secure Code Warrior
  console.log('\n3️⃣ Sending trust score signal from Secure Code Warrior...');
  try {
    const response3 = await fetch('http://localhost:3000/api/v1/signals/trust-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        did: 'did:ethr:0x987654321fedcba',
        trustScore: 92,
        organizationId: 'test-org-1',
        source: 'secure-code-warrior'
      }),
    });

    const result3 = await response3.json();
    console.log('✅ Result:', JSON.stringify(result3, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 4: Check current digital twins
  console.log('\n4️⃣ Checking current digital twins...');
  try {
    const response4 = await fetch('http://localhost:3000/api/v1/digital-twins');
    const result4 = await response4.json();
    console.log('✅ Digital Twins:', JSON.stringify(result4, null, 2));
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n🎉 Test completed!');
};

// Run the test
testDigitalTwinCreation(); 