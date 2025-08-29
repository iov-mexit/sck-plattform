// Simple embedding service without sharp dependencies
// For now, we'll use a basic hash-based approach for development
// In production, you can replace this with OpenAI, Cohere, or other API-based embeddings

export async function initEmbedder() {
  console.log('🔤 Using hash-based embedding service (no sharp dependencies)');
  return null; // No initialization needed for hash-based approach
}

export async function generateEmbedding(text: string): Promise<number[]> {
  // Simple hash-based embedding for development
  // This generates a 384-dimensional vector without external dependencies
  const hash = simpleHash(text);
  const embedding = Array.from({ length: 384 }, (_, i) => {
    // Generate pseudo-random but deterministic values based on hash
    return (hash + i * 31) % 1000 / 1000 - 0.5; // Values between -0.5 and 0.5
  });
  
  return embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  
  console.log(`🔤 Generating hash-based embeddings for ${texts.length} texts...`);
  
  for (let i = 0; i < texts.length; i++) {
    try {
      const embedding = await generateEmbedding(texts[i]);
      embeddings.push(embedding);
      
      if ((i + 1) % 10 === 0) {
        console.log(`   Generated ${i + 1}/${texts.length} embeddings`);
      }
    } catch (error) {
      console.error(`❌ Failed to embed text ${i}:`, error);
      // Generate fallback embedding (zeros) to maintain array structure
      embeddings.push(Array.from({ length: 384 }, () => 0));
    }
  }
  
  console.log(`✅ Generated ${embeddings.length} hash-based embeddings`);
  return embeddings;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (normA * normB);
}

// Simple hash function for deterministic embeddings
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
