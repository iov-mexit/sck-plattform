// Regulatory Core - Universal Primitives for Multi-Framework Compliance
// Framework-agnostic design for plug-and-play regulation integration

export interface RegulatoryRequirement {
  id: string;               // unique within its framework
  frameworkId: string;      // e.g. "owasp-top10-2021", "gdpr-2016", "nis2-2023"
  title: string;
  description: string;
  citation: string;         // e.g. "A01:2021", "GDPR Article 32"
  content: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;         // framework-specific category
  requirements: string[];
  implementation: string[];
  compliance: string[];
  confidence: number;       // 0.0–1.0
  source: string;           // official source reference
  sourceUrl?: string;       // canonical regulation link
  lastUpdated: Date;

  crossReferences?: string[];  // IDs in other frameworks
  knowledgeChunks?: { id: string; text: string; embedding?: number[] }[];
  checksum?: string;           // integrity proof
}

export interface FrameworkMetadata {
  id: string;
  name: string;
  version: string;
  jurisdiction: string;
  authority: string;
  effectiveDate: Date;
  lastUpdated: Date;
  confidence: number;       // Always 0.9+ for official sources
  sourceUrl: string;
  checksum: string;         // SHA256 of official source
}

export interface CrossReference {
  sourceId: string;         // Global ID (frameworkId:requirementId)
  targetId: string;         // Global ID (frameworkId:requirementId)
  relationship: 'EQUIVALENT' | 'COMPLEMENTARY' | 'SUPERSEDES' | 'SIMILAR' | 'DEPENDENT';
  confidence: number;       // 0.9+ for validated relationships
  evidence: string;         // Why this relationship exists
  lastValidated: Date;
}

export interface KnowledgeChunk {
  id: string;
  requirementId: string;    // Global ID
  content: string;
  chunkType: 'REQUIREMENT' | 'IMPLEMENTATION' | 'COMPLIANCE' | 'CITATION';
  metadata: {
    source: string;
    page?: number;
    section: string;
    confidence: number;     // Always 0.9+ for official sources
    language: string;       // For internationalization
    embedding?: number[];   // Vector embedding for semantic search
  };
}

// High-Confidence Validation
export class ConfidenceValidator {
  static validateRequirement(requirement: RegulatoryRequirement): boolean {
    return requirement.confidence >= 0.9;
  }

  static validateCrossReference(reference: CrossReference): boolean {
    return reference.confidence >= 0.9;
  }

  static validateKnowledgeChunk(chunk: KnowledgeChunk): boolean {
    return chunk.metadata.confidence >= 0.9;
  }

  // Never allow low-confidence outputs
  static enforceHighConfidence<T extends { confidence: number }>(item: T): T | null {
    if (item.confidence < 0.9) {
      console.warn(`Low confidence item rejected: ${item.confidence}`);
      return null;
    }
    return null;
  }

  // Dynamic confidence calculation
  static calculateDynamicConfidence(
    sourceAuthority: number,
    crossReferenceCount: number,
    freshness: number,
    externalValidation: number
  ): number {
    let confidence = sourceAuthority;

    // Boost confidence based on cross-references
    if (crossReferenceCount >= 3) confidence += 0.1;
    else if (crossReferenceCount >= 1) confidence += 0.05;

    // Boost confidence based on freshness
    const daysSinceUpdate = (Date.now() - freshness) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate < 30) confidence += 0.05;
    else if (daysSinceUpdate < 90) confidence += 0.02;
    else if (daysSinceUpdate > 365) confidence -= 0.05;

    // Boost confidence based on external validation
    confidence += externalValidation * 0.1;

    return Math.min(Math.max(confidence, 0.0), 1.0);
  }
}

// Global ID utilities
export class GlobalId {
  static create(frameworkId: string, requirementId: string): string {
    return `${frameworkId}:${requirementId}`;
  }

  static parse(globalId: string): { frameworkId: string; requirementId: string } | null {
    const parts = globalId.split(':');
    if (parts.length !== 2) return null;
    return { frameworkId: parts[0], requirementId: parts[1] };
  }

  static isValid(globalId: string): boolean {
    return GlobalId.parse(globalId) !== null;
  }
}
