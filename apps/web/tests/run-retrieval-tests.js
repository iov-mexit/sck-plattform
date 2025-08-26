#!/usr/bin/env node
/**
 * SCK Security Framework Retrieval Test Runner
 * Runs retrieval tests against the RAG system
 */

const fs = require('fs');
const path = require('path');

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX = process.env.PINECONE_INDEX || 'sck-knowledge';

async function generateEmbedding(text) {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data[0].embedding;
}

async function queryPinecone(vector, topK = 3) {
  if (!PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY environment variable is required');
  }

  // This is a simplified version - in production use the official Pinecone SDK
  const response = await fetch(`https://${PINECONE_INDEX}.svc.pinecone.io/query`, {
    method: 'POST',
    headers: {
      'Api-Key': PINECONE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vector,
      topK,
      includeMetadata: true
    })
  });

  if (!response.ok) {
    throw new Error(`Pinecone API error: ${response.statusText}`);
  }

  return response.json();
}

async function runRetrievalTest(test, testIndex) {
  console.log(`\n🧪 Running Test ${testIndex + 1}: ${test.name}`);
  console.log(`Query: "${test.prompt}"`);
  
  try {
    // Generate embedding for the test prompt
    const queryEmbedding = await generateEmbedding(test.prompt);
    
    // Query the vector database
    const queryResult = await queryPinecone(queryEmbedding, 3);
    
    if (!queryResult.matches || queryResult.matches.length === 0) {
      console.log(`❌ No results returned for test: ${test.name}`);
      return { passed: false, error: 'No results returned' };
    }

    const topResult = queryResult.matches[0];
    const secondResult = queryResult.matches[1];
    
    console.log(`🔍 Top result: ${topResult.id} (score: ${topResult.score.toFixed(3)})`);
    console.log(`📋 Content: ${topResult.metadata.content.substring(0, 100)}...`);
    
    // Validate the top result
    let passed = true;
    const errors = [];
    
    // Check if the expected result is in the top 3
    const expectedFound = queryResult.matches.some(match => 
      match.id === test.expectedTopResult
    );
    
    if (!expectedFound) {
      passed = false;
      errors.push(`Expected result ${test.expectedTopResult} not found in top 3`);
    }
    
    // Check confidence threshold
    if (topResult.score < test.confidenceThreshold) {
      passed = false;
      errors.push(`Top result score ${topResult.score} below threshold ${test.confidenceThreshold}`);
    }
    
    // Check source
    if (topResult.metadata.source !== test.expectedSource) {
      passed = false;
      errors.push(`Source mismatch: expected ${test.expectedSource}, got ${topResult.metadata.source}`);
    }
    
    // Check if expected tags are present
    const resultTags = topResult.metadata.tags.split(',');
    const missingTags = test.expectedTags.filter(tag => !resultTags.includes(tag));
    if (missingTags.length > 0) {
      passed = false;
      errors.push(`Missing expected tags: ${missingTags.join(', ')}`);
    }
    
    // Display results
    if (passed) {
      console.log(`✅ Test PASSED: ${test.name}`);
      console.log(`🎯 Expected: ${test.expectedTopResult} → Got: ${topResult.id}`);
    } else {
      console.log(`❌ Test FAILED: ${test.name}`);
      errors.forEach(error => console.log(`   - ${error}`));
    }
    
    // Show top 3 results for debugging
    console.log(`\n📊 Top 3 Results:`);
    queryResult.matches.forEach((match, index) => {
      console.log(`   ${index + 1}. ${match.id} (${match.score.toFixed(3)}) - ${match.metadata.source}`);
    });
    
    return { passed, errors, topResult, allResults: queryResult.matches };
    
  } catch (error) {
    console.log(`💥 Test ERROR: ${test.name} - ${error.message}`);
    return { passed: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 SCK Security Framework Retrieval Test Suite');
  console.log('=============================================');
  
  try {
    // Load test configuration
    const testsPath = path.join(__dirname, 'retrieval-tests.json');
    if (!fs.existsSync(testsPath)) {
      throw new Error(`Test configuration not found: ${testsPath}`);
    }
    
    const testConfig = JSON.parse(fs.readFileSync(testsPath, 'utf8'));
    const tests = testConfig.tests;
    
    console.log(`📋 Running ${tests.length} retrieval tests...`);
    console.log(`🌍 Frameworks: ${testConfig.metadata.frameworksCovered.join(', ')}`);
    console.log(`🏛️ Jurisdictions: ${testConfig.metadata.jurisdictions.join(', ')}`);
    
    // Run all tests
    const results = [];
    for (let i = 0; i < tests.length; i++) {
      const result = await runRetrievalTest(tests[i], i);
      results.push(result);
      
      // Add delay between tests
      if (i < tests.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Summary
    console.log('\n📊 Test Summary');
    console.log('===============');
    
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${results.length}`);
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed! RAG system is working correctly.');
    } else {
      console.log('\n⚠️ Some tests failed. Check the results above for details.');
    }
    
    // Return results for CI/CD
    return {
      total: results.length,
      passed,
      failed,
      results
    };
    
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  runAllTests()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runAllTests, runRetrievalTest };
