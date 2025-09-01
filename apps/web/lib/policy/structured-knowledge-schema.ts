// Structured Knowledge Schema for High-Confidence Regulatory AI
// Small Model + Structured Knowledge = High Confidence

export interface RegulatoryFramework {
  id: string;
  name: string;
  version: string;
  jurisdiction: string;
  authority: string;
  lastUpdated: Date;
  confidence: number; // Always 0.9+ for official sources
}

export interface RegulatoryRequirement {
  id: string;
  frameworkId: string;
  title: string;
  description: string;
  citation: string; // Official reference (e.g., "A01:2021", "Article 25")
  content: string; // Actual regulatory text
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  requirements: string[];
  implementation: string[];
  compliance: string[];
  confidence: number; // Always 0.9+ for official sources
  source: string; // Official source document
  sourceUrl?: string; // URL to official source
  checksum?: string; // SHA256 hash for data integrity
  lastUpdated: Date;
}

export interface CrossReference {
  id: string;
  sourceRequirementId: string;
  targetRequirementId: string;
  relationship: 'SIMILAR' | 'COMPLEMENTARY' | 'CONFLICTING' | 'DEPENDENT' | 'EQUIVALENT' | 'SUPERSEDES';
  description: string;
  confidence: number; // Always 0.9+ for validated relationships
  evidence: string; // Why this relationship exists
  lastValidated: Date;
}

export interface KnowledgeChunk {
  id: string;
  frameworkId: string;
  requirementId: string;
  content: string;
  chunkType: 'REQUIREMENT' | 'IMPLEMENTATION' | 'COMPLIANCE' | 'CITATION';
  metadata: {
    source: string;
    page: number;
    section: string;
    confidence: number; // Always 0.9+ for official sources
    language: string; // For internationalization
    vectorEmbedding?: number[]; // For similarity search
  };
}

export interface ConfidenceScore {
  overall: number; // Target: 0.95+
  sourceAuthority: number; // Official source = 1.0
  contentAccuracy: number; // Factual content = 1.0
  crossReference: number; // Multiple sources agree = 1.0
  citationQuality: number; // Proper citations = 1.0
  freshness: number; // How recent the data is
  externalValidation: number; // Cross-checked with other sources
  factors: string[]; // Why this confidence score
  lastCalculated: Date;
}

export interface RegulatoryQuestion {
  id: string;
  question: string;
  intent: 'GENERAL_INFO' | 'COMPLIANCE_REQUIREMENT' | 'POLICY_GENERATION' | 'CROSS_FRAMEWORK';
  relevantFrameworks: string[];
  confidence: number; // Target: 0.95+
  response: string;
  citations: string[];
  lastAsked: Date;
}

export interface PolicyTemplate {
  id: string;
  title: string;
  frameworks: string[];
  requirements: string[];
  implementation: string[];
  compliance: string[];
  confidence: number; // Always 0.95+ for validated policies
  citations: string[];
  lastGenerated: Date;
}

// Enhanced Confidence Validator with Dynamic Scoring
export class ConfidenceValidator {
  static validateRequirement(requirement: RegulatoryRequirement): boolean {
    return requirement.confidence >= 0.9;
  }

  static validateCrossReference(reference: CrossReference): boolean {
    return reference.confidence >= 0.9;
  }

  static validateResponse(question: RegulatoryQuestion): boolean {
    return question.confidence >= 0.95;
  }

  static validatePolicy(policy: PolicyTemplate): boolean {
    return policy.confidence >= 0.95;
  }

  // Never allow low-confidence outputs
  static enforceHighConfidence<T extends { confidence: number }>(item: T): T | null {
    if (item.confidence < 0.9) {
      console.warn(`Low confidence item rejected: ${item.confidence}`);
      return null;
    }
    return item;
  }

  // Dynamic confidence calculation based on multiple factors
  static calculateDynamicConfidence(
    sourceAuthority: number,
    crossReferenceCount: number,
    freshness: number,
    externalValidation: number
  ): number {
    let confidence = sourceAuthority; // Base confidence from source authority

    // Boost confidence based on cross-references
    if (crossReferenceCount >= 3) confidence += 0.1;
    else if (crossReferenceCount >= 1) confidence += 0.05;

    // Boost confidence based on freshness (newer = higher confidence)
    const daysSinceUpdate = (Date.now() - freshness) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 30) confidence += 0.05; // Very recent
    else if (daysSinceUpdate < 90) confidence += 0.02; // Recent
    else if (daysSinceUpdate > 365) confidence -= 0.05; // Outdated

    // Boost confidence based on external validation
    confidence += externalValidation * 0.1;

