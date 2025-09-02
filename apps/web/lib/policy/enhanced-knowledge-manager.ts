// Enhanced Knowledge Manager with Embedding Support
// Multi-regulatory intelligence with semantic search capabilities

import { KnowledgeManager } from './knowledge-manager';
import { RegulatoryRequirement, FrameworkMetadata, CrossReference } from './regulatory-core';
import { EnhancedKnowledgeChunk, ALL_REGULATORY_CHUNKS, FRAMEWORK_METADATA } from './enhanced-knowledge-chunks';
import { generateEmbedding, cosineSimilarity } from '../rag/embedding';
import fs from 'fs';
import path from 'path';

export interface SemanticSearchResult {
  chunk: EnhancedKnowledgeChunk;
  similarity: number;
  matchedConcepts: string[];
  framework: string;
  chunkType: string;
  confidence: number;
}

export interface MultiModalSearchResult {
  semanticResults: SemanticSearchResult[];
  keywordResults: any[];
  crossReferenceResults: any[];
  totalResults: number;
  searchTime: number;
}

export class EnhancedKnowledgeManager extends KnowledgeManager {
  private enhancedChunks: Map<string, EnhancedKnowledgeChunk> = new Map();
  private chunkEmbeddings: Map<string, number[]> = new Map();
  private conceptIndex: Map<string, string[]> = new Map(); // concept -> chunkIds
  public initializationComplete: Promise<void>;

  constructor() {
    super();
    // Kick off async initialization and retain a promise we can await before searches
    this.initializationComplete = this.initializeEnhancedChunks();
  }

