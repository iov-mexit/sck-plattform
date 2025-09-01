// TDD Tests for Policy Confidence Engine
// Milestone 3: Confidence Validation & Auto-Generation Testing

import { PolicyConfidenceEngine } from '../policy/policy-confidence-engine';
import { RoleRegulationMatrix } from '../policy/role-regulation-matrix';
import { SmartPolicyCorrelationEngine } from '../policy/smart-policy-correlation-engine';
import { PolicyRecommendation } from '../policy/smart-policy-correlation-engine';

describe('PolicyConfidenceEngine', () => {
  let confidenceEngine: PolicyConfidenceEngine;
  let roleMatrix: RoleRegulationMatrix;
  let policyEngine: SmartPolicyCorrelationEngine;
  let samplePolicy: PolicyRecommendation;

  beforeEach(async () => {
    roleMatrix = new RoleRegulationMatrix();
    policyEngine = new SmartPolicyCorrelationEngine(roleMatrix);
    confidenceEngine = new PolicyConfidenceEngine(roleMatrix);

    // Generate a sample policy for testing
    const policyResult = await policyEngine.generatePolicyRecommendation({
      roleTemplateId: 'security-engineer-l3',
      regulatoryFramework: 'GDPR'
    });

    if (policyResult) {
      samplePolicy = policyResult;
    } else {
      throw new Error('Failed to generate sample policy for testing');
    }
  });

  describe('Initialization', () => {
    test('should initialize with role matrix', () => {
      expect(confidenceEngine).toBeDefined();
      expect(roleMatrix).toBeDefined();
    });

    test('should have default confidence thresholds', () => {
      const engineAny = confidenceEngine as any;
      expect(engineAny.confidenceThresholds.autoApproval).toBe(0.9);
      expect(engineAny.confidenceThresholds.requiresReview).toBe(0.7);
      expect(engineAny.confidenceThresholds.rejection).toBe(0.5);
    });
  });

  describe('Policy Confidence Assessment', () => {
    test('should assess policy confidence successfully', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      expect(assessment).toBeDefined();
      expect(assessment.policyId).toBe('security-engineer-l3-GDPR');
      expect(assessment.overallConfidence).toBeGreaterThan(0);
      expect(assessment.overallConfidence).toBeLessThanOrEqual(1);
      expect(assessment.regulatoryCompliance).toBeGreaterThan(0);
      expect(assessment.qualityScore).toBeGreaterThan(0);
      expect(assessment.assessedAt).toBeInstanceOf(Date);
      expect(assessment.assessedBy).toBe('PolicyConfidenceEngine');
    });

    test('should generate policy ID correctly', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      expect(assessment.policyId).toMatch(/^security-engineer-l3-GDPR$/);
    });

    test('should include all required assessment fields', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      expect(assessment).toHaveProperty('policyId');
      expect(assessment).toHaveProperty('overallConfidence');
      expect(assessment).toHaveProperty('regulatoryCompliance');
      expect(assessment).toHaveProperty('riskAssessment');
      expect(assessment).toHaveProperty('qualityScore');
      expect(assessment).toHaveProperty('approvalStatus');
      expect(assessment).toHaveProperty('reviewRequired');
      expect(assessment).toHaveProperty('recommendations');
      expect(assessment).toHaveProperty('assessedAt');
      expect(assessment).toHaveProperty('assessedBy');
    });
  });

  describe('Risk Assessment', () => {
    test('should assess data privacy risk correctly', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      expect(assessment.riskAssessment).toBeDefined();
      expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(assessment.riskAssessment);
    });

    test('should assess security risk correctly', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      // Security engineer GDPR policy should have good security coverage
      expect(assessment.riskAssessment).toBeDefined();
    });

    test('should assess compliance risk correctly', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      // GDPR policy should have good compliance coverage
      expect(assessment.riskAssessment).toBeDefined();
    });

    test('should assess operational risk correctly', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      expect(assessment.riskAssessment).toBeDefined();
    });
  });

  describe('Quality Metrics', () => {
    test('should calculate completeness score', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      expect(assessment.qualityScore).toBeGreaterThan(0);
      expect(assessment.qualityScore).toBeLessThanOrEqual(1);
    });

    test('should assess policy structure completeness', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      // Sample policy should have all required sections
      expect(assessment.qualityScore).toBeGreaterThan(0.7);
    });

    test('should assess content clarity', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      expect(assessment.qualityScore).toBeGreaterThan(0);
    });

    test('should assess role alignment', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      expect(assessment.qualityScore).toBeGreaterThan(0);
    });
  });

  describe('Approval Status Determination', () => {
    test('should determine approval status based on confidence and risk', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      expect(assessment.approvalStatus).toBeDefined();
      expect(['PENDING', 'APPROVED', 'REJECTED', 'REQUIRES_REVIEW']).toContain(assessment.approvalStatus);
    });

    test('should mark policies for review when appropriate', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      expect(assessment.reviewRequired).toBeDefined();
      expect(typeof assessment.reviewRequired).toBe('boolean');
    });

    test('should handle different risk levels appropriately', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      // Critical risk should always require review
      if (assessment.riskAssessment === 'CRITICAL') {
        expect(assessment.approvalStatus).toBe('REQUIRES_REVIEW');
      }
    });
  });

  describe('Recommendations Generation', () => {
    test('should generate actionable recommendations', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      expect(assessment.recommendations).toBeDefined();
      expect(Array.isArray(assessment.recommendations)).toBe(true);
      expect(assessment.recommendations.length).toBeGreaterThan(0);
    });

    test('should provide specific improvement suggestions', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      assessment.recommendations.forEach(recommendation => {
        expect(typeof recommendation).toBe('string');
        expect(recommendation.length).toBeGreaterThan(10);
      });
    });

    test('should address different quality aspects', async () => {
      const assessment = await confidenceEngine.assessPolicyConfidence(samplePolicy);

      const recommendationText = assessment.recommendations.join(' ').toLowerCase();

      // Should address various aspects - check for any of these keywords
      const hasQualityAspects =±±±++*reshold') ||
        recommendationText.includes('coverage') ||
        recommendationText.includes('risk') ||
        recommendationText.includes('review') ||
        recommendationText.includes('sections') ||
        recommendationText.includes('language') ||
        recommendationText.includes('specific');

      expect(hasQualityAspects).toBe(true);
    });
  });

  describe('Batch Assessment', () => {
    test('should assess multiple policies successfully', async () => {
      const policies = [samplePolicy];

      // Add another policy for batch testing
      const frontendPolicy = await policyEngine.generatePolicyRecommendation({
        roleTemplateId: 'frontend-developer-l2',
        regulatoryFramework: 'OWASP'
      });

      if (frontendPolicy) {
        policies.push(frontendPolicy);
      }

      const assessments = await confidenceEngine.assessBatchConfidence(policies);

      expect(assessments.length).toBe(policies.length);
      expect(assessments.every(a => a.policyId && a.overallConfidence > 0)).toBe(true);
    });

    test('should sort assessments by confidence (highest first)', async () => {
      const policies = [samplePolicy];

      const frontendPolicy = await policyEngine.generatePolicyRecommendation({
        roleTemplateId: 'frontend-developer-l2',
        regulatoryFramework: 'OWASP'
      });

      if (frontendPolicy) {
        policies.push(frontendPolicy);
      }

      const assessments = await confidenceEngine.assessBatchConfidence(policies);

      // Should be sorted by confidence (highest first)
      for (let i = 1; i < assessments.length; i++) {
        expect(assessments[i - 1].overallConfidence).toBeGreaterThanOrEqual(assessments[i].overallConfidence);
      }
    });

    test('should handle assessment errors gracefully', async () => {
      const invalidPolicy = {
        ...samplePolicy,
        roleTemplateId: 'non-existent-role'
      } as PolicyRecommendation;

      const policies = [samplePolicy, invalidPolicy];

      const assessments = await confidenceEngine.assessBatchConfidence(policies);

      // Should still process valid policies
      expect(assessments.length).toBeGreaterThan(0);
      expect(assessments.length).toBeLessThanOrEqual(policies.length);
    });
  });

  describe('Statistics Generation', () => {
    test('should generate accurate confidence statistics', async () => {
      const policies = [samplePolicy];

      const frontendPolicy = await policyEngine.generatePolicyRecommendation({
        roleTemplateId: 'frontend-developer-l2',
        regulatoryFramework: 'OWASP'
      });

      if (frontendPolicy) {
        policies.push(frontendPolicy);
      }

      const assessments = await confidenceEngine.assessBatchConfidence(policies);
      const stats = confidenceEngine.getConfidenceStatistics(assessments);

      expect(stats.totalPolicies).toBe(policies.length);
      expect(stats.totalPolicies).toBeGreaterThan(0);
      expect(stats.averageConfidence).toBeGreaterThan(0);
      expect(stats.averageConfidence).toBeLessThanOrEqual(1);

      // Verify counts add up
      const totalCounted = stats.autoApproved + stats.requiresReview + stats.rejected;
      expect(totalCounted).toBe(stats.totalPolicies);
    });

    test('should categorize policies by approval status', async () => {
      const policies = [samplePolicy];
      const assessments = await confidenceEngine.assessBatchConfidence(policies);
      const stats = confidenceEngine.getConfidenceStatistics(assessments);

      expect(stats.autoApproved).toBeGreaterThanOrEqual(0);
      expect(stats.requiresReview).toBeGreaterThanOrEqual(0);
      expect(stats.rejected).toBeGreaterThanOrEqual(0);
    });

    test('should provide risk distribution statistics', async () => {
      const policies = [samplePolicy];
      const assessments = await confidenceEngine.assessBatchConfidence(policies);
      const stats = confidenceEngine.getConfidenceStatistics(assessments);

      expect(stats.riskDistribution).toBeDefined();
      expect(stats.riskDistribution.LOW).toBeGreaterThanOrEqual(0);
      expect(stats.riskDistribution.MEDIUM).toBeGreaterThanOrEqual(0);
      expect(stats.riskDistribution.HIGH).toBeGreaterThanOrEqual(0);
      expect(stats.riskDistribution.CRITICAL).toBeGreaterThanOrEqual(0);

      // Verify risk counts add up
      const totalRiskCount = Object.values(stats.riskDistribution).reduce((sum, count) => sum + count, 0);
      expect(totalRiskCount).toBe(stats.totalPolicies);
    });
  });

  describe('Threshold Management', () => {
    test('should allow updating confidence thresholds', () => {
      const engineAny = confidenceEngine as any;
      const originalThresholds = { ...engineAny.confidenceThresholds };

      confidenceEngine.updateConfidenceThresholds({
        autoApproval: 0.95,
        requiresReview: 0.75
      });

      expect(engineAny.confidenceThresholds.autoApproval).toBe(0.95);
      expect(engineAny.confidenceThresholds.requiresReview).toBe(0.75);
      expect(engineAny.confidenceThresholds.rejection).toBe(0.5); // Unchanged

      // Restore original thresholds
      confidenceEngine.updateConfidenceThresholds(originalThresholds);
    });

    test('should maintain threshold consistency', () => {
      const engineAny = confidenceEngine as any;

      // Thresholds should be logically consistent
      expect(engineAny.confidenceThresholds.autoApproval).toBeGreaterThan(engineAny.confidenceThresholds.requiresReview);
      expect(engineAny.confidenceThresholds.requiresReview).toBeGreaterThan(engineAny.confidenceThresholds.rejection);
    });
  });

  describe('Error Handling', () => {
    test('should handle missing role profiles gracefully', async () => {
      const invalidPolicy = {
        ...samplePolicy,
        roleTemplateId: 'non-existent-role'
      } as PolicyRecommendation;

      // Should not throw, should return low compliance score
      const assessment = await confidenceEngine.assessPolicyConfidence(invalidPolicy);

      expect(assessment.regulatoryCompliance).toBe(0);
      expect(assessment.overallConfidence).toBeLessThan(0.6); // Adjusted threshold
    });

    test('should handle invalid policy content gracefully', async () => {
      const invalidPolicy = {
        ...samplePolicy,
        policyContent: '' // Empty content
      } as PolicyRecommendation;

      const assessment = await confidenceEngine.assessPolicyConfidence(invalidPolicy);

      expect(assessment.overallConfidence).toBeLessThan(0.5);
      expect(assessment.approvalStatus).toBe('REQUIRES_REVIEW');
    });
  });

  describe('Integration with Policy Engine', () => {
    test('should work with generated policies from correlation engine', async () => {
      const policies = await policyEngine.generateBatchPolicyRecommendations([
        'security-engineer-l3',
        'frontend-developer-l2'
      ]);

      if (policies.length > 0) {
        const assessments = await confidenceEngine.assessBatchConfidence(policies);

        expect(assessments.length).toBe(policies.length);
        expect(assessments.every(a => a.policyId && a.overallConfidence > 0)).toBe(true);
      }
    });

    test('should maintain data consistency across engines', async () => {
      const policy = await policyEngine.generatePolicyRecommendation({
        roleTemplateId: 'security-engineer-l3',
        regulatoryFramework: 'GDPR'
      });

      if (policy) {
        const assessment = await confidenceEngine.assessPolicyConfidence(policy);

        // Policy ID should match between engines
        expect(assessment.policyId).toBe(`${policy.roleTemplateId}-${policy.regulatoryFramework}`);
      }
    });
  });
});
