import { pipeline } from '@xenova/transformers';

let embedder: any = null;

export async function initEmbedder() {
  if (embedder) return embedder;

  console.log('🔤 Initializing embedding model (MiniLM-L6-v2)...');
  embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  console.log('✅ Embedding model ready');

  return embedder;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = await initEmbedder();

  try {
    const output = await model(text, { pooling: 'mean', normalize: true });
    const embedding = Array.from(output.data);

    // Validate embedding dimensions
    if (embedding.length !== 384) {
      throw new Error(`Invalid embedding dimension: ${embedding.length}, expected 384`);
    }

    return embedding as number[];
  } catch (error) {
    console.error('❌ Embedding generation failed:', error);
    throw error;
  }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const model = await initEmbedder();
  const embeddings: number[][] = [];

  console.log(`🔤 Generating embeddings for ${texts.length} texts...`);

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

  console.log(`✅ Generated ${embeddings.length} embeddings`);
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
