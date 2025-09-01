// Test Suite for Enhanced Structured Knowledge Schema
// Validates all quality gates and enhancements

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  StructuredKnowledgeBase, 
  ConfidenceValidator,
  RegulatoryFramework,
  RegulatoryRequirement,
  CrossReference,
  KnowledgeChunk
} from '../policy/structured-knowledge-schema';

describe('Enhanced Structured Knowledge Schema', () => {
  let knowledgeBase: StructuredKnowledgeBase;

  beforeEach(() => {
    knowledgeBase = new StructuredKnowledgeBase();
  });

  describe('Confidence Validation Quality Gates', () => {
    it('should reject frameworks with confidence below 0.9', () => {
      const lowConfidenceFramework: RegulatoryFramework = {
        id: 'test-framework',
        name: 'Test Framework',
        version: '1.0',
        jurisdiction: 'Test',
        authority: 'Test Authority',
        lastUpdated: new Date(),
        confidence: 0.8 // Below threshold
      };

      const result = knowledgeBase.addFramework(lowConfidenceFramework);
      expect(result).toBe(false);
    });

    it('should accept frameworks with confidence 0.9 or above', () => {
      const highConfidenceFramework: RegulatoryFramework = {
        id: 'test-framework',
        name: 'Test Framework',
        version: '1.0',
        jurisdiction: 'Test',
        authority: 'Test Authority',
        lastUpdated: new Date(),
        confidence: 0.95 // Above threshold
      };

      const result = knowledgeBase.addFramework(highConfidenceFramework);
      expect(result).toBe(true);
    });

    it('should reject requirements with confidence below 0.9', () => {
      const lowConfidenceRequirement: RegulatoryRequirement = {
        id: 'test-req',
        frameworkId: 'owasp-top10-2021',
        title: 'Test Requirement',
        description: 'Test description',
        citation: 'TEST-001',
        content: 'Test content',
        impact: 'HIGH',
        category: 'Test',
        requirements: ['Test requirement'],
        implementation: ['Test implementation'],
        compliance: ['Test compliance'],
        confidence: 0.85, // Below threshold
        source: 'Test Source',
        lastUpdated: new Date()
      };

      const result = knowledgeBase.addRequirement(lowConfidenceRequirement);
      expect(result).toBe(false);
    });

    it('should accept requirements with confidence 0.9 or above', () => {
      const highConfidenceRequirement: RegulatoryRequirement = {
        id: 'test-req',
        frameworkId: 'owasp-top10-2021',
        title: 'Test Requirement',
        description: 'Test description',
        citation: 'TEST-001',
        content: 'Test content',
        impact: 'HIGH',
        category: 'Test',
        requirements: ['Test requirement'],
        implementation: ['Test implementation'],
        compliance: ['Test compliance'],
        confidence: 0.95, // Above threshold
        source: 'Test Source',
        lastUpdated: new Date()
      };

      const result = knowledgeBase.addRequirement(highConfidenceRequirement);
      expect(result).toBe(true);
    });
  });

  describe('Cross-Reference Management', () => {
    it('should add cross-references with confidence validation', () => {
      const crossReference: CrossReference = {
        id: 'test-ref',
        sourceRequirementId: 'owasp-a01-2021',
        targetRequirementId: 'gdpr-art32',
        relationship: 'COMPLEMENTARY',
        description: 'OWASP A01 complements GDPR Article 32',
        confidence: 0.95, // Above threshold
        evidence: 'Both address access control requirements',
        lastValidated: new Date()
      };

      const result = knowledgeBase.addCrossReference(crossReference);
      expect(result).toBe(true);
    });

    it('should reject cross-references with low confidence', () => {
      const lowConfidenceRef: CrossReference = {
        id: 'test-ref',
        sourceRequirementId: 'owasp-a01-2021',
        targetRequirementId: 'gdpr-art32',
        relationship: 'COMPLEMENTARY',
        description: 'OWASP A01 complements GDPR Article 32',
        confidence: 0.85, // Below threshold
        evidence: 'Both address access control requirements',
        lastValidated: new Date()
      };

      const result = knowledgeBase.addCrossReference(lowConfidenceRef);
      expect(result).toBe(false);
    });

    it('should retrieve cross-references by requirement ID', () => {
      const crossReference: CrossReference = {
        id: 'test-ref',
        sourceRequirementId: 'owasp-a01-2021',
        targetRequirementId: 'gdpr-art32',
        relationship: 'COMPLEMENTARY',
        description: 'OWASP A01 complements GDPR Article 32',
        confidence: 0.95,
        evidence: 'Both address access control requirements',
        lastValidated: new Date()
      };

      knowledgeBase.addCrossReference(crossReference);
      const refs = knowledgeBase.getCrossReferencesByRequirementId('owasp-a01-2021');
      expect(refs).toHaveLength(1);
      expect(refs[0].id).toBe('test-ref');
    });
  });

  describe('Knowledge Chunk Management', () => {
    it('should add knowledge chunks with confidence validation', () => {
      const knowledgeChunk: KnowledgeChunk = {
        id: 'test-chunk',
        frameworkId: 'owasp-top10-2021',
        requirementId: 'owasp-a01-2021',
        content: 'Test chunk content',
        chunkType: 'REQUIREMENT',
        metadata: {
          source: 'Test Source',
          page: 1,
          section: 'Test Section',
          confidence: 0.95, // Above threshold
          language: 'en'
        }
      };

      const result = knowledgeBase.addKnowledgeChunk(knowledgeChunk);
      expect(result).toBe(true);
    });

    it('should reject knowledge chunks with low confidence', () => {
      const lowConfidenceChunk: KnowledgeChunk = {
        id: 'test-chunk',
        frameworkId: 'owasp-top10-2021',
        requirementId: 'owasp-a01-2021',
        content: 'Test chunk content',
        chunkType: 'REQUIREMENT',
        metadata: {
          source: 'Test Source',
          page: 1,
          section: 'Test Section',
          confidence: 0.85, // Below threshold
          language: 'en'
        }
      };

      const result = knowledgeBase.addKnowledgeChunk(lowConfidenceChunk);
      expect(result).toBe(false);
    });

    it('should retrieve knowledge chunks by framework', () => {
      const knowledgeChunk: KnowledgeChunk = {
        id: 'test-chunk',
        frameworkId: 'owasp-top10-2021',
        requirementId: 'owasp-a01-2021',
        content: 'Test chunk content',
        chunkType: 'REQUIREMENT',
        metadata: {
          source: 'Test Source',
          page: 1,
          section: 'Test Section',
          confidence: 0.95,
          language: 'en'
        }
      };

      knowledgeBase.addKnowledgeChunk(knowledgeChunk);
      const chunks = knowledgeBase.getKnowledgeChunksByFramework('owasp-top10-2021');
      expect(chunks).toHaveLength(1);
      expect(chunks[0].id).toBe('test-chunk');
    });
  });

  describe('Enhanced Knowledge Base Validation', () => {
    it('should validate knowledge base integrity with all data types', () => {
      const validation = knowledgeBase.validateKnowledgeBase();
      
      expect(validation).toHaveProperty('frameworks');
      expect(validation).toHaveProperty('requirements');
      expect(validation).toHaveProperty('crossReferences');
      expect(validation).toHaveProperty('knowledgeChunks');
      expect(validation).toHaveProperty('lowConfidenceItems');
      expect(validation).toHaveProperty('valid');
    });

    it('should return valid status when all items have high confidence', () => {
      const validation = knowledgeBase.validateKnowledgeBase();
      expect(validation.valid).toBe(true);
      expect(validation.lowConfidenceItems).toBe(0);
    });

    it('should count all data types correctly', () => {
      const validation = knowledgeBase.validateKnowledgeBase();
      
      // Should have default frameworks
      expect(validation.frameworks).toBeGreaterThan(0);
      
      // Initially no requirements, cross-references, or chunks
      expect(validation.requirements).toBe(0);
      expect(validation.crossReferences).toBe(0);
      expect(validation.knowledgeChunks).toBe(0);
    });
  });

  describe('Enhanced Confidence Statistics', () => {
    it('should provide confidence statistics across all data types', () => {
      const stats = knowledgeBase.getConfidenceStats();
      
      expect(stats).toHaveProperty('frameworks');
      expect(stats).toHaveProperty('requirements');
      expect(stats).toHaveProperty('crossReferences');
      expect(stats).toHaveProperty('knowledgeChunks');
      expect(stats).toHaveProperty('overall');
    });

    it('should calculate confidence statistics for frameworks correctly', () => {
      const stats = knowledgeBase.getConfidenceStats();
      
      // Default frameworks should all have 1.0 confidence
      expect(stats.frameworks.average).toBe(1.0);
      expect(stats.frameworks.min).toBe(1.0);
      expect(stats.frameworks.max).toBe(1.0);
    });

    it('should handle empty data types gracefully', () => {
      const stats = knowledgeBase.getConfidenceStats();
      
      // Initially no requirements, cross-references, or chunks
      expect(stats.requirements.average).toBe(0);
      expect(stats.crossReferences.average).toBe(0);
      expect(stats.knowledgeChunks.average).toBe(0);
    });
  });

  describe('Dynamic Confidence Calculation', () => {
    it('should calculate dynamic confidence based on multiple factors', () => {
      const confidence = ConfidenceValidator.calculateDynamicConfidence(
        0.9,  // sourceAuthority
        2,    // crossReferenceCount
        Date.now(), // freshness (current)
        0.8   // externalValidation
      );

      expect(confidence).toBeGreaterThan(0.9);
      expect(confidence).toBeLessThanOrEqual(1.0);
    });

    it('should boost confidence for multiple cross-references', () => {
      const confidence1 = ConfidenceValidator.calculateDynamicConfidence(0.9, 1, Date.now(), 0.8);
      const confidence3 = ConfidenceValidator.calculateDynamicConfidence(0.9, 3, Date.now(), 0.8);
      
      // Both should be boosted, but may be clamped to 1.0
      expect(confidence3).toBeGreaterThanOrEqual(confidence1);
      expect(confidence3).toBeGreaterThanOrEqual(0.95);
    });

    it('should boost confidence for recent updates', () => {
      const recent = Date.now();
      const old = Date.now() - (365 * 24 * 60 * 60 * 1000); // 1 year ago
      
      const confidenceRecent = ConfidenceValidator.calculateDynamicConfidence(0.9, 1, recent, 0.8);
      const confidenceOld = ConfidenceValidator.calculateDynamicConfidence(0.9, 1, old, 0.8);
      
      // Recent should be higher or equal (may be clamped)
      expect(confidenceRecent).toBeGreaterThanOrEqual(confidenceOld);
      expect(confidenceRecent).toBeGreaterThanOrEqual(0.95);
    });

    it('should clamp confidence between 0 and 1', () => {
      const veryHigh = ConfidenceValidator.calculateDynamicConfidence(1.0, 10, Date.now(), 1.0);
      const veryLow = ConfidenceValidator.calculateDynamicConfidence(0.1, 0, Date.now() - (1000 * 24 * 60 * 60 * 1000), 0.0);
      
      expect(veryHigh).toBeLessThanOrEqual(1.0);
      expect(veryLow).toBeGreaterThanOrEqual(0.0);
    });
  });

  describe('System Health and Status', () => {
    it('should provide comprehensive system status', () => {
      const status = knowledgeBase.getSystemStatus();
      
      expect(status).toHaveProperty('confidenceThreshold');
      expect(status).toHaveProperty('knowledgeBaseStatus');
      expect(status).toHaveProperty('frameworksAvailable');
      expect(status).toHaveProperty('averageConfidence');
    });

    it('should maintain high confidence across all operations', () => {
      const status = knowledgeBase.getSystemStatus();
      expect(status.averageConfidence).toBeGreaterThanOrEqual(0.9);
    });
  });
});
