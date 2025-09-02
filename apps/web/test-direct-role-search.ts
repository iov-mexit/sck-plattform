import { EnhancedKnowledgeManager } from './lib/policy/enhanced-knowledge-manager';

async function testDirectRoleSearch() {
  console.log('🔍 Testing Direct Role Search...\n');
  
  const manager = new EnhancedKnowledgeManager();
  
  // Wait for initialization
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const query = "What are the key aspects for developers in regards to CRA compliance";
  const role = "developer";
  
  console.log('📋 Test Parameters:');
  console.log(`Query: ${query}`);
  console.log(`Role: ${role}\n`);
  
  // Test 1: Direct semantic search with different thresholds
  console.log('🔍 Test 1: Semantic search with different thresholds');
  for (const threshold of [0.1, 0.2, 0.3, 0.4]) {
    const results = await manager.searchBySimilarity(query, threshold);
    console.log(`   Threshold ${threshold}: ${results.length} results`);
    if (results.length > 0) {
      console.log(`   Top result: ${results[0].chunk.id} (${results[0].chunk.metadata.framework}) - ${results[0].similarity.toFixed(3)}`);
    }
  }
  console.log('');
  
  // Test 2: Role-specific search
  console.log('🎯 Test 2: Role-specific search');
  const roleResults = await manager.searchRoleSpecific(query, role);
  console.log(`   Role-filtered results: ${roleResults.semanticResults.length}`);
  roleResults.semanticResults.forEach((result, i) => {
    console.log(`   ${i + 1}. ${result.chunk.id}: ${result.chunk.metadata.framework} - ${result.similarity.toFixed(3)}`);
  });
  console.log('');
  
  // Test 3: Direct role filtering
  console.log('👨‍💻 Test 3: Direct role filtering');
  const developerChunks = manager.getChunksByRole('developer');
  console.log(`   Total developer chunks: ${developerChunks.length}`);
  developerChunks.forEach((chunk, i) => {
    console.log(`   ${i + 1}. ${chunk.id}: ${chunk.metadata.framework}`);
  });
  console.log('');
  
  // Test 4: CRA chunks specifically
  console.log('🛡️ Test 4: CRA chunks specifically');
  const craChunks = manager.getChunksByFramework('cra-2024');
  const craDeveloperChunks = craChunks.filter(chunk => 
    chunk.metadata.targetRoles?.includes('developer')
  );
  console.log(`   Total CRA chunks: ${craChunks.length}`);
  console.log(`   CRA developer chunks: ${craDeveloperChunks.length}`);
  craDeveloperChunks.forEach((chunk, i) => {
    console.log(`   ${i + 1}. ${chunk.id}: ${chunk.text.substring(0, 100)}...`);
  });
  
  console.log('\n✅ Test completed!');
}

testDirectRoleSearch().catch(console.error);

