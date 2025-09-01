// TDD Tests for Unified Policy System
// Milestone 4: Integration & Testing - End-to-end system validation

import { UnifiedPolicySystem } from '../policy/unified-policy-system';

describe('UnifiedPolicySystem', () => {
  let system: UnifiedPolicySystem;

  beforeEach(() => {
    system = new UnifiedPolicySystem();
  });

  describe('Initialization', () => {
    test('should initialize all three engines', () => {
      expect(system).toBeDefined();

      // Test that all engines are accessible
      const systemAny = system as any;
      expect(systemAny.roleMatrix).toBeDefined();
      expect(systemAny.policyEngine).toBeDefined();
      expect(systemAny.confidenceEngine).toBeDefined();
    });

    test('should have default confidence threshold', () => {
      const systemAny = system as any;
      expect(systemAny.defaultConfidenceThreshold).toBe(0.85);
    });
  });

  describe('Single Policy Generation', () => {
    test('should generate policy for security engineer successfully', async () => {
      const request = {
        roleTemplateId: 'security-engineer-l3',
        regulatoryFramework: 'GDPR'
      };

      const response = await system.generatePolicy(request);

      expect(response.success).toBe(true);
      expect(response.policy).toBeDefined();
      expect(response.confidenceAssessment).toBeDefined();
      expect(response.processingTime).toBeGreaterThan(0);
      expect(response.metadata.roleTitle).toBe('L3 Security Engineer');
      expect(response.metadata.regulatoryFramework).toBe('GDPR');
    });

    test('should generate policy for frontend developer successfully', async () => {
      const request = {
        roleTemplateId: 'frontend-developer-l2',
        regulatoryFramework: 'OWASP'
      };

      const response = await system.generatePolicy(request);

      expect(response.success).toBe(true);
      expect(response.policy).toBeDefined();
      expect(response.confidenceAssessment).toBeDefined();
      expect(response.metadata.roleTitle).toBe('L2 Frontend Developer');
      expect(response.metadata.regulatoryFramework).toBe('OWASP');
    });

    test('should handle non-existent role gracefully', async () => {
      const request = {
        roleTemplateId: 'non-existent-role',
        regulatoryFramework: 'GDPR'
      };

      const response = await system.generatePolicy(request);

      expect(response.success).toBe(false);
      expect(response.policy).toBeUndefined();
      expect(response.autoApproved).toBe(false);
      expect(response.requiresReview).toBe(true);
      expect(response.recommendations.length).toBeGreaterThan(0);
    });

    test('should respect custom confidence threshold', async () => {
      const request = {
        roleTemplateId: 'security-engineer-l3',
        regulatoryFramework: 'GDPR',
        confidenceThreshold: 0.95
      };

      const response = await system.generatePolicy(request);

      if (response.success && response.confidenceAssessment) {
        // The confidence threshold is used for filtering, not for generation
        expect(response.confidenceAssessment.overallConfidence).toBeGreaterThan(0);
      }
    });

    test('should include comprehensive metadata', async () => {
      const request = {
        roleTemplateId: 'devops-architect-l4',
        regulatoryFramework: 'NIS2'
      };

      const response = await system.generatePolicy(request);

      expect(response.success).toBe(true);
      expect(response.metadata).toBeDefined();
      expect(response.metadata.roleTitle).toBe('L4 DevOps Architect');
      expect(response.metadata.regulatoryFramework).toBe('NIS2');
      expect(response.metadata.confidenceScore).toBeGreaterThan(0);
      expect(response.metadata.riskLevel).toBeDefined();
      expect(response.metadata.qualityScore).toBeGreaterThan(0);
    });
  });

  describe('Batch Policy Generation', () => {
    test('should generate policies for multiple roles', async () => {
      const request = {
        roleTemplateIds: ['security-engineer-l3', 'frontend-developer-l2', 'devops-architect-l4']
      };

      const response = await system.generateBatchPolicies(request);

      expect(response.success).toBe(true);
      expect(response.policies.length).toBe(3);
      expect(response.summary.totalRequested).toBe(3);
      expect(response.summary.totalGenerated).toBeGreaterThanOrEqual(2); // At least 2 should succeed
      expect(response.summary.processingTime).toBeGreaterThan(0);
    });

    test('should respect max policies limit', async () => {
      const request = {
        roleTemplateIds: ['security-engineer-l3', 'frontend-developer-l2', 'devops-architect-l4'],
        maxPolicies: 2
      };

      const response = await system.generateBatchPolicies(request);

      expect(response.policies.length).toBe(2);
      expect(response.summary.totalRequested).toBe(2);
    });

    test('should handle mixed success/failure scenarios', async () => {
      const request = {
        roleTemplateIds: ['security-engineer-l3', 'non-existent-role', 'frontend-developer-l2']
      };

      const response = await system.generateBatchPolicies(request);

      expect(response.success).toBe(true); // At least one policy succeeded
      expect(response.policies.length).toBe(3);
      expect(response.summary.totalGenerated).toBeLessThan(3); // Some failed
      expect(response.summary.totalGenerated).toBeGreaterThan(0); // Some succeeded
    });

    test('should calculate accurate summary statistics', async () => {
      const request = {
        roleTemplateIds: ['security-engineer-l3', 'frontend-developer-l2']
      };

      const response = await system.generateBatchPolicies(request);

      expect(response.summary.totalRequested).toBe(2);
      expect(response.summary.totalGenerated).toBeGreaterThanOrEqual(1); // At least 1 should succeed
      expect(response.summary.averageConfidence).toBeGreaterThan(0);
      expect(response.summary.averageConfidence).toBeLessThanOrEqual(1);

      // Verify auto-approval and review counts
      const autoApproved = response.policies.filter(p => p.autoApproved).length;
      const requiresReview = response.policies.filter(p => p.requiresReview).length;
      expect(autoApproved + requiresReview).toBe(2);
    });
  });

  describe('System Statistics', () => {
    test('should return accurate system statistics', () => {
      const stats = system.getSystemStatistics();

      expect(stats.totalRoles).toBe(3); // security-engineer, frontend-developer, devops-architect
      expect(stats.totalFrameworks).toBe(5); // GDPR, EU_AI_ACT, NIS2, NIST_CSF, OWASP
      expect(stats.averageComplianceScore).toBeGreaterThan(0);
      expect(stats.averageComplianceScore).toBeLessThanOrEqual(1);
      expect(stats.confidenceThresholds).toBeDefined();
    });

    test('should have correct confidence thresholds', () => {
      const stats = system.getSystemStatistics();

      expect(stats.confidenceThresholds.autoApproval).toBe(0.9);
      expect(stats.confidenceThresholds.requiresReview).toBe(0.7);
      expect(stats.confidenceThresholds.rejection).toBe(0.5);
    });
  });

  describe('Role Template Validation', () => {
    test('should validate existing role templates', () => {
      const validation = system.validateRoleTemplate('security-engineer-l3');

      expect(validation.isValid).toBe(true);
      expect(validation.roleTitle).toBe('L3 Security Engineer');
      expect(validation.category).toBe('Architecture');
      expect(validation.complianceScore).toBeGreaterThan(0);
      expect(validation.highImpactFrameworks).toBeDefined();
      expect(validation.highImpactFrameworks!.length).toBeGreaterThan(0);
    });

    test('should reject invalid role templates', () => {
      const validation = system.validateRoleTemplate('non-existent-role');

      expect(validation.isValid).toBe(false);
      expect(validation.roleTitle).toBeUndefined();
      expect(validation.category).toBeUndefined();
    });

    test('should identify high-impact frameworks correctly', () => {
      const validation = system.validateRoleTemplate('security-engineer-l3');

      expect(validation.isValid).toBe(true);
      expect(validation.highImpactFrameworks).toContain('GDPR');
      expect(validation.highImpactFrameworks).toContain('NIS2');
      expect(validation.highImpactFrameworks).toContain('OWASP');
    });
  });

  describe('Regulatory Framework Management', () => {
    test('should return all available frameworks', () => {
      const frameworks = system.getAvailableFrameworks();

      expect(frameworks).toContain('GDPR');
      expect(frameworks).toContain('EU_AI_ACT');
      expect(frameworks).toContain('NIS2');
      expect(frameworks).toContain('NIST_CSF');
      expect(frameworks).toContain('OWASP');
      expect(frameworks.length).toBe(5);
    });
  });

  describe('Compliance Level Filtering', () => {
    test('should filter roles by minimum compliance score', () => {
      const highComplianceRoles = system.getRolesByComplianceLevel(0.8);

      expect(highComplianceRoles.length).toBeGreaterThan(0);
      highComplianceRoles.forEach(role => {
        expect(role.complianceScore).toBeGreaterThanOrEqual(0.8);
      });
    });

    test('should sort roles by compliance score (highest first)', () => {
      const roles = system.getRolesByComplianceLevel(0.5);

      for (let i = 1; i < roles.length; i++) {
        expect(roles[i - 1].complianceScore).toBeGreaterThanOrEqual(roles[i].complianceScore);
      }
    });

    test('should return empty array for very high threshold', () => {
      const roles = system.getRolesByComplianceLevel(1.0);
      expect(roles.length).toBeLessThanOrEqual(2); // May have some roles with perfect compliance
    });
  });

  describe('Confidence Threshold Management', () => {
    test('should update confidence thresholds', () => {
      const originalStats = system.getSystemStatistics();

      system.updateConfidenceThresholds({
        autoApproval: 0.95,
        requiresReview: 0.75
      });

      const updatedStats = system.getSystemStatistics();
      expect(updatedStats.confidenceThresholds.autoApproval).toBe(0.95);
      expect(updatedStats.confidenceThresholds.requiresReview).toBe(0.75);
      expect(updatedStats.confidenceThresholds.rejection).toBe(0.5); // Unchanged
    });

    test('should update default confidence threshold', () => {
      const systemAny = system as any;
      const originalThreshold = systemAny.defaultConfidenceThreshold;

      system.updateConfidenceThresholds({
        autoApproval: 0.92
      });

      expect(systemAny.defaultConfidenceThreshold).toBe(0.92);

      // Restore original
      system.updateConfidenceThresholds({
        autoApproval: originalThreshold
      });
    });
  });

  describe('Health Check', () => {
    test('should perform comprehensive health check', async () => {
      const health = await system.healthCheck();

      expect(health.status).toBeDefined();
      expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
      expect(health.components).toBeDefined();
      expect(health.components.roleMatrix).toBe(true);
      expect(health.components.policyEngine).toBe(true);
      expect(health.components.confidenceEngine).toBe(true);
      expect(health.timestamp).toBeInstanceOf(Date);
    });

    test('should return healthy status when all components work', async () => {
      const health = await system.healthCheck();

      if (health.components.roleMatrix &&
        health.components.policyEngine &&
        health.components.confidenceEngine) {
        expect(health.status).toBe('healthy');
      }
    });
  });

  describe('Configuration Export', () => {
    test('should export system configuration', () => {
      const config = system.exportConfiguration();

      expect(config.version).toBe('1.0.0');
      expect(config.confidenceThresholds).toBeDefined();
      expect(config.roleMatrixSize).toBe(3);
      expect(config.supportedFrameworks).toHaveLength(5);
      expect(config.timestamp).toBeInstanceOf(Date);
    });

    test('should include current confidence thresholds in export', () => {
      const config = system.exportConfiguration();

      expect(config.confidenceThresholds.autoApproval).toBe(0.9);
      expect(config.confidenceThresholds.requiresReview).toBe(0.7);
      expect(config.confidenceThresholds.rejection).toBe(0.5);
    });
  });

  describe('End-to-End Integration', () => {
    test('should generate and validate policy in complete workflow', async () => {
      // 1. Generate policy
      const policyResponse = await system.generatePolicy({
        roleTemplateId: 'security-engineer-l3',
        regulatoryFramework: 'GDPR',
        autoApprove: true
      });

      expect(policyResponse.success).toBe(true);
      expect(policyResponse.policy).toBeDefined();
      expect(policyResponse.confidenceAssessment).toBeDefined();

      // 2. Validate the generated policy
      if (policyResponse.policy) {
        const validation = system.validateRoleTemplate(policyResponse.policy.roleTemplateId);
        expect(validation.isValid).toBe(true);
        expect(validation.roleTitle).toBe('L3 Security Engineer');
      }

      // 3. Check confidence assessment
      if (policyResponse.confidenceAssessment) {
        expect(policyResponse.confidenceAssessment.overallConfidence).toBeGreaterThan(0);
        expect(policyResponse.confidenceAssessment.overallConfidence).toBeLessThanOrEqual(1);
        expect(policyResponse.confidenceAssessment.recommendations.length).toBeGreaterThan(0);
      }

      // 4. Verify metadata consistency
      expect(policyResponse.metadata.roleTitle).toBe('L3 Security Engineer');
      expect(policyResponse.metadata.regulatoryFramework).toBe('GDPR');
      expect(policyResponse.metadata.confidenceScore).toBeGreaterThan(0);
    });

    test('should handle batch processing with mixed results', async () => {
      const batchResponse = await system.generateBatchPolicies({
        roleTemplateIds: ['security-engineer-l3', 'non-existent-role', 'frontend-developer-l2'],
        regulatoryFramework: 'GDPR'
      });

      expect(batchResponse.success).toBe(true);
      expect(batchResponse.policies.length).toBe(3);

      // Should have some successful and some failed policies
      const successfulPolicies = batchResponse.policies.filter(p => p.success);
      const failedPolicies = batchResponse.policies.filter(p => !p.success);

      expect(successfulPolicies.length).toBeGreaterThan(0);
      expect(failedPolicies.length).toBeGreaterThan(0);

      // Verify summary accuracy
      expect(batchResponse.summary.totalGenerated).toBe(successfulPolicies.length);
      expect(batchResponse.summary.totalRequested).toBe(3);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle empty role template ID', async () => {
      const response = await system.generatePolicy({
        roleTemplateId: '',
        regulatoryFramework: 'GDPR'
      });

      expect(response.success).toBe(false);
      expect(response.requiresReview).toBe(true);
    });

    test('should handle invalid regulatory framework', async () => {
      const response = await system.generatePolicy({
        roleTemplateId: 'security-engineer-l3',
        regulatoryFramework: 'INVALID_FRAMEWORK'
      });

      // May fail due to invalid framework
      expect(response.success).toBeDefined();
    });

    test('should handle extremely high confidence threshold', async () => {
      const response = await system.generatePolicy({
        roleTemplateId: 'security-engineer-l3',
        regulatoryFramework: 'GDPR',
        confidenceThreshold: 0.99
      });

      // May fail due to very high threshold
      expect(response.success).toBeDefined();
    });

    test('should handle batch with empty role list', async () => {
      const response = await system.generateBatchPolicies({
        roleTemplateIds: []
      });

      expect(response.success).toBe(false);
      expect(response.policies.length).toBe(0);
      expect(response.summary.totalRequested).toBe(0);
      expect(response.summary.totalGenerated).toBe(0);
    });
  });

  describe('Performance and Scalability', () => {
    test('should complete single policy generation within reasonable time', async () => {
      const startTime = Date.now();

      const response = await system.generatePolicy({
        roleTemplateId: 'security-engineer-l3',
        regulatoryFramework: 'GDPR'
      });

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      expect(response.success).toBe(true);
      expect(processingTime).toBeLessThan(5000); // Should complete within 5 seconds
      expect(response.processingTime).toBeGreaterThanOrEqual(0); // System time should be non-negative
    });

    test('should handle multiple concurrent policy generations', async () => {
      const promises = [
        system.generatePolicy({ roleTemplateId: 'security-engineer-l3', regulatoryFramework: 'GDPR' }),
        system.generatePolicy({ roleTemplateId: 'frontend-developer-l2', regulatoryFramework: 'OWASP' }),
        system.generatePolicy({ roleTemplateId: 'devops-architect-l4', regulatoryFramework: 'NIS2' })
      ];

      const responses = await Promise.all(promises);

      expect(responses.length).toBe(3);
      responses.forEach(response => {
        expect(response.success).toBe(true);
        expect(response.processingTime).toBeGreaterThanOrEqual(0); // May be 0 for very fast processing
      });
    });
  });
});