    // Clamp between 0 and 1, but allow for slight overflow to test edge cases
    return Math.min(Math.max(confidence, 0.0), 1.0);
  }
}

// Enhanced Knowledge Base Management with Cross-References and Chunks
export class StructuredKnowledgeBase {
  private frameworks: Map<string, RegulatoryFramework> = new Map();
  private requirements: Map<string, RegulatoryRequirement> = new Map();
  private crossReferences: Map<string, CrossReference> = new Map();
  private knowledgeChunks: Map<string, KnowledgeChunk[]> = new Map();

  constructor() {
    this.initializeDefaultFrameworks();
  }

  private initializeDefaultFrameworks(): void {
    // OWASP Top 10 2021 - High Confidence (Official Source)
    this.frameworks.set('owasp-top10-2021', {
      id: 'owasp-top10-2021',
      name: 'OWASP Top 10 Web Application Security Risks',
      version: '2021',
      jurisdiction: 'Global',
      authority: 'OWASP Foundation',
      lastUpdated: new Date('2021-01-01'),
      confidence: 1.0 // Official source
    });

    // GDPR - High Confidence (Official Source)
    this.frameworks.set('gdpr-2018', {
      id: 'gdpr-2018',
      name: 'General Data Protection Regulation',
      version: '2018',
      jurisdiction: 'European Union',
      authority: 'European Commission',
      lastUpdated: new Date('2018-05-25'),
      confidence: 1.0 // Official source
    });

    // NIS2 - High Confidence (Official Source)
    this.frameworks.set('nis2-2023', {
      id: 'nis2-2023',
      name: 'Network and Information Security 2',
      version: '2023',
      jurisdiction: 'European Union',
      authority: 'European Commission',
      lastUpdated: new Date('2023-01-16'),
      confidence: 1.0 // Official source
    });

    console.log('✅ Default frameworks initialized with high confidence');
  }

  // Add new framework with confidence validation
  addFramework(framework: RegulatoryFramework): boolean {
    if (framework.confidence < 0.9) {
      console.error(`❌ Framework rejected: confidence too low (${framework.confidence})`);
      return false;
    }

    this.frameworks.set(framework.id, framework);
    console.log(`✅ Framework added: ${framework.name} (confidence: ${framework.confidence})`);
    return true;
  }

  // Add new requirement with confidence validation
  addRequirement(requirement: RegulatoryRequirement): boolean {
    if (!ConfidenceValidator.validateRequirement(requirement)) {
      console.error(`❌ Requirement rejected: confidence too low (${requirement.confidence})`);
      return false;
    }

    this.requirements.set(requirement.id, requirement);
    console.log(`✅ Requirement added: ${requirement.title} (confidence: ${requirement.confidence})`);
    return true;
  }

  // Enhanced: Add cross-reference with confidence validation
  addCrossReference(reference: CrossReference): boolean {
    if (!ConfidenceValidator.validateCrossReference(reference)) {
      console.error(`❌ Cross-reference rejected: confidence too low (${reference.confidence})`);
      return false;
    }

    this.crossReferences.set(reference.id, reference);
    console.log(`✅ Cross-reference added: ${reference.sourceRequirementId} → ${reference.targetRequirementId} (confidence: ${reference.confidence})`);
    return true;
  }

  // Enhanced: Add knowledge chunk with confidence validation
  addKnowledgeChunk(chunk: KnowledgeChunk): boolean {
    if (chunk.metadata.confidence < 0.9) {
      console.error(`❌ Knowledge chunk rejected: confidence too low (${chunk.metadata.confidence})`);
      return false;
    }

    const chunks = this.knowledgeChunks.get(chunk.frameworkId) || [];
    chunks.push(chunk);
    this.knowledgeChunks.set(chunk.frameworkId, chunks);
    
    console.log(`✅ Knowledge chunk added: ${chunk.id} for framework ${chunk.frameworkId} (confidence: ${chunk.metadata.confidence})`);
    return true;
  }

  // Get framework by ID
  getFramework(id: string): RegulatoryFramework | undefined {
    return this.frameworks.get(id);
  }

  // Get requirement by ID
  getRequirement(id: string): RegulatoryRequirement | undefined {
    return this.requirements.get(id);
  }

  // Enhanced: Get cross-references by requirement ID
  getCrossReferencesByRequirementId(requirementId: string): CrossReference[] {
    return Array.from(this.crossReferences.values())
      .filter(ref => ref.sourceRequirementId === requirementId || ref.targetRequirementId === requirementId);
  }

  // Enhanced: Get all cross-references
  getAllCrossReferences(): CrossReference[] {
    return Array.from(this.crossReferences.values());
  }

