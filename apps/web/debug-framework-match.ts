import { EnhancedKnowledgeManager } from './lib/policy/enhanced-knowledge-manager';

async function debugFrameworkMatching() {
  console.log('🔍 Debugging Framework Matching...\n');
  
  const manager = new EnhancedKnowledgeManager();
  
  // Wait for initialization
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const query = "What are the key aspects for developers in regards to CRA compliance";
  const role = "developer";
  const frameworks = ["cra"];
  
  console.log('📋 Test Parameters:');
  console.log(`Query: ${query}`);
  console.log(`Role: ${role}`);
  console.log(`Frameworks: ${frameworks}\n`);
  
  // Get role-specific search results
  const roleResults = await manager.searchRoleSpecific(query, role, frameworks[0]);
  
  console.log(`🔍 Found ${roleResults.semanticResults.length} role-filtered results`);
  
  // Test framework matching logic
  roleResults.semanticResults.forEach((result, i) => {
    const chunkFramework = result.chunk.metadata.framework?.toLowerCase() || '';
    const requestedFramework = frameworks[0].toLowerCase();
    
    const exactMatch = chunkFramework === requestedFramework;
    const includesMatch = chunkFramework.includes(requestedFramework);
    const startsWithMatch = chunkFramework.startsWith(requestedFramework + '-');
    
    console.log(`\n${i + 1}. ${result.chunk.id}:`);
    console.log(`   Framework: ${result.chunk.metadata.framework}`);
    console.log(`   Similarity: ${result.similarity.toFixed(3)}`);
    console.log(`   Exact match: ${exactMatch}`);
    console.log(`   Includes match: ${includesMatch}`);
    console.log(`   Starts with match: ${startsWithMatch}`);
    console.log(`   Text: ${result.chunk.text.substring(0, 100)}...`);
  });
  
  // Test the framework filtering logic
  console.log('\n🎯 Testing Framework Filtering Logic:');
  const frameworkSpecificResults = roleResults.semanticResults.filter(result => 
    frameworks.some(framework => {
      const chunkFramework = result.chunk.metadata.framework?.toLowerCase() || '';
      const requestedFramework = framework.toLowerCase();
      const matches = chunkFramework === requestedFramework || 
                     chunkFramework.includes(requestedFramework) ||
                     chunkFramework.startsWith(requestedFramework + '-');
      
      console.log(`   ${result.chunk.id}: ${chunkFramework} vs ${requestedFramework} = ${matches}`);
      return matches;
    })
  );
  
  console.log(`\n✅ Framework-specific results: ${frameworkSpecificResults.length}`);
  
  if (frameworkSpecificResults.length > 0) {
    console.log('\n🏆 Best framework-specific match:');
    frameworkSpecificResults.sort((a, b) => b.similarity - a.similarity);
    const bestMatch = frameworkSpecificResults[0];
    console.log(`   ${bestMatch.chunk.id}: ${bestMatch.chunk.text.substring(0, 200)}...`);
  }
  
  console.log('\n✅ Debug completed!');
}

debugFrameworkMatching().catch(console.error);

