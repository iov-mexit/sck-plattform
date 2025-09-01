// Multi-Framework Knowledge Manager
// Plug-and-play architecture for regulatory compliance intelligence

import {
  RegulatoryRequirement,
  FrameworkMetadata,
  CrossReference,
  KnowledgeChunk,
  ConfidenceValidator,
  GlobalId
} from './regulatory-core';

export interface KnowledgeManagerStats {
  totalFrameworks: number;
  totalRequirements: number;
  totalCrossReferences: number;
  totalKnowledgeChunks: number;
  averageConfidence: number;
  lowConfidenceItems: number;
  validationStatus: 'Valid' | 'Issues Detected';
}

export interface SearchResult {
  requirement: RegulatoryRequirement;
  relevance: number;
  matchedFields: string[];
  crossReferences: RegulatoryRequirement[];
}

export class KnowledgeManager {
  private frameworks: Map<string, Map<string, RegulatoryRequirement>> = new Map();
  private frameworkMetadata: Map<string, FrameworkMetadata> = new Map();
  private crossReferences: Map<string, CrossReference> = new Map();
  private knowledgeChunks: Map<string, KnowledgeChunk[]> = new Map();

  constructor() {
    console.log('🚀 Multi-Framework Knowledge Manager initialized');
  }

  // 🏗️ Framework Management - Plug-and-Play Architecture

  /**
   * Add a new regulatory framework with requirements
   * No code changes needed - just pass in new RegulatoryRequirement[]
   */
  addFramework(frameworkId: string, requirements: RegulatoryRequirement[]): void {
    if (this.frameworks.has(frameworkId)) {
      console.warn(`⚠️ Framework ${frameworkId} already exists, updating...`);
    }

    const frameworkMap = new Map<string, RegulatoryRequirement>();
    let addedCount = 0;
    let rejectedCount = 0;

    requirements.forEach(req => {
      if (ConfidenceValidator.validateRequirement(req)) {
        // Ensure requirement has correct frameworkId
        req.frameworkId = frameworkId;

        // Create global ID for cross-references
        const globalId = GlobalId.create(frameworkId, req.id);

        frameworkMap.set(req.id, req);
        addedCount++;

        // Add knowledge chunks if present
        if (req.knowledgeChunks) {
          this.addKnowledgeChunksForRequirement(globalId, req.knowledgeChunks);
        }
      } else {
        console.warn(`❌ Requirement ${req.id} rejected: confidence too low (${req.confidence})`);
        rejectedCount++;
      }
    });

    this.frameworks.set(frameworkId, frameworkMap);

    console.log(`✅ Added framework ${frameworkId}: ${addedCount} requirements added, ${rejectedCount} rejected`);
    console.log(`📊 Total frameworks: ${this.frameworks.size}, Total requirements: ${this.getTotalRequirements()}`);
  }

  /**
   * Add framework metadata for enhanced information
   */
  addFrameworkMetadata(metadata: FrameworkMetadata): boolean {
    if (metadata.confidence < 0.9) {
      console.error(`❌ Framework metadata rejected: confidence too low (${metadata.confidence})`);
      return false;
    }

    this.frameworkMetadata.set(metadata.id, metadata);
    console.log(`✅ Framework metadata added: ${metadata.name} (${metadata.version})`);
    return true;
  }

  // 🔍 Query and Search Operations

  /**
   * Get all available frameworks
   */
  getFrameworks(): string[] {
    return Array.from(this.frameworks.keys());
  }

  /**
   * Get framework metadata
   */
  getFrameworkMetadata(frameworkId: string): FrameworkMetadata | undefined {
    return this.frameworkMetadata.get(frameworkId);
  }

  /**
   * Get requirement by framework and ID
   */
  getRequirement(frameworkId: string, reqId: string): RegulatoryRequirement | undefined {
    return this.frameworks.get(frameworkId)?.get(reqId);
  }