  /**
   * Initialize enhanced knowledge chunks with embeddings
   */
  private async initializeEnhancedChunks(): Promise<void> {
    console.log('🚀 Initializing Enhanced Knowledge Manager with embeddings...');

    // Load all regulatory chunks
    console.log('🔍 About to load external chunks...');
    for (const chunk of ALL_REGULATORY_CHUNKS) {
      this.enhancedChunks.set(chunk.id, chunk);

      // Index concepts for fast lookup
      if (chunk.metadata.concepts) {
        for (const concept of chunk.metadata.concepts) {
          const existing = this.conceptIndex.get(concept) || [];
          existing.push(chunk.id);
          this.conceptIndex.set(concept, existing);
        }
      }
    }

    // Load external role-specific chunks from JSONL files if available
    console.log('🔍 Starting external chunk loading...');
    try {
      // Resolve external directory robustly against varying CWDs
      const candidateDirs = [
        path.resolve(process.cwd(), 'rag-ingestion/cleaned-data/role_chunks'),
        path.resolve(process.cwd(), 'apps/web/rag-ingestion/cleaned-data/role_chunks'),
        path.resolve(process.cwd(), '../rag-ingestion/cleaned-data/role_chunks'),
      ];
      const resolvedExternalDir = candidateDirs.find(d => fs.existsSync(d));
      console.log(`🔍 Current working directory: ${process.cwd()}`);
      console.log(`🔍 Candidate external dirs: ${candidateDirs.join(' | ')}`);
      console.log(`🔍 Chosen external dir: ${resolvedExternalDir || 'NOT FOUND'}`);
      if (resolvedExternalDir && fs.existsSync(resolvedExternalDir)) {
        // First try to load the embedded JSONL file (preferred)
        const embeddedFile = path.join(resolvedExternalDir, 'regulatory_knowledge.embedded.jsonl');
        console.log(`🔍 Looking for embedded file: ${embeddedFile}`);
        console.log(`🔍 File exists: ${fs.existsSync(embeddedFile)}`);
        if (fs.existsSync(embeddedFile)) {
          try {
            const raw = fs.readFileSync(embeddedFile, 'utf-8');
            const lines = raw.trim().split('\n').filter(line => line.trim());
            console.log(`🔍 Found ${lines.length} lines in JSONL file`);
            let loadedCount = 0;

            for (const line of lines) {
              try {
                const raw: any = JSON.parse(line);
                const id: string = raw.id || raw.requirementId || `ext-${Math.random().toString(36).slice(2)}`;

                // Derive framework from id heuristics
                const lowerId = (id || '').toLowerCase();
                let framework = raw.framework || raw.metadata?.framework;
                if (!framework) {
                  if (lowerId.includes('nis2')) framework = 'nis2-2023';
                  else if (lowerId.includes('dora')) framework = 'dora-2024';
                  else if (lowerId.includes('cra')) framework = 'cra-2024';
                  else if (lowerId.includes('iso27001') || lowerId.includes('iso-27001')) framework = 'iso-27001-2022';
                  else if (lowerId.includes('owasp-api')) framework = 'owasp-api-2023';
                  else if (lowerId.includes('owasp-web') || lowerId.includes('owasp-top10')) framework = 'owasp-top10-2021';
                  else if (lowerId.includes('ai-act') || lowerId.includes('iso42001')) framework = 'eu-ai-act-2024';
                  else framework = 'unknown';
                }

                // Build text from core + role phrasing for richer retrieval
                const roles = raw.roles || {};
                const roleTexts: string[] = [];
                for (const roleKey of ['Developer', 'ProductManager', 'ComplianceOfficer', 'CISO']) {
                  const r = roles[roleKey];
                  if (r?.phrasing) roleTexts.push(`${roleKey}: ${r.phrasing}`);
                  if (r?.policyGuidance) roleTexts.push(`${roleKey} Policy: ${r.policyGuidance}`);
                }
                const coreParts = [raw.coreDescription, ...roleTexts].filter(Boolean);
                const text = coreParts.join('\n');

                const safeChunk: any = {
                  id,
                  text,
                  metadata: {
                    framework,
                    concepts: Array.isArray(raw.metadata?.concepts) ? raw.metadata.concepts : []
                  }
                };

                // Avoid ID collisions
                if (!this.enhancedChunks.has(id)) {
                  this.enhancedChunks.set(id, safeChunk);
                  // If the raw line has an embedding array, store it
                  if (Array.isArray(raw.embedding)) {
                    this.chunkEmbeddings.set(id, raw.embedding);
                  }
                  const concepts: string[] = safeChunk.metadata?.concepts || [];
                  for (const concept of concepts) {
                    const existing = this.conceptIndex.get(concept) || [];
                    existing.push(id);
                    this.conceptIndex.set(concept, existing);
                  }
                  loadedCount++;
                }
              } catch (parseErr) {
                console.error(`❌ Failed parsing JSONL line:`, parseErr);
              }
            }
            console.log(`✅ Loaded ${loadedCount} embedded chunks from regulatory_knowledge.embedded.jsonl`);
          } catch (err) {
            console.error(`❌ Failed loading embedded chunks:`, err);
          }
        } else {
          // Fallback to JSON files
          const files = fs.readdirSync(resolvedExternalDir).filter(f => f.endsWith('.json'));
          for (const file of files) {
            try {
              const full = path.join(resolvedExternalDir, file);
              const raw = fs.readFileSync(full, 'utf-8');
              const items: EnhancedKnowledgeChunk[] = JSON.parse(raw);
              for (const item of items) {
                // Avoid ID collisions
                if (!this.enhancedChunks.has(item.id)) {
                  this.enhancedChunks.set(item.id, item);
                  if (item.metadata.concepts) {
                    for (const concept of item.metadata.concepts) {
                      const existing = this.conceptIndex.get(concept) || [];
                      existing.push(item.id);
                      this.conceptIndex.set(concept, existing);
                    }
                  }
                }
              }
              console.log(`✅ Loaded ${items.length} external chunks from ${file}`);
            } catch (err) {
              console.error(`❌ Failed loading external chunks from ${file}:`, err);
            }
          }
        }
      }
    } catch (err) {
      console.error('❌ External chunk loading failed:', err);
    }

    // Generate embeddings for chunks that don't already have them
    await this.generateEmbeddingsForAllChunks();

    console.log(`✅ Enhanced Knowledge Manager initialized: ${this.enhancedChunks.size} chunks, ${this.chunkEmbeddings.size} embeddings`);
  }

