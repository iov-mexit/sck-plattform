// Policy Confidence Engine: Multi-layer validation and automated approval workflows
// TDD Implementation: Confidence scoring, risk assessment, and policy quality assurance

import { PolicyRecommendation } from './smart-policy-correlation-engine';
import { RoleRegulationMatrix, RegulatoryFramework } from './role-regulation-matrix';

export interface PolicyConfidenceAssessment {
  policyId: string;
  overallConfidence: number;
  regulatoryCompliance: number;
  riskAssessment: RiskLevel;
  qualityScore: number;
  approvalStatus: ApprovalStatus;
  reviewRequired: boolean;
  recommendations: string[];
  assessedAt: Date;
  assessedBy?: string;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REQUIRES_REVIEW';

export interface RiskAssessment {
  dataPrivacyRisk: RiskLevel;
  securityRisk: RiskLevel;
  complianceRisk: RiskLevel;
  operationalRisk: RiskLevel;
  overallRisk: RiskLevel;
  riskFactors: string[];
  mitigationStrategies: string[];
}

export interface QualityMetrics {
  completeness: number;
  clarity: number;
  specificity: number;
  complianceCoverage: number;
  roleAlignment: number;
  regulatoryAccuracy: number;
}

export class PolicyConfidenceEngine {
  private roleMatrix: RoleRegulationMatrix;
  private confidenceThresholds: {
    autoApproval: number;
    requiresReview: number;
    rejection: number;
  };

  constructor(roleMatrix: RoleRegulationMatrix) {
    this.roleMatrix = roleMatrix;
    this.confidenceThresholds = {
      autoApproval: 0.9,
      requiresReview: 0.7,
      rejection: 0.5
    };
  }

  // Core confidence assessment method
  async assessPolicyConfidence(
    policy: PolicyRecommendation,
    context?: any
  ): Promise<PolicyConfidenceAssessment> {

    // 1. Multi-framework compliance validation
    const regulatoryCompliance = await this.validateRegulatoryCompliance(policy);

    // 2. Risk assessment
    const riskAssessment = this.assessPolicyRisk(policy);

    // 3. Quality metrics calculation
    const qualityMetrics = this.calculateQualityMetrics(policy);

    // 4. Overall confidence calculation
    const overallConfidence = this.calculateOverallConfidence(
      regulatoryCompliance,
      riskAssessment,
      qualityMetrics
    );

    // 5. Approval status determination
    const approvalStatus = this.determineApprovalStatus(overallConfidence, riskAssessment);

    // 6. Generate recommendations
    const recommendations = this.generateConfidenceRecommendations(
      overallConfidence,
      regulatoryCompliance,
      riskAssessment,
      qualityMetrics
    );

    return {
      policyId: `${policy.roleTemplateId}-${policy.regulatoryFramework}`,
      overallConfidence,
      regulatoryCompliance,
      riskAssessment: riskAssessment.overallRisk,
      qualityScore: this.calculateQualityScore(qualityMetrics),
      approvalStatus,
      reviewRequired: approvalStatus === 'REQUIRES_REVIEW',
      recommendations,
      assessedAt: new Date(),
      assessedBy: 'PolicyConfidenceEngine'
    };
  }

  // Validate regulatory compliance across frameworks
  private async validateRegulatoryCompliance(policy: PolicyRecommendation): Promise<number> {
    const roleProfile = this.roleMatrix.getRoleProfile(policy.roleTemplateId);
    if (!roleProfile) return 0;

    const framework = policy.regulatoryFramework;
    const requirement = roleProfile.regulatoryImpact[framework];

    if (!requirement) return 0;

    // Check if policy content covers all required elements
    const content = policy.policyContent.toLowerCase();
    const requiredPolicies = requirement.specificPolicies.map(p => p.toLowerCase());

    const coveredPolicies = requiredPolicies.filter(policyName =>
      content.includes(policyName)
    );

    const coverageScore = coveredPolicies.length / requiredPolicies.length;

    // Bonus for impact level
    const impactBonus = requirement.impact === 'HIGH' ? 0.1 :
      requirement.impact === 'MEDIUM' ? 0.05 : 0;

    return Math.min(coverageScore + impactBonus, 1.0);
  }