  /**
   * Get requirement by global ID
   */
  getRequirementByGlobalId(globalId: string): RegulatoryRequirement | undefined {
    const parsed = GlobalId.parse(globalId);
    if (!parsed) return undefined;

    return this.getRequirement(parsed.frameworkId, parsed.requirementId);
  }

  /**
   * Search across all frameworks
   */
  searchAcrossFrameworks(keyword: string): SearchResult[] {
    const searchTerm = keyword.toLowerCase();
    const results: SearchResult[] = [];

    Array.from(this.frameworks.values())
      .flatMap(map => Array.from(map.values()))
      .forEach(req => {
        const matchedFields: string[] = [];
        let relevance = 0;

        // Check title (highest weight)
        if (req.title.toLowerCase().includes(searchTerm)) {
          matchedFields.push('title');
          relevance += 3;
        }

        // Check description
        if (req.description.toLowerCase().includes(searchTerm)) {
          matchedFields.push('description');
          relevance += 2;
        }

        // Check content
        if (req.content.toLowerCase().includes(searchTerm)) {
          matchedFields.push('content');
          relevance += 1;
        }

        // Check category
        if (req.category.toLowerCase().includes(searchTerm)) {
          matchedFields.push('category');
          relevance += 1;
        }

        // Check citation
        if (req.citation.toLowerCase().includes(searchTerm)) {
          matchedFields.push('citation');
          relevance += 2;
        }

        if (relevance > 0) {
          const crossReferences = this.findCrossReferences(req);
          results.push({
            requirement: req,
            relevance,
            matchedFields,
            crossReferences
          });
        }
      });

    // Sort by relevance (highest first)
    return results.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Find cross-references for a requirement
   */
  findCrossReferences(req: RegulatoryRequirement): RegulatoryRequirement[] {
    if (!req.crossReferences) return [];

    return req.crossReferences
      .map(refId => this.getRequirementByGlobalId(refId))
      .filter((r): r is RegulatoryRequirement => r !== undefined);
  }

  /**
   * Find requirements by category across frameworks
   */
  findRequirementsByCategory(category: string): RegulatoryRequirement[] {
    const searchTerm = category.toLowerCase();

    return Array.from(this.frameworks.values())
      .flatMap(map => Array.from(map.values()))
      .filter(req => req.category.toLowerCase().includes(searchTerm));
  }

  /**
   * Find requirements by impact level across frameworks
   */
  findRequirementsByImpact(impact: 'HIGH' | 'MEDIUM' | 'LOW'): RegulatoryRequirement[] {
    return Array.from(this.frameworks.values())
      .flatMap(map => Array.from(map.values()))
      .filter(req => req.impact === impact);
  }

  // 🔗 Cross-Reference Management

  /**
   * Add cross-reference between requirements
   */
  addCrossReference(reference: CrossReference): boolean {
    if (!ConfidenceValidator.validateCrossReference(reference)) {
      console.error(`❌ Cross-reference rejected: confidence too low (${reference.confidence})`);
      return false;
    }

    this.crossReferences.set(reference.sourceId, reference);
    console.log(`✅ Cross-reference added: ${reference.sourceId} → ${reference.targetId} (confidence: ${reference.confidence})`);
    return true;
  }

  /**
   * Get all cross-references
   */
  getAllCrossReferences(): CrossReference[] {
    return Array.from(this.crossReferences.values());
  }

  /**
   * Find cross-references by source requirement
   */
  getCrossReferencesBySource(sourceId: string): CrossReference[] {
    return Array.from(this.crossReferences.values())
      .filter(ref => ref.sourceId === sourceId);
  }

  // 📚 Knowledge Chunk Management

  /**
   * Add knowledge chunks for a requirement
   */
  private addKnowledgeChunksForRequirement(requirementId: string, chunks: { id: string; text: string; embedding?: number[] }[]): void {
    const knowledgeChunks: KnowledgeChunk[] = chunks.map(chunk => ({
      id: chunk.id,
      requirementId,
      content: chunk.text,
      chunkType: 'REQUIREMENT',
      metadata: {
        source: 'Framework Integration',
        section: 'Auto-generated',
        confidence: 0.95, // High confidence for framework data
        language: 'en'
      }
    }));

    this.knowledgeChunks.set(requirementId, knowledgeChunks);
  }

  /**
   * Get knowledge chunks for a requirement
   */
  getKnowledgeChunks(requirementId: string): KnowledgeChunk[] {
    return this.knowledgeChunks.get(requirementId) || [];
  }

  // 📊 Statistics and Health Monitoring

  /**
   * Get comprehensive system statistics
   */
  getStats(): KnowledgeManagerStats {
    const totalRequirements = this.getTotalRequirements();
    const totalCrossReferences = this.crossReferences.size;
    const totalKnowledgeChunks = Array.from(this.knowledgeChunks.values())
      .reduce((sum, chunks) => sum + chunks.length, 0);

    const allRequirements = Array.from(this.frameworks.values())
      .flatMap(map => Array.from(map.values()));

    const confidences = allRequirements.map(req => req.confidence);
    const averageConfidence = confidences.length > 0
      ? confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length
      : 0;

    const lowConfidenceItems = allRequirements.filter(req => req.confidence < 0.9).length;

    return {
      totalFrameworks: this.frameworks.size,
      totalRequirements,
      totalCrossReferences,
      totalKnowledgeChunks,
      averageConfidence,
      lowConfidenceItems,
      validationStatus: lowConfidenceItems === 0 ? 'Valid' : 'Issues Detected'
    };
  }

  /**
   * Validate knowledge base integrity
   */
  validateKnowledgeBase(): {
    valid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for low confidence items
    const stats = this.getStats();
    if (stats.lowConfidenceItems > 0) {
      issues.push(`${stats.lowConfidenceItems} requirements have low confidence (< 0.9)`);
      recommendations.push('Review and update low-confidence requirements');
    }

    // Check for orphaned cross-references
    const orphanedRefs = Array.from(this.crossReferences.values())
      .filter(ref => !this.getRequirementByGlobalId(ref.sourceId) || !this.getRequirementByGlobalId(ref.targetId));

    if (orphanedRefs.length > 0) {
      issues.push(`${orphanedRefs.length} cross-references point to non-existent requirements`);
      recommendations.push('Clean up orphaned cross-references');
    }

    // Check for duplicate requirements
    const allIds = Array.from(this.frameworks.values())
      .flatMap(map => Array.from(map.keys()));
    const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index);

    if (duplicateIds.length > 0) {
      issues.push(`${duplicateIds.length} duplicate requirement IDs detected`);
      recommendations.push('Ensure unique IDs across all frameworks');
    }

    return {
      valid: issues.length === 0,
      issues,
      recommendations
    };
  }