  /**
   * Generate embeddings for all knowledge chunks
   */
  private async generateEmbeddingsForAllChunks(): Promise<void> {
    console.log('🔤 Generating embeddings for all knowledge chunks...');

    const chunks = Array.from(this.enhancedChunks.values());

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const embedding = await generateEmbedding(chunk.text);
        this.chunkEmbeddings.set(chunk.id, embedding);

        if ((i + 1) % 10 === 0) {
          console.log(`   Generated ${i + 1}/${chunks.length} embeddings`);
        }
      } catch (error) {
        console.error(`❌ Failed to generate embedding for chunk ${chunk.id}:`, error);
        // Use fallback embedding (zeros)
        this.chunkEmbeddings.set(chunk.id, Array.from({ length: 384 }, () => 0));
      }
    }

    console.log(`✅ Generated ${this.chunkEmbeddings.size} embeddings`);
  }

  /**
   * Semantic search across all knowledge chunks
   */
  async searchBySimilarity(query: string, threshold: number = 0.7): Promise<SemanticSearchResult[]> {
    const startTime = Date.now();

    try {
      // Ensure embeddings and indexes are ready before searching
      await this.initializationComplete;
      const queryEmbedding = await generateEmbedding(query);
      const results: SemanticSearchResult[] = [];

      // Search through all enhanced chunks
      for (const [chunkId, chunk] of this.enhancedChunks) {
        const embedding = this.chunkEmbeddings.get(chunkId);
        if (embedding) {
          const similarity = cosineSimilarity(queryEmbedding, embedding);

          if (similarity >= threshold) {
            const matchedConcepts = this.findMatchedConcepts(query, chunk);

            results.push({
              chunk,
              similarity,
              matchedConcepts,
              framework: chunk.metadata.framework || 'unknown',
              chunkType: chunk.chunkType,
              confidence: chunk.metadata.confidence
            });
          }
        }
      }

      // Sort by similarity (highest first)
      results.sort((a, b) => b.similarity - a.similarity);

      const searchTime = Date.now() - startTime;
      console.log(`🔍 Semantic search completed in ${searchTime}ms: ${results.length} results above threshold ${threshold}`);

      return results;
    } catch (error) {
      console.error('❌ Semantic search failed:', error);
      return [];
    }
  }

  /**
   * Multi-modal search combining semantic, keyword, and cross-reference search
   */
  async searchIntelligent(query: string, userRole?: string): Promise<MultiModalSearchResult> {
    const startTime = Date.now();

    // Ensure initialization before any composite search
    await this.initializationComplete;

    // 1. Semantic search
    const semanticResults = await this.searchBySimilarity(query, 0.6);

    // 2. Keyword search (fallback)
    const keywordResults = this.searchAcrossFrameworks(query);

    // 3. Concept-based search
    const conceptResults = this.searchByConcepts(query);

    // 4. Role-based filtering
    const roleFilteredResults = userRole ? this.filterByRole(semanticResults, userRole) : semanticResults;

    const searchTime = Date.now() - startTime;

    return {
      semanticResults: roleFilteredResults,
      keywordResults,
      crossReferenceResults: conceptResults,
      totalResults: roleFilteredResults.length + keywordResults.length + conceptResults.length,
      searchTime
    };
  }

  /**
   * Search by concepts/keywords
   */
  private searchByConcepts(query: string): SemanticSearchResult[] {
    const queryLower = query.toLowerCase();
    const results: SemanticSearchResult[] = [];

    // Find chunks that contain concepts matching the query
    for (const [concept, chunkIds] of this.conceptIndex) {
      if (concept.toLowerCase().includes(queryLower) || queryLower.includes(concept.toLowerCase())) {
        for (const chunkId of chunkIds) {
          const chunk = this.enhancedChunks.get(chunkId);
          if (chunk) {
            results.push({
              chunk,
              similarity: 0.8, // High similarity for concept matches
              matchedConcepts: [concept],
              framework: chunk.metadata.framework || 'unknown',
              chunkType: chunk.chunkType,
              confidence: chunk.metadata.confidence
            });
          }
        }
      }
    }

    return results;
  }

  /**
   * Filter results by user role
   */
  private filterByRole(results: SemanticSearchResult[], userRole: string): SemanticSearchResult[] {
    return results.filter(result => {
      const targetRoles = result.chunk.metadata.targetRoles;
      if (!targetRoles || targetRoles.length === 0) return true; // No role restriction

      return targetRoles.some(role =>
        role.toLowerCase().includes(userRole.toLowerCase()) ||
        userRole.toLowerCase().includes(role.toLowerCase())
      );
    });
  }

  /**
   * Find concepts that match the query
   */
  private findMatchedConcepts(query: string, chunk: EnhancedKnowledgeChunk): string[] {
    const queryLower = query.toLowerCase();
    const matchedConcepts: string[] = [];

    if (chunk.metadata.concepts) {
      for (const concept of chunk.metadata.concepts) {
        if (concept.toLowerCase().includes(queryLower) || queryLower.includes(concept.toLowerCase())) {
          matchedConcepts.push(concept);
        }
      }
    }

    return matchedConcepts;
  }

  /**
   * Get chunks by framework
   */
  getChunksByFramework(frameworkId: string): EnhancedKnowledgeChunk[] {
    return Array.from(this.enhancedChunks.values())
      .filter(chunk => chunk.metadata.framework === frameworkId);
  }

  /**
   * Get chunks by difficulty level
   */
  getChunksByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): EnhancedKnowledgeChunk[] {
    return Array.from(this.enhancedChunks.values())
      .filter(chunk => chunk.metadata.difficulty === difficulty);
  }

  /**
   * Get chunks by target role
   */
  getChunksByRole(role: string): EnhancedKnowledgeChunk[] {
    return Array.from(this.enhancedChunks.values())
      .filter(chunk => chunk.metadata.targetRoles?.some(r =>
        r.toLowerCase().includes(role.toLowerCase())
      ));
  }

  /**
   * Get chunks by jurisdiction
   */
  getChunksByJurisdiction(jurisdiction: string): EnhancedKnowledgeChunk[] {
    return Array.from(this.enhancedChunks.values())
      .filter(chunk => chunk.metadata.jurisdiction === jurisdiction);
  }

  /**
   * Get comprehensive system statistics
   */
  getEnhancedStats(): {
    totalChunks: number;
    totalEmbeddings: number;
    frameworks: string[];
    jurisdictions: string[];
    chunkTypes: string[];
    averageConfidence: number;
    roleDistribution: Record<string, number>;
    difficultyDistribution: Record<string, number>;
  } {
    const chunks = Array.from(this.enhancedChunks.values());
    const frameworks = [...new Set(chunks.map(c => c.metadata.framework).filter(Boolean))];
    const jurisdictions = [...new Set(chunks.map(c => c.metadata.jurisdiction).filter(Boolean))];
    const chunkTypes = [...new Set(chunks.map(c => c.chunkType))];

    // Role distribution
    const roleDistribution: Record<string, number> = {};
    chunks.forEach(chunk => {
      chunk.metadata.targetRoles?.forEach(role => {
        roleDistribution[role] = (roleDistribution[role] || 0) + 1;
      });
    });

    // Difficulty distribution
    const difficultyDistribution: Record<string, number> = {};
    chunks.forEach(chunk => {
      if (chunk.metadata.difficulty) {
        difficultyDistribution[chunk.metadata.difficulty] = (difficultyDistribution[chunk.metadata.difficulty] || 0) + 1;
      }
    });

    const averageConfidence = chunks.reduce((sum, chunk) => sum + chunk.metadata.confidence, 0) / chunks.length;

    return {
      totalChunks: chunks.length,
      totalEmbeddings: this.chunkEmbeddings.size,
      frameworks,
      jurisdictions,
      chunkTypes,
      averageConfidence,
      roleDistribution,
      difficultyDistribution
    };
  }

  /**
   * Add new knowledge chunk with embedding
   */
  async addKnowledgeChunk(chunk: EnhancedKnowledgeChunk): Promise<boolean> {
    try {
      // Generate embedding
      const embedding = await generateEmbedding(chunk.text);

      // Store chunk and embedding
      this.enhancedChunks.set(chunk.id, chunk);
      this.chunkEmbeddings.set(chunk.id, embedding);

      // Update concept index
      if (chunk.metadata.concepts) {
        for (const concept of chunk.metadata.concepts) {
          const existing = this.conceptIndex.get(concept) || [];
          existing.push(chunk.id);
          this.conceptIndex.set(concept, existing);
        }
      }

      console.log(`✅ Added knowledge chunk: ${chunk.id} with embedding`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to add knowledge chunk ${chunk.id}:`, error);
      return false;
    }
  }

  /**
   * Get system health status
   */
  getEnhancedHealthStatus(): {
    status: 'Healthy' | 'Warning' | 'Critical';
    message: string;
    stats: any;
    embeddingStatus: 'Ready' | 'Generating' | 'Failed';
  } {
    const stats = this.getEnhancedStats();
    const embeddingStatus = this.chunkEmbeddings.size === this.enhancedChunks.size ? 'Ready' : 'Generating';

    let status: 'Healthy' | 'Warning' | 'Critical' = 'Healthy';
    let message = 'Enhanced Knowledge Manager is operating normally';

    if (stats.totalChunks === 0) {
      status = 'Critical';
      message = 'No knowledge chunks available';
    } else if (embeddingStatus !== 'Ready') {
      status = 'Warning';
      message = `Embeddings are still being generated: ${this.chunkEmbeddings.size}/${this.enhancedChunks.size}`;
    } else if (stats.averageConfidence < 0.9) {
      status = 'Warning';
      message = 'Average confidence is below recommended threshold';
    }

    return {
      status,
      message,
      stats,
      embeddingStatus
    };
  }

  // Role-specific regulatory guidance method
  async getRoleSpecificGuidance(role: string, framework?: string): Promise<{
    role: string;
    framework?: string;
    guidance: any[];
    sampleResponses?: any;
    summary: string;
  }> {
    // Ensure initialization before accessing chunk collections
    await this.initializationComplete;
    const roleChunks = this.getChunksByRole(role);
    const frameworkChunks = framework ? this.getChunksByFramework(framework) : roleChunks;

    // Filter for role-specific content
    const roleSpecificChunks = roleChunks.filter(chunk =>
      chunk.metadata.targetRoles?.includes(role.toLowerCase()) ||
      chunk.metadata.roleSpecificRelevance
    );

    // Get sample responses if available
    let sampleResponses;
    if (role.toLowerCase() === 'product manager') {
      sampleResponses = {
        'dora': {
          concise: 'As a Product Manager, DORA means you must bake in resilience and contractual safeguards when using third-party services—backup endpoints, SLAs, audit rights—so production incidents can be managed swiftly.',
          detailed: 'DORA requires that your product maintains operational resilience — you must structure contracts with model/data vendors allowing resilience tests and define fallback behavior, while ensuring logging and incident-response align with reporting obligations. These should be explicit in your roadmap and rollout plans.'
        },
        'nis2': {
          concise: 'NIS2 means your product must support incident logging, detection, and enable reporting within required timeframes, plus incorporate security measures and supply-chain scrutiny in feature planning.',
          detailed: 'Product Managers must treat security as part of core requirements: logging severity, access controls, and vendor vetting must be designed in. Moreover, you need to ensure that incidents can be classified and reported per NIS2 timelines and governance protocols.'
        },
        'iso27001': {
          concise: 'As a Product Manager, ISO 27001 means aligning your product features with organizational security policies, ensuring access controls, audit trails, and risk management are built into your roadmap.',
          detailed: 'ISO 27001 requires that your product supports the organization\'s Information Security Management System (ISMS). This includes implementing access controls, audit logging, risk assessments, and security policies that align with organizational standards.'
        }
      };
    }

    const summary = `Found ${roleSpecificChunks.length} role-specific guidance chunks for ${role}${framework ? ` in ${framework}` : ''}`;

    return {
      role,
      framework,
      guidance: roleSpecificChunks,
      sampleResponses,
      summary
    };
  }

  // Enhanced role-based search with context
  async searchRoleSpecific(query: string, role: string, framework?: string): Promise<{
    semanticResults: SemanticSearchResult[]; // role-filtered
    unfilteredSemanticResults: SemanticSearchResult[]; // full set for framework fallback
    roleGuidance: any;
    sampleResponse?: string;
    confidence: number;
  }> {
    // Get semantic results with lower threshold for role-specific queries
    const semanticResults = await this.searchBySimilarity(query, 0.1);

    // Get role-specific guidance
    const roleGuidance = await this.getRoleSpecificGuidance(role, framework);

    // Filter results by role
    const roleFilteredResults = semanticResults.filter(result => {
      const targetRoles = result.chunk.metadata.targetRoles;
      const hasRoleHints = Array.isArray(result.chunk.metadata.roleSpecificRelevance) && result.chunk.metadata.roleSpecificRelevance.length > 0;

      // If explicit targetRoles are provided, require a role match
      if (Array.isArray(targetRoles) && targetRoles.length > 0) {
        return targetRoles.some(r => r.toLowerCase().includes(role.toLowerCase()) || role.toLowerCase().includes(r.toLowerCase()));
      }

      // If no explicit roles but there are role hints, allow as generally role-relevant
      if (hasRoleHints) {
        return true;
      }

      // Otherwise, allow (generic content)
      return true;
    });

    // Generate sample response if available
    let sampleResponse;
    if (roleGuidance.sampleResponses) {
      const frameworkKey = framework?.toLowerCase().replace(/[^a-z]/g, '') || 'general';
      const response = roleGuidance.sampleResponses[frameworkKey];
      if (response) {
        sampleResponse = response.concise;
      }
    }

    const confidence = roleFilteredResults.length > 0 ?
      Math.min(0.95, 0.7 + (roleFilteredResults.length * 0.05)) : 0.5;

    return {
      semanticResults: roleFilteredResults,
      unfilteredSemanticResults: semanticResults,
      roleGuidance,
      sampleResponse,
      confidence
    };
  }
}