  // Assess policy risk across multiple dimensions
  private assessPolicyRisk(policy: PolicyRecommendation): RiskAssessment {
    const content = policy.policyContent.toLowerCase();

    // Data Privacy Risk Assessment
    const dataPrivacyRisk = this.assessDataPrivacyRisk(content, policy.regulatoryFramework);

    // Security Risk Assessment
    const securityRisk = this.assessSecurityRisk(content, policy.regulatoryFramework);

    // Compliance Risk Assessment
    const complianceRisk = this.assessComplianceRisk(content, policy.regulatoryFramework);

    // Operational Risk Assessment
    const operationalRisk = this.assessOperationalRisk(content);

    // Overall Risk Calculation
    const overallRisk = this.calculateOverallRisk([
      dataPrivacyRisk, securityRisk, complianceRisk, operationalRisk
    ]);

    // Generate risk factors and mitigation strategies
    const riskFactors = this.identifyRiskFactors(content, policy.regulatoryFramework);
    const mitigationStrategies = this.generateMitigationStrategies(overallRisk, riskFactors);

    return {
      dataPrivacyRisk,
      securityRisk,
      complianceRisk,
      operationalRisk,
      overallRisk,
      riskFactors,
      mitigationStrategies
    };
  }

  // Assess data privacy risk
  private assessDataPrivacyRisk(content: string, framework: RegulatoryFramework): RiskLevel {
    const privacyKeywords = ['personal data', 'pii', 'sensitive', 'confidential', 'privacy'];
    const privacyMentions = privacyKeywords.filter(keyword => content.includes(keyword)).length;

    if (framework === 'GDPR' && privacyMentions < 2) return 'HIGH';
    if (privacyMentions === 0) return 'MEDIUM';
    if (privacyMentions >= 3) return 'LOW';

    return 'MEDIUM';
  }

  // Assess security risk
  private assessSecurityRisk(content: string, framework: RegulatoryFramework): RiskLevel {
    const securityKeywords = ['security', 'authentication', 'authorization', 'encryption', 'access control'];
    const securityMentions = securityKeywords.filter(keyword => content.includes(keyword)).length;

    if (framework === 'NIS2' && securityMentions < 3) return 'HIGH';
    if (securityMentions < 2) return 'MEDIUM';
    if (securityMentions >= 4) return 'LOW';

    return 'MEDIUM';
  }

  // Assess compliance risk
  private assessComplianceRisk(content: string, framework: RegulatoryFramework): RiskLevel {
    const complianceKeywords = ['compliance', 'regulation', 'requirement', 'standard', 'policy'];
    const complianceMentions = complianceKeywords.filter(keyword => content.includes(keyword)).length;

    if (complianceMentions < 2) return 'HIGH';
    if (complianceMentions < 4) return 'MEDIUM';

    return 'LOW';
  }

  // Assess operational risk
  private assessOperationalRisk(content: string): RiskLevel {
    const operationalKeywords = ['procedure', 'process', 'workflow', 'training', 'monitoring'];
    const operationalMentions = operationalKeywords.filter(keyword => content.includes(keyword)).length;

    if (operationalMentions < 2) return 'MEDIUM';
    if (operationalMentions >= 4) return 'LOW';

    return 'MEDIUM';
  }

  // Calculate overall risk level
  private calculateOverallRisk(riskLevels: RiskLevel[]): RiskLevel {
    const riskScores = riskLevels.map(risk => {
      switch (risk) {
        case 'LOW': return 1;
        case 'MEDIUM': return 2;
        case 'HIGH': return 3;
        case 'CRITICAL': return 4;
        default: return 2;
      }
    });

    const averageScore = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length;

    if (averageScore >= 3.5) return 'CRITICAL';
    if (averageScore >= 2.5) return 'HIGH';
    if (averageScore >= 1.5) return 'MEDIUM';

    return 'LOW';
  }

  // Calculate quality metrics
  private calculateQualityMetrics(policy: PolicyRecommendation): QualityMetrics {
    const content = policy.policyContent;

    // Completeness: Check for required sections
    const requiredSections = ['Purpose', 'Scope', 'Requirements', 'Responsibilities', 'Compliance'];
    const presentSections = requiredSections.filter(section =>
      content.includes(section)
    );
    const completeness = presentSections.length / requiredSections.length;

    // Clarity: Check for clear language and structure
    const clarity = this.assessClarity(content);

    // Specificity: Check for specific requirements and actions
    const specificity = this.assessSpecificity(content);

    // Compliance coverage: Already calculated in regulatory compliance
    const complianceCoverage = 1.0; // Placeholder, would use actual calculation

    // Role alignment: Check for role-specific content
    const roleAlignment = this.assessRoleAlignment(content, policy.roleTitle);

    // Regulatory accuracy: Check for framework-specific content
    const regulatoryAccuracy = this.assessRegulatoryAccuracy(content, policy.regulatoryFramework);

    return {
      completeness,
      clarity,
      specificity,
      complianceCoverage,
      roleAlignment,
      regulatoryAccuracy
    };
  }

  // Assess content clarity
  private assessClarity(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, sentence) =>
      sum + sentence.split(' ').length, 0
    ) / sentences.length;

