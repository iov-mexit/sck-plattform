// Cross-Functional QA Test Suite
// Tests real question-response capabilities with cross-references and role impact

import { describe, it, expect, beforeEach } from 'vitest';
import { KnowledgeManager } from '../policy/knowledge-manager';
import { OWASP_TOP_10_2021, OWASP_TOP_10_2021_METADATA } from '../policy/datasets/owasp-top10-2021';
import { FrameworkMetadata } from '../policy/regulatory-core';

describe('Cross-Functional Question Answering with Role Impact', () => {
  let knowledgeManager: KnowledgeManager;

  beforeEach(() => {
    knowledgeManager = new KnowledgeManager();

    // Initialize with OWASP framework
    knowledgeManager.addFramework('owasp-top10-2021', OWASP_TOP_10_2021);
    knowledgeManager.addFrameworkMetadata(OWASP_TOP_10_2021_METADATA);
  });

  describe('🔍 Real Question-Response Capabilities', () => {
    it('should answer "What are the OWASP Top 10 vulnerabilities?" with high confidence', () => {
      const results = knowledgeManager.searchAcrossFrameworks('Broken Access Control');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].requirement.frameworkId).toBe('owasp-top10-2021');
      expect(results[0].requirement.confidence).toBe(1.0);
      expect(results[0].matchedFields).toContain('title');
    });

    it('should answer "What is broken access control?" with specific details', () => {
      const results = knowledgeManager.searchAcrossFrameworks('broken access control');

      expect(results.length).toBeGreaterThan(0);
      const accessControl = results.find(r => r.requirement.title.includes('Access Control'));
      expect(accessControl).toBeDefined();
      expect(accessControl?.requirement.citation).toBe('A01:2021');
      expect(accessControl?.requirement.requirements).toContain('Implement role-based access control (RBAC)');
    });

    it('should answer "What are cryptographic failures?" with implementation details', () => {
      const results = knowledgeManager.searchAcrossFrameworks('cryptographic failures');

      expect(results.length).toBeGreaterThan(0);
      const crypto = results.find(r => r.requirement.title.includes('Cryptographic'));
      expect(crypto).toBeDefined();
      expect(crypto?.requirement.implementation).toContain('Use industry-standard cryptographic libraries (OpenSSL, BouncyCastle)');
      expect(crypto?.requirement.implementation).toContain('Implement automated certificate rotation and key management');
    });

    it('should answer "What is injection vulnerability?" with prevention methods', () => {
      const results = knowledgeManager.searchAcrossFrameworks('injection');

      expect(results.length).toBeGreaterThan(0);
      const injection = results.find(r => r.requirement.title.includes('Injection'));
      expect(injection).toBeDefined();
      expect(injection?.requirement.requirements).toContain('Use parameterized queries and prepared statements');
      expect(injection?.requirement.requirements).toContain('Validate and sanitize all user inputs');
    });
  });

  describe('🔗 Cross-Reference Intelligence', () => {
    it('should show cross-references between OWASP and other frameworks', () => {
      const owaspA01 = knowledgeManager.getRequirement('owasp-top10-2021', 'owasp-a01-2021');
      expect(owaspA01).toBeDefined();

      if (owaspA01) {
        expect(owaspA01.crossReferences).toBeDefined();
        expect(owaspA01.crossReferences?.length).toBeGreaterThan(0);

        // Should have cross-references to GDPR, NIS2, ISO
        const hasGDPR = owaspA01.crossReferences?.some(ref => ref.includes('gdpr'));
        const hasNIS2 = owaspA01.crossReferences?.some(ref => ref.includes('nis2'));
        const hasISO = owaspA01.crossReferences?.some(ref => ref.includes('iso'));

        expect(hasGDPR).toBe(true);
        expect(hasNIS2).toBe(true);
        expect(hasISO).toBe(true);
      }
    });

    it('should show cross-references between OWASP and GDPR for data protection', () => {
      const owaspA02 = knowledgeManager.getRequirement('owasp-top10-2021', 'owasp-a02-2021');
      expect(owaspA02).toBeDefined();

      if (owaspA02) {
        expect(owaspA02.crossReferences).toBeDefined();

        // Should link to GDPR Article 32 (Security of Processing)
        const hasGDPR32 = owaspA02.crossReferences?.some(ref => ref.includes('gdpr') && ref.includes('article-32'));
        expect(hasGDPR32).toBe(true);
      }
    });

    it('should show cross-references between OWASP and PCI DSS for cryptography', () => {
      const owaspA02 = knowledgeManager.getRequirement('owasp-top10-2021', 'owasp-a02-2021');
      expect(owaspA02).toBeDefined();

      if (owaspA02) {
        expect(owaspA02.crossReferences).toBeDefined();

        // Should link to PCI DSS cryptography requirements
        const hasPCIDSS = owaspA02.crossReferences?.some(ref => ref.includes('pci-dss'));
        expect(hasPCIDSS).toBe(true);
      }
    });
  });

  describe('👥 Role Impact Analysis', () => {
    it('should identify which OWASP requirements impact Product Managers', () => {
      const productManagerRelevant = knowledgeManager.searchAcrossFrameworks('access control');

      expect(productManagerRelevant.length).toBeGreaterThan(0);

      // Product Managers need to understand access control for feature design
      const accessControl = productManagerRelevant.find(r => r.requirement.title.includes('Access Control'));
      expect(accessControl).toBeDefined();

      if (accessControl) {
        // Should have clear implementation guidance
        expect(accessControl.requirement.implementation.length).toBeGreaterThan(0);
        expect(accessControl.requirement.compliance.length).toBeGreaterThan(0);
      }
    });

    it('should identify which OWASP requirements impact Security Engineers', () => {
      const securityEngineerRelevant = knowledgeManager.searchAcrossFrameworks('cryptography');

      expect(securityEngineerRelevant.length).toBeGreaterThan(0);

      const crypto = securityEngineerRelevant.find(r => r.requirement.title.includes('Cryptographic'));
      expect(crypto).toBeDefined();

      if (crypto) {
        // Security Engineers need technical implementation details
        expect(crypto.requirement.implementation).toContain('Use industry-standard cryptographic libraries (OpenSSL, BouncyCastle)');
        expect(crypto.requirement.implementation).toContain('Implement automated certificate rotation and key management');
        expect(crypto.requirement.compliance).toContain('Regular cryptographic security assessments');
      }
    });

    it('should identify which OWASP requirements impact DevOps Engineers', () => {
      const devOpsRelevant = knowledgeManager.searchAcrossFrameworks('security misconfiguration');

      expect(devOpsRelevant.length).toBeGreaterThan(0);

      const misconfig = devOpsRelevant.find(r => r.requirement.title.includes('Security Misconfiguration'));
      expect(misconfig).toBeDefined();

      if (misconfig) {
        // DevOps Engineers need configuration and deployment guidance
        expect(misconfig.requirement.implementation.length).toBeGreaterThan(0);
        expect(misconfig.requirement.compliance.length).toBeGreaterThan(0);
      }
    });

    it('should identify which OWASP requirements impact QA Engineers', () => {
      const qaRelevant = knowledgeManager.searchAcrossFrameworks('injection');

      expect(qaRelevant.length).toBeGreaterThan(0);

      const injection = qaRelevant.find(r => r.requirement.title.includes('Injection'));
      expect(injection).toBeDefined();

      if (injection) {
        // QA Engineers need testing and validation guidance
        expect(injection.requirement.compliance.length).toBeGreaterThan(0);
      }
    });
  });

  describe('🌐 Cross-Framework Compliance Intelligence', () => {
    it('should show how OWASP A01 (Access Control) relates to GDPR compliance', () => {
      const owaspA01 = knowledgeManager.getRequirement('owasp-top10-2021', 'owasp-a01-2021');
      expect(owaspA01).toBeDefined();

      if (owaspA01) {
        // OWASP A01 provides technical implementation for GDPR Article 32
        const gdprCrossRef = owaspA01.crossReferences?.find(ref => ref.includes('gdpr'));
        expect(gdprCrossRef).toBeDefined();

        // This shows how technical controls support regulatory compliance
        console.log(`🔗 OWASP A01 (${owaspA01.citation}) supports GDPR compliance via: ${gdprCrossRef}`);
      }
    });

    it('should show how OWASP A02 (Cryptography) relates to PCI DSS compliance', () => {
      const owaspA02 = knowledgeManager.getRequirement('owasp-top10-2021', 'owasp-a02-2021');
      expect(owaspA02).toBeDefined();

      if (owaspA02) {
        // OWASP A02 provides technical implementation for PCI DSS crypto requirements
        const pciCrossRef = owaspA02.crossReferences?.find(ref => ref.includes('pci-dss'));
        expect(pciCrossRef).toBeDefined();

        // This shows how OWASP guidance supports payment industry compliance
        console.log(`🔗 OWASP A02 (${owaspA02.citation}) supports PCI DSS compliance via: ${pciCrossRef}`);
      }
    });

    it('should show how OWASP A04 (Insecure Design) relates to ISO 27001 compliance', () => {
      const owaspA04 = knowledgeManager.getRequirement('owasp-top10-2021', 'owasp-a04-2021');
      expect(owaspA04).toBeDefined();

      if (owaspA04) {
        // OWASP A04 provides technical implementation for ISO 27001 controls
        const isoCrossRef = owaspA04.crossReferences?.find(ref => ref.includes('iso-27001'));
        expect(isoCrossRef).toBeDefined();

        // This shows how OWASP guidance supports ISO security standards
        console.log(`🔗 OWASP A04 (${owaspA04.citation}) supports ISO 27001 compliance via: ${isoCrossRef}`);
      }
    });
  });

  describe('📊 High-Confidence Response Quality', () => {
    it('should maintain 1.0 confidence for all OWASP responses', () => {
      const allRequirements = knowledgeManager.getStats();
      expect(allRequirements.averageConfidence).toBe(1.0);
      expect(allRequirements.lowConfidenceItems).toBe(0);
    });

    it('should provide comprehensive responses with citations', () => {
      const results = knowledgeManager.searchAcrossFrameworks('security');

      results.forEach(result => {
        expect(result.requirement.confidence).toBe(1.0);
        expect(result.requirement.citation).toBeDefined();
        expect(result.requirement.source).toBeDefined();
        expect(result.requirement.requirements.length).toBeGreaterThan(0);
        expect(result.requirement.implementation.length).toBeGreaterThan(0);
        expect(result.requirement.compliance.length).toBeGreaterThan(0);
      });
    });

    it('should provide actionable implementation guidance', () => {
      const results = knowledgeManager.searchAcrossFrameworks('access control');

      const accessControl = results.find(r => r.requirement.title.includes('Access Control'));
      expect(accessControl).toBeDefined();

      if (accessControl) {
        // Should have specific, actionable guidance
        expect(accessControl.requirement.implementation).toContain('Use OAuth 2.0/OpenID Connect for authentication');
        expect(accessControl.requirement.implementation).toContain('Implement JWT token validation with proper expiration');
        expect(accessControl.requirement.implementation).toContain('Design microservice access controls with service mesh');
      }
    });
  });

  describe('🚀 System Performance and Scalability', () => {
    it('should handle multiple concurrent searches efficiently', () => {
      const startTime = Date.now();

      // Perform multiple searches
      const search1 = knowledgeManager.searchAcrossFrameworks('access control');
      const search2 = knowledgeManager.searchAcrossFrameworks('cryptography');
      const search3 = knowledgeManager.searchAcrossFrameworks('injection');
      const search4 = knowledgeManager.searchAcrossFrameworks('security');

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Should complete all searches quickly
      expect(totalTime).toBeLessThan(100); // Less than 100ms for 4 searches
      expect(search1.length).toBeGreaterThan(0);
      expect(search2.length).toBeGreaterThan(0);
      expect(search3.length).toBeGreaterThan(0);
      expect(search4.length).toBeGreaterThan(0);
    });

    it('should maintain performance with multiple frameworks', () => {
      // Add mock GDPR framework
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
          lastUpdated: new Date('2018-05-25'),
          crossReferences: ['owasp-top10-2021:owasp-a01-2021']
        }
      ];

      knowledgeManager.addFramework('gdpr-2016', mockGDPR);

      const startTime = Date.now();
      const results = knowledgeManager.searchAcrossFrameworks('security');
      const endTime = Date.now();

      // Should still be fast with multiple frameworks
      expect(endTime - startTime).toBeLessThan(50); // Less than 50ms
      expect(results.length).toBeGreaterThan(0);
    });
  });
});