  // Enhanced: Get knowledge chunks by framework
  getKnowledgeChunksByFramework(frameworkId: string): KnowledgeChunk[] {
    return this.knowledgeChunks.get(frameworkId) || [];
  }

  // Enhanced: Get all knowledge chunks
  getAllKnowledgeChunks(): KnowledgeChunk[] {
    const allChunks: KnowledgeChunk[] = [];
    this.knowledgeChunks.forEach(chunks => allChunks.push(...chunks));
    return allChunks;
  }

  // Get all frameworks
  getAllFrameworks(): RegulatoryFramework[] {
    return Array.from(this.frameworks.values());
  }

  // Get all requirements
  getAllRequirements(): RegulatoryRequirement[] {
    return Array.from(this.requirements.values());
  }

  // Get requirements by framework
  getRequirementsByFramework(frameworkId: string): RegulatoryRequirement[] {
    return Array.from(this.requirements.values())
      .filter(req => req.frameworkId === frameworkId)
      .filter(req => ConfidenceValidator.validateRequirement(req));
  }

  // Enhanced: Validate knowledge base integrity with cross-references
  validateKnowledgeBase(): {
    valid: boolean;
    frameworks: number;
    requirements: number;
    crossReferences: number;
    knowledgeChunks: number;
    lowConfidenceItems: number;
  } {
    const frameworks = this.getAllFrameworks();
    const requirements = this.getAllRequirements();
    const crossReferences = this.getAllCrossReferences();
    const knowledgeChunks = this.getAllKnowledgeChunks();
    
    const lowConfidenceFrameworks = frameworks.filter(f => f.confidence < 0.9).length;
    const lowConfidenceRequirements = requirements.filter(r => r.confidence < 0.9).length;
    const lowConfidenceCrossReferences = crossReferences.filter(r => r.confidence < 0.9).length;
    const lowConfidenceChunks = knowledgeChunks.filter(c => c.metadata.confidence < 0.9).length;

    const valid = lowConfidenceFrameworks === 0 && 
                  lowConfidenceRequirements === 0 && 
                  lowConfidenceCrossReferences === 0 && 
                  lowConfidenceChunks === 0;

    return {
      valid,
      frameworks: frameworks.length,
      requirements: requirements.length,
      crossReferences: crossReferences.length,
      knowledgeChunks: knowledgeChunks.length,
      lowConfidenceItems: lowConfidenceFrameworks + lowConfidenceRequirements + lowConfidenceCrossReferences + lowConfidenceChunks
    };
  }

  // Enhanced: Get confidence statistics across all data types
  getConfidenceStats(): {
    frameworks: { average: number; min: number; max: number };
    requirements: { average: number; min: number; max: number };
    crossReferences: { average: number; min: number; max: number };
    knowledgeChunks: { average: number; min: number; max: number };
    overall: { average: number; min: number; max: number };
  } {
    const frameworks = this.getAllFrameworks();
    const requirements = this.getAllRequirements();
    const crossReferences = this.getAllCrossReferences();
    const knowledgeChunks = this.getAllKnowledgeChunks();

    const calculateStats = (items: Array<{ confidence: number }>) => {
      if (items.length === 0) return { average: 0, min: 0, max: 0 };
      const confidences = items.map(item => item.confidence);
      return {
        average: confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length,
        min: Math.min(...confidences),
        max: Math.max(...confidences)
      };
    };

    const overallItems = [
      ...frameworks.map(f => ({ confidence: f.confidence })),
      ...requirements.map(r => ({ confidence: r.confidence })),
      ...crossReferences.map(c => ({ confidence: c.confidence })),
      ...knowledgeChunks.map(k => ({ confidence: k.metadata.confidence }))
    ];

    return {
      frameworks: calculateStats(frameworks),
      requirements: calculateStats(requirements),
      crossReferences: calculateStats(crossReferences),
      knowledgeChunks: calculateStats(knowledgeChunks.map(k => ({ confidence: k.metadata.confidence }))),
      overall: calculateStats(overallItems)
    };
  }

  // Get system status for health monitoring
  getSystemStatus(): {
    confidenceThreshold: number;
    knowledgeBaseStatus: string;
    frameworksAvailable: string[];
    averageConfidence: number;
  } {
    const stats = this.getConfidenceStats();
    const validation = this.validateKnowledgeBase();
    
    return {
      confidenceThreshold: 0.9,
      knowledgeBaseStatus: validation.valid ? 'High-Confidence Ready' : 'Validation Issues Detected',
      frameworksAvailable: this.getAllFrameworks().map(f => f.id),
      averageConfidence: stats.overall.average
    };
  }
}