    // Prefer sentences between 10-20 words
    if (avgSentenceLength >= 10 && avgSentenceLength <= 20) return 1.0;
    if (avgSentenceLength >= 8 && avgSentenceLength <= 25) return 0.8;
    if (avgSentenceLength >= 5 && avgSentenceLength <= 30) return 0.6;

    return 0.4;
  }

  // Assess content specificity
  private assessSpecificity(content: string): number {
    const specificIndicators = ['must', 'shall', 'will', 'required', 'mandatory', 'specific'];
    const specificMentions = specificIndicators.filter(indicator =>
      content.toLowerCase().includes(indicator)
    ).length;

    return Math.min(specificMentions / 3, 1.0);
  }

  // Assess role alignment
  private assessRoleAlignment(content: string, roleTitle: string): number {
    const roleElements = roleTitle.toLowerCase().split(' ');
    const roleMentions = roleElements.filter(element =>
      content.toLowerCase().includes(element)
    ).length;

    return roleElements.length > 0 ? roleMentions / roleElements.length : 0;
  }

  // Assess regulatory accuracy
  private assessRegulatoryAccuracy(content: string, framework: RegulatoryFramework): number {
    const frameworkKeywords: Record<RegulatoryFramework, string[]> = {
      'GDPR': ['gdpr', 'data protection', 'privacy', 'article 32'],
      'EU_AI_ACT': ['ai act', 'artificial intelligence', 'ai system', 'transparency'],
      'NIS2': ['nis2', 'cybersecurity', 'incident response', 'network security'],
      'NIST_CSF': ['nist', 'cybersecurity framework', 'identify', 'protect', 'detect'],
      'OWASP': ['owasp', 'web security', 'vulnerability', 'injection', 'xss']
    };

    const keywords = frameworkKeywords[framework] || [];
    const keywordMentions = keywords.filter(keyword =>
      content.toLowerCase().includes(keyword)
    ).length;

    return keywords.length > 0 ? keywordMentions / keywords.length : 0;
  }

  // Calculate overall confidence
  private calculateOverallConfidence(
    regulatoryCompliance: number,
    riskAssessment: RiskAssessment,
    qualityMetrics: QualityMetrics
  ): number {
    const qualityScore = this.calculateQualityScore(qualityMetrics);

    // Risk penalty: Higher risk reduces confidence
    const riskPenalty = this.calculateRiskPenalty(riskAssessment.overallRisk);

    // Weighted average: 40% regulatory compliance, 30% quality, 30% risk-adjusted
    const weightedScore = (
      regulatoryCompliance * 0.4 +
      qualityScore * 0.3 +
      (1 - riskPenalty) * 0.3
    );

    return Math.max(0, Math.min(1, weightedScore));
  }

  // Calculate quality score from metrics
  private calculateQualityScore(metrics: QualityMetrics): number {
    const weights = {
      completeness: 0.2,
      clarity: 0.2,
      specificity: 0.2,
      complianceCoverage: 0.15,
      roleAlignment: 0.15,
      regulatoryAccuracy: 0.1
    };

    return Object.entries(weights).reduce((score, [metric, weight]) => {
      return score + (metrics[metric as keyof QualityMetrics] * weight);
    }, 0);
  }

  // Calculate risk penalty
  private calculateRiskPenalty(riskLevel: RiskLevel): number {
    switch (riskLevel) {
      case 'LOW': return 0;
      case 'MEDIUM': return 0.1;
      case 'HIGH': return 0.3;
      case 'CRITICAL': return 0.5;
      default: return 0.2;
    }
  }

  // Determine approval status
  private determineApprovalStatus(
    confidence: number,
    riskAssessment: RiskAssessment
  ): ApprovalStatus {
    // Critical risk always requires review
    if (riskAssessment.overallRisk === 'CRITICAL') {
      return 'REQUIRES_REVIEW';
    }

    // High risk with low confidence requires review
    if (riskAssessment.overallRisk === 'HIGH' && confidence < this.confidenceThresholds.requiresReview) {
      return 'REQUIRES_REVIEW';
    }

    // Auto-approval for high confidence, low risk
    if (confidence >= this.confidenceThresholds.autoApproval && riskAssessment.overallRisk === 'LOW') {
      return 'APPROVED';
    }

    // Rejection for very low confidence
    if (confidence < this.confidenceThresholds.rejection) {
      return 'REJECTED';
    }

    // Default to requires review
    return 'REQUIRES_REVIEW';
  }

  // Generate confidence recommendations
  private generateConfidenceRecommendations(
    confidence: number,
    regulatoryCompliance: number,
    riskAssessment: RiskAssessment,
    qualityMetrics: QualityMetrics
  ): string[] {
    const recommendations: string[] = [];

    if (confidence < this.confidenceThresholds.autoApproval) {
      recommendations.push('Policy confidence below auto-approval threshold');
    }

    if (regulatoryCompliance < 0.8) {
      recommendations.push('Regulatory compliance coverage could be improved');
    }

    if (riskAssessment.overallRisk === 'HIGH' || riskAssessment.overallRisk === 'CRITICAL') {
      recommendations.push(`High risk level (${riskAssessment.overallRisk}) requires careful review`);
    }

    if (qualityMetrics.completeness < 0.8) {
      recommendations.push('Policy is missing required sections');
    }

    if (qualityMetrics.clarity < 0.7) {
      recommendations.push('Policy language could be clearer and more concise');
    }

    if (qualityMetrics.specificity < 0.6) {
      recommendations.push('Policy requirements could be more specific and actionable');
    }

    if (recommendations.length === 0) {
      recommendations.push('Policy meets all quality and confidence thresholds');
    }

    return recommendations;
  }

  // Identify specific risk factors
  private identifyRiskFactors(content: string, framework: RegulatoryFramework): string[] {
    const factors: string[] = [];

    if (content.length < 500) {
      factors.push('Policy content is too brief for comprehensive coverage');
    }

    if (!content.includes('monitoring') && !content.includes('audit')) {
      factors.push('Lacks monitoring and audit requirements');
    }

    if (!content.includes('training') && !content.includes('awareness')) {
      factors.push('No training or awareness requirements specified');
    }

    if (framework === 'GDPR' && !content.includes('data subject rights')) {
      factors.push('GDPR policy missing data subject rights');
    }

    if (framework === 'NIS2' && !content.includes('incident reporting')) {
      factors.push('NIS2 policy missing incident reporting requirements');
    }

    return factors;
  }

  // Generate mitigation strategies
  private generateMitigationStrategies(riskLevel: RiskLevel, riskFactors: string[]): string[] {
    const strategies: string[] = [];

    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL') {
      strategies.push('Implement additional security controls and monitoring');
      strategies.push('Conduct thorough risk assessment and gap analysis');
      strategies.push('Establish regular compliance reviews and updates');
    }

    if (riskFactors.some(factor => factor.includes('training'))) {
      strategies.push('Develop comprehensive training and awareness programs');
    }

    if (riskFactors.some(factor => factor.includes('monitoring'))) {
      strategies.push('Implement continuous monitoring and alerting systems');
    }

    if (riskFactors.some(factor => factor.includes('GDPR'))) {
      strategies.push('Enhance data protection and privacy controls');
    }

    if (riskFactors.some(factor => factor.includes('NIS2'))) {
      strategies.push('Strengthen cybersecurity incident response capabilities');
    }

    return strategies;
  }

  // Batch confidence assessment
  async assessBatchConfidence(
    policies: PolicyRecommendation[]
  ): Promise<PolicyConfidenceAssessment[]> {
    const assessments: PolicyConfidenceAssessment[] = [];

    for (const policy of policies) {
      try {
        const assessment = await this.assessPolicyConfidence(policy);
        assessments.push(assessment);
      } catch (error) {
        console.error(`Failed to assess policy ${policy.policyTitle}:`, error);
      }
    }

    return assessments.sort((a, b) => b.overallConfidence - a.overallConfidence);
  }

  // Get confidence statistics
  getConfidenceStatistics(assessments: PolicyConfidenceAssessment[]): {
    totalPolicies: number;
    autoApproved: number;
    requiresReview: number;
    rejected: number;
    averageConfidence: number;
    riskDistribution: Record<RiskLevel, number>;
  } {
    const totalPolicies = assessments.length;
    let autoApproved = 0;
    let requiresReview = 0;
    let rejected = 0;
    let totalConfidence = 0;

    const riskDistribution: Record<RiskLevel, number> = {
      'LOW': 0,
      'MEDIUM': 0,
      'HIGH': 0,
      'CRITICAL': 0
    };

    assessments.forEach(assessment => {
      totalConfidence += assessment.overallConfidence;

      switch (assessment.approvalStatus) {
        case 'APPROVED':
          autoApproved++;
          break;
        case 'REQUIRES_REVIEW':
          requiresReview++;
          break;
        case 'REJECTED':
          rejected++;
          break;
      }

      riskDistribution[assessment.riskAssessment]++;
    });

    return {
      totalPolicies,
      autoApproved,
      requiresReview,
      rejected,
      averageConfidence: totalPolicies > 0 ? totalConfidence / totalPolicies : 0,
      riskDistribution
    };
  }

  // Update confidence thresholds
  updateConfidenceThresholds(thresholds: Partial<typeof this.confidenceThresholds>): void {
    this.confidenceThresholds = { ...this.confidenceThresholds, ...thresholds };
  }
}
