// Test Suite for New Plug-and-Play Knowledge Manager Architecture
// Validates the framework-agnostic design and multi-framework capabilities

import { describe, it, expect, beforeEach } from 'vitest';
import { KnowledgeManager } from '../policy/knowledge-manager';
import { OWASP_TOP_10_2021, OWASP_TOP_10_2021_METADATA } from '../policy/datasets/owasp-top10-2021';
import { FrameworkMetadata } from '../policy/regulatory-core';

describe('Plug-and-Play Knowledge Manager Architecture', () => {
  let knowledgeManager: KnowledgeManager;

  beforeEach(() => {
    knowledgeManager = new KnowledgeManager();
  });

  describe('🏗️ Framework Management - Plug-and-Play Architecture', () => {
    it('should add OWASP framework with zero code changes', () => {
      // This is the key test - adding a framework without modifying the manager
      knowledgeManager.addFramework('owasp-top10-2021', OWASP_TOP_10_2021);

      const frameworks = knowledgeManager.getFrameworks();
      expect(frameworks).toContain('owasp-top10-2021');
      expect(frameworks).toHaveLength(1);
    });

    it('should add framework metadata separately', () => {
      const metadata: FrameworkMetadata = {
        id: 'owasp-top10-2021',
        name: 'OWASP Top 10 Web Application Security Risks',
        version: '2021',
        jurisdiction: 'Global',
        authority: 'OWASP Foundation',
        effectiveDate: new Date('2021-01-01'),
        lastUpdated: new Date('2021-01-01'),
        confidence: 1.0,
        sourceUrl: 'https://owasp.org/Top10/',
        checksum: 'sha256:owasp-top10-2021-official-documentation'
      };

      const result = knowledgeManager.addFrameworkMetadata(metadata);
      expect(result).toBe(true);

      const retrievedMetadata = knowledgeManager.getFrameworkMetadata('owasp-top10-2021');
      expect(retrievedMetadata).toEqual(metadata);
    });

    it('should reject low-confidence framework metadata', () => {
      const lowConfidenceMetadata: FrameworkMetadata = {
        id: 'test-framework',
        name: 'Test Framework',
        version: '1.0',
        jurisdiction: 'Test',
        authority: 'Test Authority',
        effectiveDate: new Date(),
        lastUpdated: new Date(),
        confidence: 0.8, // Below threshold
        sourceUrl: 'https://test.com',
        checksum: 'sha256:test'
      };

      const result = knowledgeManager.addFrameworkMetadata(lowConfidenceMetadata);
      expect(result).toBe(false);
    });

    it('should handle multiple frameworks independently', () => {
      // Add OWASP
      knowledgeManager.addFramework('owasp-top10-2021', OWASP_TOP_10_2021);

      // Add a mock GDPR framework (simulating future addition)
      const mockGDPR = [
        {
          id: 'gdpr-art32',
          frameworkId: 'gdpr-2016',
          title: 'Article 32 - Security of Processing',
          description: 'GDPR security requirements',
          citation: 'Article 32',
          content: 'Security of processing content',
          impact: 'HIGH' as const,
          category: 'Data Protection',
          requirements: ['Implement appropriate security measures'],
          implementation: ['Use encryption and pseudonymization'],
          compliance: ['Regular security assessments'],
          confidence: 1.0,
          source: 'GDPR Official Text',
          lastUpdated: new Date('2018-05-25')
        }
      ];

      knowledgeManager.addFramework('gdpr-2016', mockGDPR);

      const frameworks = knowledgeManager.getFrameworks();
      expect(frameworks).toContain('owasp-top10-2021');
      expect(frameworks).toContain('gdpr-2016');
      expect(frameworks).toHaveLength(2);
    });
  });

  describe('🔍 Cross-Framework Search and Query', () => {
    beforeEach(() => {
      knowledgeManager.addFramework('owasp-top10-2021', OWASP_TOP_10_2021);
    });

    it('should search across all frameworks by keyword', () => {
      const results = knowledgeManager.searchAcrossFrameworks('access control');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].requirement.title).toContain('Access Control');
      expect(results[0].relevance).toBeGreaterThan(0);
      expect(results[0].matchedFields).toContain('title');
    });

    it('should find requirements by category across frameworks', () => {
      const accessControlReqs = knowledgeManager.findRequirementsByCategory('Access Control');

      expect(accessControlReqs.length).toBeGreaterThan(0);
      expect(accessControlReqs[0].category).toBe('Access Control');
    });

    it('should find requirements by impact level across frameworks', () => {
      const highImpactReqs = knowledgeManager.findRequirementsByImpact('HIGH');

      expect(highImpactReqs.length).toBeGreaterThan(0);
      expect(highImpactReqs.every(req => req.impact === 'HIGH')).toBe(true);
    });

    it('should retrieve requirements by framework and ID', () => {
      const req = knowledgeManager.getRequirement('owasp-top10-2021', 'owasp-a01-2021');

      expect(req).toBeDefined();
      expect(req?.title).toContain('Broken Access Control');
      expect(req?.frameworkId).toBe('owasp-top10-2021');
    });

    it('should retrieve requirements by global ID', () => {
      const req = knowledgeManager.getRequirementByGlobalId('owasp-top10-2021:owasp-a01-2021');

      expect(req).toBeDefined();
      expect(req?.title).toContain('Broken Access Control');
    });
  });

  describe('🔗 Cross-Reference Management', () => {
    beforeEach(() => {
      knowledgeManager.addFramework('owasp-top10-2021', OWASP_TOP_10_2021);
    });

    it('should find cross-references for requirements', () => {
      const req = knowledgeManager.getRequirement('owasp-top10-2021', 'owasp-a01-2021');
      expect(req).toBeDefined();

      if (req) {
        const crossRefs = knowledgeManager.findCrossReferences(req);
        // Note: These will be empty until we add the referenced frameworks
        // This tests the cross-reference infrastructure
        expect(Array.isArray(crossRefs)).toBe(true);
      }
    });

    it('should add new cross-references between frameworks', () => {
      const crossRef = {
        sourceId: 'owasp-top10-2021:owasp-a01-2021',
        targetId: 'gdpr-2016:article-32',
        relationship: 'COMPLEMENTARY' as const,
        confidence: 0.95,
        evidence: 'Both address access control requirements',
        lastValidated: new Date()
      };

      const result = knowledgeManager.addCrossReference(crossRef);
      expect(result).toBe(true);
    });

    it('should reject low-confidence cross-references', () => {
      const lowConfidenceRef = {
        sourceId: 'owasp-top10-2021:owasp-a01-2021',
        targetId: 'gdpr-2016:article-32',
        relationship: 'COMPLEMENTARY' as const,
        confidence: 0.85, // Below threshold
        evidence: 'Both address access control requirements',
        lastValidated: new Date()
      };

      const result = knowledgeManager.addCrossReference(lowConfidenceRef);
      expect(result).toBe(false);
    });
  });

  describe('📊 Statistics and Health Monitoring', () => {
    beforeEach(() => {
      knowledgeManager.addFramework('owasp-top10-2021', OWASP_TOP_10_2021);
    });

    it('should provide comprehensive system statistics', () => {
      const stats = knowledgeManager.getStats();

      expect(stats.totalFrameworks).toBe(1);
      expect(stats.totalRequirements).toBe(5); // OWASP Top 5
      expect(stats.averageConfidence).toBe(1.0); // All OWASP requirements have 1.0 confidence
      expect(stats.lowConfidenceItems).toBe(0);
      expect(stats.validationStatus).toBe('Valid');
    });

    it('should validate knowledge base integrity', () => {
      const validation = knowledgeManager.validateKnowledgeBase();

      expect(validation.valid).toBe(true);
      expect(validation.issues).toHaveLength(0);
      expect(validation.recommendations).toHaveLength(0);
    });

    it('should provide system health status', () => {
      const health = knowledgeManager.getSystemHealth();

      expect(health.status).toBe('Healthy');
      expect(health.message).toContain('All systems operational');
      expect(health.stats.totalFrameworks).toBe(1);
    });
  });

  describe('🌱 Future Extensibility - Adding New Regulations', () => {
    it('should demonstrate how to add GDPR without code changes', () => {
      // This simulates adding a completely new regulation
      const gdprRequirements = [
        {
          id: 'gdpr-art25',
          frameworkId: 'gdpr-2016',
          title: 'Article 25 - Data Protection by Design and by Default',
          description: 'GDPR requirements for privacy by design',
          citation: 'Article 25',
          content: 'Data protection by design and by default content',
          impact: 'HIGH' as const,
          category: 'Privacy by Design',
          requirements: ['Implement privacy by design principles'],
          implementation: ['Use privacy-enhancing technologies'],
          compliance: ['Regular privacy impact assessments'],
          confidence: 1.0,
          source: 'GDPR Official Text',
          lastUpdated: new Date('2018-05-25'),
          crossReferences: [
            'owasp-top10-2021:owasp-a04-2021' // Links to OWASP Insecure Design
          ]
        }
      ];

      // Simply add the new framework - no manager code changes needed!
      knowledgeManager.addFramework('gdpr-2016', gdprRequirements);

      const frameworks = knowledgeManager.getFrameworks();
      expect(frameworks).toContain('gdpr-2016');

      // Search now works across both frameworks
      const privacyResults = knowledgeManager.searchAcrossFrameworks('privacy');
      expect(privacyResults.length).toBeGreaterThan(0);
    });

    it('should demonstrate how to add NIS2 without code changes', () => {
      const nis2Requirements = [
        {
          id: 'nis2-incident-response',
          frameworkId: 'nis2-2023',
          title: 'Incident Response and Reporting',
          description: 'NIS2 requirements for cybersecurity incident handling',
          citation: 'Article 18',
          content: 'Incident response and reporting requirements',
          impact: 'HIGH' as const,
          category: 'Incident Response',
          requirements: ['Establish incident response procedures'],
          implementation: ['Implement automated incident detection'],
          compliance: ['Regular incident response exercises'],
          confidence: 1.0,
          source: 'NIS2 Directive 2023',
          lastUpdated: new Date('2023-01-16'),
          crossReferences: [
            'owasp-top10-2021:owasp-a01-2021' // Links to OWASP Access Control
          ]
        }
      ];

      // Add NIS2 framework - still no manager code changes!
      knowledgeManager.addFramework('nis2-2023', nis2Requirements);

      const frameworks = knowledgeManager.getFrameworks();
      expect(frameworks).toContain('nis2-2023');

      // Search now works across all three frameworks
      const securityResults = knowledgeManager.searchAcrossFrameworks('security');
      expect(securityResults.length).toBeGreaterThan(0);
    });
  });

  describe('🔧 Utility and Export Functions', () => {
    beforeEach(() => {
      knowledgeManager.addFramework('owasp-top10-2021', OWASP_TOP_10_2021);
    });

    it('should export framework data for backup/transfer', () => {
      const exported = knowledgeManager.exportFramework('owasp-top10-2021');

      expect(exported).toBeDefined();
      expect(exported?.requirements).toHaveLength(5);
      expect(exported?.requirements[0].frameworkId).toBe('owasp-top10-2021');
    });

    it('should handle non-existent framework export gracefully', () => {
      const exported = knowledgeManager.exportFramework('non-existent');
      expect(exported).toBeNull();
    });
  });

  describe('🎯 Quality Gates and Confidence Enforcement', () => {
    it('should maintain high confidence across all operations', () => {
      knowledgeManager.addFramework('owasp-top10-2021', OWASP_TOP_10_2021);

      const stats = knowledgeManager.getStats();
      expect(stats.averageConfidence).toBeGreaterThanOrEqual(0.9);
      expect(stats.lowConfidenceItems).toBe(0);
    });

    it('should reject low-confidence requirements automatically', () => {
      const lowConfidenceReq = {
        id: 'test-req',
        frameworkId: 'test-framework',
        title: 'Test Requirement',
        description: 'Test description',
        citation: 'TEST-001',
        content: 'Test content',
        impact: 'HIGH' as const,
        category: 'Test',
        requirements: ['Test requirement'],
        implementation: ['Test implementation'],
        compliance: ['Test compliance'],
        confidence: 0.8, // Below threshold
        source: 'Test Source',
        lastUpdated: new Date()
      };

      // This should be rejected by the confidence validator
      const testFramework = [lowConfidenceReq];
      knowledgeManager.addFramework('test-framework', testFramework);

      const stats = knowledgeManager.getStats();
      expect(stats.totalRequirements).toBe(0); // No requirements added due to low confidence
    });
  });
});
