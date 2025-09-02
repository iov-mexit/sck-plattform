// Cross-Framework Mapping System
// Maps relationships between different regulatory frameworks
// Enables cross-framework compliance analysis

import { CrossReference, RegulatoryRequirement, ConfidenceValidator } from './structured-knowledge-schema';

export interface FrameworkMapping {
  sourceFramework: string;
  targetFramework: string;
  relationship: 'EQUIVALENT' | 'COMPLEMENTARY' | 'SUPERSEDES' | 'SIMILAR';
  confidence: number;
  evidence: string;
  requirements: string[];
}

export interface CrossFrameworkAnalysis {
  sourceFramework: string;
  targetFramework: string;
  mappedRequirements: CrossReference[];
  coverage: number; // Percentage of requirements mapped
  confidence: number; // Overall confidence of mapping
  gaps: string[]; // Unmapped requirements
}

export class CrossFrameworkMapper {
  private mappings: Map<string, CrossReference> = new Map();
  private frameworkRelationships: Map<string, FrameworkMapping[]> = new Map();

  constructor() {
    this.initializeDefaultMappings();
  }

  private initializeDefaultMappings(): void {
    // OWASP Top 10 → GDPR Article 32 mapping
    this.addFrameworkMapping({
      sourceFramework: 'owasp-top10-2021',
      targetFramework: 'gdpr-2018',
      relationship: 'COMPLEMENTARY',
      confidence: 0.95,
      evidence: 'OWASP provides technical implementation guidance for GDPR security requirements',
      requirements: ['A01:2021', 'A02:2021', 'A03:2021', 'Article 32']
    });

    // OWASP Top 10 → NIS2 mapping
    this.addFrameworkMapping({
      sourceFramework: 'owasp-top10-2021',
      targetFramework: 'nis2-2023',
      relationship: 'COMPLEMENTARY',
      confidence: 0.95,
      evidence: 'OWASP addresses technical security controls required by NIS2',
      requirements: ['A01:2021', 'A02:2021', 'A03:2021', 'Incident Response']
    });

    // GDPR → NIS2 mapping
    this.addFrameworkMapping({
      sourceFramework: 'gdpr-2018',
      targetFramework: 'nis2-2023',
      relationship: 'COMPLEMENTARY',
      confidence: 0.95,
      evidence: 'Both EU directives with overlapping security and incident response requirements',
      requirements: ['Article 32', 'Article 33', 'Incident Response']
    });

    console.log('✅ Default cross-framework mappings initialized');
  }

  // Add framework mapping
  addFrameworkMapping(mapping: FrameworkMapping): boolean {
    if (mapping.confidence < 0.9) {
      console.error(`❌ Framework mapping rejected: confidence too low (${mapping.confidence})`);
      return false;
    }

    const key = `${mapping.sourceFramework}-${mapping.targetFramework}`;
    const existing = this.frameworkRelationships.get(key) || [];
    existing.push(mapping);
    this.frameworkRelationships.set(key, existing);

    console.log(`✅ Framework mapping added: ${mapping.sourceFramework} → ${mapping.targetFramework} (confidence: ${mapping.confidence})`);
    return true;
  }

  // Add cross-reference between specific requirements
  addCrossReference(reference: CrossReference): boolean {
    if (!ConfidenceValidator.validateCrossReference(reference)) {
      console.error(`❌ Cross-reference rejected: confidence too low (${reference.confidence})`);
      return false;
    }

    this.mappings.set(reference.id, reference);
    console.log(`✅ Cross-reference added: ${reference.sourceRequirementId} → ${reference.targetRequirementId} (confidence: ${reference.confidence})`);
    return true;
  }

  // Analyze cross-framework relationships
  analyzeCrossFramework(sourceFramework: string, targetFramework: string): CrossFrameworkAnalysis {
    const key = `${sourceFramework}-${targetFramework}`;
    const mappings = this.frameworkRelationships.get(key) || [];
    
    // Get cross-references between specific requirements
    const crossReferences = Array.from(this.mappings.values())
      .filter(ref => {
        const sourceReq = this.getRequirementById(ref.sourceRequirementId);
        const targetReq = this.getRequirementById(ref.targetRequirementId);
        return sourceReq?.frameworkId === sourceFramework && targetReq?.frameworkId === targetFramework;
      });

    // Calculate coverage and confidence
    const totalSourceRequirements = this.getTotalRequirements(sourceFramework);
    const mappedRequirements = crossReferences.length;
    const coverage = totalSourceRequirements > 0 ? (mappedRequirements / totalSourceRequirements) * 100 : 0;
    
    const confidence = mappings.length > 0 
      ? mappings.reduce((sum, m) => sum + m.confidence, 0) / mappings.length 
      : 0;

    // Identify gaps
    const gaps = this.identifyGaps(sourceFramework, targetFramework, crossReferences);

    return {
      sourceFramework,
      targetFramework,
      mappedRequirements: crossReferences,
      coverage,
      confidence,
      gaps
    };
  }

