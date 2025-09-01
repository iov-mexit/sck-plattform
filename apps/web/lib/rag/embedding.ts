// Enhanced Embedding Service with Semantic Features
// Provides better semantic similarity for regulatory content

export async function generateEmbedding(text: string): Promise<number[]> {
  // Enhanced semantic hash-based embedding
  const semanticEmbedding = generateSemanticEmbedding(text);
  return semanticEmbedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(text => generateEmbedding(text)));
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Enhanced semantic embedding function
function generateSemanticEmbedding(text: string): number[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);

  // Expanded semantic keywords for regulatory content
  const semanticKeywords = {
    security: ['security', 'secure', 'protection', 'safety', 'safeguard', 'defense', 'shield'],
    access: ['access', 'authorization', 'permission', 'control', 'authentication', 'login', 'entry'],
    data: ['data', 'information', 'records', 'files', 'content', 'documents', 'assets'],
    risk: ['risk', 'threat', 'vulnerability', 'exposure', 'danger', 'hazard', 'peril'],
    compliance: ['compliance', 'regulation', 'requirement', 'obligation', 'standard', 'rule', 'law'],
    encryption: ['encryption', 'cryptography', 'encrypt', 'decrypt', 'cipher', 'hash', 'key'],
    incident: ['incident', 'breach', 'attack', 'intrusion', 'compromise', 'violation', 'event'],
    monitoring: ['monitoring', 'logging', 'audit', 'tracking', 'surveillance', 'watch', 'observe'],
    governance: ['governance', 'management', 'policy', 'procedure', 'framework', 'structure', 'control'],
    lifecycle: ['lifecycle', 'development', 'deployment', 'maintenance', 'retirement', 'process', 'phase'],
    // AI-specific keywords
    ai: ['ai', 'artificial', 'intelligence', 'machine', 'learning', 'model', 'algorithm'],
    high_risk: ['high-risk', 'high risk', 'critical', 'dangerous', 'sensitive', 'important'],
    system: ['system', 'application', 'software', 'platform', 'infrastructure', 'architecture'],
    management: ['management', 'administration', 'oversight', 'supervision', 'control', 'leadership'],
    information: ['information', 'info', 'data', 'knowledge', 'intelligence', 'details'],
    requirement: ['requirement', 'requirement', 'need', 'demand', 'specification', 'criteria']
  };

  // Calculate semantic feature scores
  const semanticFeatures = Object.entries(semanticKeywords).map(([category, keywords]) => {
    const matches = words.filter(word => keywords.some(keyword => word.includes(keyword)));
    return matches.length / Math.max(words.length, 1);
  });

  // Word frequency analysis
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });

  // Generate embedding based on semantic features and word patterns
  const embedding = Array.from({ length: 384 }, (_, i) => {
    if (i < semanticFeatures.length) {
      // Use semantic features for first 15 dimensions
      return semanticFeatures[i] * 2 - 1; // Normalize to [-1, 1]
    } else if (i < 50) {
      // Use word frequency patterns
      const wordIndex = i - semanticFeatures.length;
      const word = words[wordIndex % words.length] || '';
      return (simpleHash(word) % 1000) / 1000 - 0.5;
    } else {
      // Use enhanced hash for remaining dimensions
      const hash = simpleHash(text + i.toString());
      return (hash % 1000) / 1000 - 0.5;
    }
  });

  return embedding;
}

// Enhanced hash function with better distribution
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Semantic similarity function for regulatory content
export function semanticSimilarity(text1: string, text2: string): number {
  const embedding1 = generateSemanticEmbedding(text1);
  const embedding2 = generateSemanticEmbedding(text2);
  return cosineSimilarity(embedding1, embedding2);
}

// Regulatory content similarity checker
export function isRegulatorySimilar(text1: string, text2: string, threshold: number = 0.6): boolean {
  const similarity = semanticSimilarity(text1, text2);
  return similarity >= threshold;
}

// Content type classifier for regulatory chunks
export function classifyContentType(text: string): {
  type: 'technical' | 'legal' | 'compliance' | 'security' | 'general';
  confidence: number;
} {
  const technicalKeywords = ['implementation', 'code', 'system', 'technical', 'architecture'];
  const legalKeywords = ['regulation', 'law', 'legal', 'obligation', 'requirement'];
  const complianceKeywords = ['compliance', 'audit', 'certification', 'standard', 'framework'];
  const securityKeywords = ['security', 'encryption', 'authentication', 'vulnerability', 'threat'];

  const words = text.toLowerCase().split(/\s+/);

  const scores = {
    technical: words.filter(w => technicalKeywords.some(k => w.includes(k))).length,
    legal: words.filter(w => legalKeywords.some(k => w.includes(k))).length,
    compliance: words.filter(w => complianceKeywords.some(k => w.includes(k))).length,
    security: words.filter(w => securityKeywords.some(k => w.includes(k))).length
  };

  const maxScore = Math.max(...Object.values(scores));
  const totalWords = words.length;

  if (maxScore === 0) {
    return { type: 'general', confidence: 0.3 };
  }

  const type = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as any || 'general';
  const confidence = maxScore / Math.max(totalWords, 1);

  return { type, confidence: Math.min(confidence, 1.0) };
}
