import { EnhancedKnowledgeManager } from './lib/policy/enhanced-knowledge-manager';

async function testCRADeveloperSearch() {
  console.log('🧪 Testing CRA Developer Search...\n');
  
  const manager = new EnhancedKnowledgeManager();
  
  // Wait for initialization
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const query = "What are the key aspects for developers in regards to CRA compliance";
  const role = "developer";
  const framework = "cra";
  
  console.log('📋 Test Parameters:');
  console.log(`Query: ${query}`);
  console.log(`Role: ${role}`);
  console.log(`Framework: ${framework}\n`);
  
  // Step 1: Get all CRA chunks
  console.log('🔍 Step 1: Getting CRA chunks...');
  const craChunks = manager.getChunksByFramework('cra-2024');
  console.log(`Found ${craChunks.length} CRA chunks`);
  craChunks.forEach((chunk, i) => {
    console.log(`  ${i + 1}. ${chunk.id}: ${chunk.text.substring(0, 100)}...`);
    console.log(`     Target Roles: ${chunk.metadata.targetRoles?.join(', ') || 'None'}`);
  });
  console.log('');
  
  // Step 2: Get developer chunks
  console.log('👨‍💻 Step 2: Getting developer chunks...');
  const developerChunks = manager.getChunksByRole('developer');
  console.log(`Found ${developerChunks.length} developer chunks`);
  developerChunks.forEach((chunk, i) => {
    console.log(`  ${i + 1}. ${chunk.id}: ${chunk.text.substring(0, 100)}...`);
    console.log(`     Framework: ${chunk.metadata.framework}`);
  });
  console.log('');
  
  // Step 3: Get role-specific guidance
  console.log('🎯 Step 3: Getting role-specific guidance...');
  const roleGuidance = await manager.getRoleSpecificGuidance(role, framework);
  console.log(`Role guidance summary: ${roleGuidance.summary}`);
  console.log(`Found ${roleGuidance.guidance.length} guidance chunks`);
  roleGuidance.guidance.forEach((chunk, i) => {
    console.log(`  ${i + 1}. ${chunk.id}: ${chunk.text.substring(0, 100)}...`);
  });
  console.log('');
  
  // Step 4: Semantic search
  console.log('🔍 Step 4: Semantic search...');
  const semanticResults = await manager.searchBySimilarity(query, 0.2);
  console.log(`Found ${semanticResults.length} semantic results`);
  semanticResults.slice(0, 3).forEach((result, i) => {
    console.log(`  ${i + 1}. ${result.chunk.id}: ${result.chunk.text.substring(0, 100)}...`);
    console.log(`     Framework: ${result.chunk.metadata.framework}`);
    console.log(`     Similarity: ${result.similarity.toFixed(3)}`);
  });
  console.log('');
  
  // Step 5: Role-specific search
  console.log('🎯 Step 5: Role-specific search...');
  const roleResults = await manager.searchRoleSpecific(query, role, framework);
  console.log(`Found ${roleResults.semanticResults.length} role-filtered results`);
  console.log(`Confidence: ${roleResults.confidence}`);
  if (roleResults.sampleResponse) {
    console.log(`Sample response: ${roleResults.sampleResponse}`);
  }
  
  roleResults.semanticResults.forEach((result, i) => {
    console.log(`  ${i + 1}. ${result.chunk.id}: ${result.chunk.text.substring(0, 100)}...`);
    console.log(`     Framework: ${result.chunk.metadata.framework}`);
    console.log(`     Similarity: ${result.similarity.toFixed(3)}`);
  });
  
  console.log('\n✅ Test completed!');
}

testCRADeveloperSearch().catch(console.error);