  // Get all cross-framework analyses
  getAllCrossFrameworkAnalyses(): CrossFrameworkAnalysis[] {
    const analyses: CrossFrameworkAnalysis[] = [];
    const processed = new Set<string>();

    this.frameworkRelationships.forEach((mappings, key) => {
      if (!processed.has(key)) {
        const [source, target] = key.split('-');
        analyses.push(this.analyzeCrossFramework(source, target));
        processed.add(key);
      }
    });

    return analyses;
  }

  // Find equivalent requirements across frameworks
  findEquivalentRequirements(requirementId: string): CrossReference[] {
    return Array.from(this.mappings.values())
      .filter(ref => 
        ref.sourceRequirementId === requirementId || ref.targetRequirementId === requirementId
      )
      .filter(ref => ref.relationship === 'EQUIVALENT');
  }

  // Find complementary requirements across frameworks
  findComplementaryRequirements(requirementId: string): CrossReference[] {
    return Array.from(this.mappings.values())
      .filter(ref => 
        ref.sourceRequirementId === requirementId || ref.targetRequirementId === requirementId
      )
      .filter(ref => ref.relationship === 'COMPLEMENTARY');
  }

  // Get framework relationships
  getFrameworkRelationships(frameworkId: string): FrameworkMapping[] {
    const relationships: FrameworkMapping[] = [];
    
    this.frameworkRelationships.forEach((mappings, key) => {
      if (key.startsWith(frameworkId + '-') || key.endsWith('-' + frameworkId)) {
        relationships.push(...mappings);
      }
    });

    return relationships;
  }

  // Validate all mappings
  validateMappings(): {
    valid: boolean;
    totalMappings: number;
    highConfidenceMappings: number;
    lowConfidenceMappings: number;
    issues: string[];
  } {
    const allMappings = Array.from(this.mappings.values());
    const highConfidence = allMappings.filter(m => m.confidence >= 0.9).length;
    const lowConfidence = allMappings.filter(m => m.confidence < 0.9).length;

    const issues: string[] = [];
    if (lowConfidence > 0) {
      issues.push(`${lowConfidence} mappings have low confidence (< 0.9)`);
    }

    // Check for circular references
    const circularRefs = this.detectCircularReferences();
    if (circularRefs.length > 0) {
      issues.push(`Circular references detected: ${circularRefs.join(', ')}`);
    }

    return {
      valid: lowConfidence === 0 && circularRefs.length === 0,
      totalMappings: allMappings.length,
      highConfidenceMappings: highConfidence,
      lowConfidenceMappings: lowConfidence,
      issues
    };
  }

  // Private helper methods
  private getRequirementById(id: string): RegulatoryRequirement | undefined {
    // This would be implemented to fetch from the knowledge base
    // For now, return undefined
    return undefined;
  }

  private getTotalRequirements(frameworkId: string): number {
    // This would be implemented to count requirements in the knowledge base
    // For now, return a default value
    return 10;
  }

  private identifyGaps(sourceFramework: string, targetFramework: string, crossReferences: CrossReference[]): string[] {
    // This would analyze which requirements are not mapped
    // For now, return empty array
    return [];
  }

  private detectCircularReferences(): string[] {
    // This would detect circular reference chains
    // For now, return empty array
    return [];
  }

  // Get system status
  getSystemStatus(): {
    totalMappings: number;
    frameworkRelationships: number;
    averageConfidence: number;
    validationStatus: string;
  } {
    const mappings = Array.from(this.mappings.values());
    const relationships = Array.from(this.frameworkRelationships.values()).flat();
    
    const avgConfidence = mappings.length > 0 
      ? mappings.reduce((sum, m) => sum + m.confidence, 0) / mappings.length 
      : 0;

    const validation = this.validateMappings();

    return {
      totalMappings: mappings.length,
      frameworkRelationships: relationships.length,
      averageConfidence: avgConfidence,
      validationStatus: validation.valid ? 'Valid' : `Issues: ${validation.issues.join(', ')}`
    };
  }
}