  // 🔧 Utility Methods

  private getTotalRequirements(): number {
    return Array.from(this.frameworks.values())
      .reduce((sum, map) => sum + map.size, 0);
  }

  /**
   * Export framework data for backup/transfer
   */
  exportFramework(frameworkId: string): { requirements: RegulatoryRequirement[]; metadata?: FrameworkMetadata } | null {
    const requirements = this.frameworks.get(frameworkId);
    if (!requirements) return null;

    return {
      requirements: Array.from(requirements.values()),
      metadata: this.frameworkMetadata.get(frameworkId)
    };
  }

  /**
   * Get system health status
   */
  getSystemHealth(): {
    status: 'Healthy' | 'Warning' | 'Critical';
    message: string;
    stats: KnowledgeManagerStats;
  } {
    const stats = this.getStats();
    const validation = this.validateKnowledgeBase();

    if (validation.valid && stats.averageConfidence >= 0.95) {
      return {
        status: 'Healthy',
        message: 'All systems operational with high confidence',
        stats
      };
    } else if (validation.valid && stats.averageConfidence >= 0.9) {
      return {
        status: 'Warning',
        message: 'System operational but confidence could be improved',
        stats
      };
    } else {
      return {
        status: 'Critical',
        message: 'Validation issues detected - review required',
        stats
      };
    }
  }
}
