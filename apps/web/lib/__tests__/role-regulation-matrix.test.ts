// TDD Tests for Role-Regulation Matrix
// Milestone 1: Foundation Testing

import { RoleRegulationMatrix, RegulatoryFramework, RegulatoryImpact } from '../policy/role-regulation-matrix';

describe('RoleRegulationMatrix', () => {
  let matrix: RoleRegulationMatrix;

  beforeEach(() => {
    matrix = new RoleRegulationMatrix();
  });

  describe('Initialization', () => {
    test('should initialize with default role profiles', () => {
      const profiles = matrix.getAllRoleProfiles();
      expect(profiles).toHaveLength(3);

      const roleTitles = profiles.map(p => p.roleTitle);
      expect(roleTitles).toContain('L3 Security Engineer');
      expect(roleTitles).toContain('L2 Frontend Developer');
      expect(roleTitles).toContain('L4 DevOps Architect');
    });

    test('should have correct regulatory frameworks for each role', () => {
      const securityEngineer = matrix.getRoleProfile('security-engineer-l3');
      expect(securityEngineer).toBeDefined();

      if (securityEngineer) {
        const frameworks = Object.keys(securityEngineer.regulatoryImpact);
        expect(frameworks).toContain('GDPR');
        expect(frameworks).toContain('EU_AI_ACT');
        expect(frameworks).toContain('NIS2');
        expect(frameworks).toContain('NIST_CSF');
        expect(frameworks).toContain('OWASP');
      }
    });
  });

  describe('Role Profile Retrieval', () => {
    test('should retrieve existing role profile by ID', () => {
      const profile = matrix.getRoleProfile('security-engineer-l3');
      expect(profile).toBeDefined();
      expect(profile?.roleTitle).toBe('L3 Security Engineer');
      expect(profile?.category).toBe('Architecture');
    });

    test('should return undefined for non-existent role ID', () => {
      const profile = matrix.getRoleProfile('non-existent-role');
      expect(profile).toBeUndefined();
    });

    test('should return all role profiles', () => {
      const profiles = matrix.getAllRoleProfiles();
      expect(profiles).toHaveLength(3);
      expect(profiles.every(p => p.roleTemplateId && p.roleTitle)).toBe(true);
    });
  });

  describe('Regulatory Impact Filtering', () => {
    test('should filter roles by regulatory framework and impact level', () => {
      const highImpactGDPRRoles = matrix.getRolesByRegulatoryImpact('GDPR', 'HIGH');
      expect(highImpactGDPRRoles).toHaveLength(2); // Security Engineer + DevOps Architect

      const mediumImpactGDPRRoles = matrix.getRolesByRegulatoryImpact('GDPR', 'MEDIUM');
      expect(mediumImpactGDPRRoles).toHaveLength(1); // Frontend Developer

      const lowImpactGDPRRoles = matrix.getRolesByRegulatoryImpact('GDPR', 'LOW');
      expect(lowImpactGDPRRoles).toHaveLength(0);
    });

    test('should filter roles by category', () => {
      const architectureRoles = matrix.getRolesByCategory('Architecture');
      expect(architectureRoles).toHaveLength(2); // Security Engineer + DevOps Architect

      const designRoles = matrix.getRolesByCategory('Design');
      expect(designRoles).toHaveLength(1); // Frontend Developer
    });
  });

  describe('Policy Generation Utilities', () => {
    test('should identify high-impact policies for security engineer', () => {
      const highImpactPolicies = matrix.getHighImpactPolicies('security-engineer-l3');
      expect(highImpactPolicies.length).toBeGreaterThan(0);
      expect(highImpactPolicies).toContain('access_control');
      expect(highImpactPolicies).toContain('data_encryption');
      expect(highImpactPolicies).toContain('incident_response');
    });

    test('should identify high-impact policies for DevOps architect', () => {
      const highImpactPolicies = matrix.getHighImpactPolicies('devops-architect-l4');
      expect(highImpactPolicies.length).toBeGreaterThan(0);
      expect(highImpactPolicies).toContain('infrastructure_security');
      expect(highImpactPolicies).toContain('ai_infrastructure_security');
      expect(highImpactPolicies).toContain('devops_security');
    });

    test('should return empty array for non-existent role', () => {
      const highImpactPolicies = matrix.getHighImpactPolicies('non-existent-role');
      expect(highImpactPolicies).toEqual([]);
    });
  });

  describe('Compliance Scoring', () => {
    test('should calculate regulatory compliance score for security engineer', () => {
      const score = matrix.getRegulatoryComplianceScore('security-engineer-l3');
      expect(score).toBe(1.0); // All HIGH impact = 1.0
    });

    test('should calculate regulatory compliance score for frontend developer', () => {
      const score = matrix.getRegulatoryComplianceScore('frontend-developer-l2');
      // 3 MEDIUM + 2 LOW = (3*0.7 + 2*0.4) / 5 = (2.1 + 0.8) / 5 = 2.9 / 5 = 0.58
      expect(score).toBeCloseTo(0.58, 2);
    });

    test('should calculate regulatory compliance score for DevOps architect', () => {
      const score = matrix.getRegulatoryComplianceScore('devops-architect-l4');
      expect(score).toBe(1.0); // All HIGH impact = 1.0
    });

    test('should return 0 for non-existent role', () => {
      const score = matrix.getRegulatoryComplianceScore('non-existent-role');
      expect(score).toBe(0);
    });
  });

  describe('Matrix Operations', () => {
    test('should add new role profile', () => {
      const newProfile = {
        roleTemplateId: 'test-role-l1',
        roleTitle: 'L1 Test Role',
        category: 'Test',
        regulatoryImpact: {
          GDPR: {
            id: 'gdpr-test-001',
            title: 'Test GDPR Requirement',
            description: 'Test description',
            impact: 'LOW' as RegulatoryImpact,
            specificPolicies: ['test_policy'],
            citation: 'Test citation',
            lastUpdated: new Date()
          },
          EU_AI_ACT: {
            id: 'eu-ai-test-001',
            title: 'Test AI Requirement',
            description: 'Test description',
            impact: 'MEDIUM' as RegulatoryImpact,
            specificPolicies: ['test_ai_policy'],
            citation: 'Test citation',
            lastUpdated: new Date()
          },
          NIS2: {
            id: 'nis2-test-001',
            title: 'Test NIS2 Requirement',
            description: 'Test description',
            impact: 'LOW' as RegulatoryImpact,
            specificPolicies: ['test_nis2_policy'],
            citation: 'Test citation',
            lastUpdated: new Date()
          },
          NIST_CSF: {
            id: 'nist-test-001',
            title: 'Test NIST Requirement',
            description: 'Test description',
            impact: 'MEDIUM' as RegulatoryImpact,
            specificPolicies: ['test_nist_policy'],
            citation: 'Test citation',
            lastUpdated: new Date()
          },
          OWASP: {
            id: 'owasp-test-001',
            title: 'Test OWASP Requirement',
            description: 'Test description',
            impact: 'LOW' as RegulatoryImpact,
            specificPolicies: ['test_owasp_policy'],
            citation: 'Test citation',
            lastUpdated: new Date()
          }
        },
        autoGeneratedPolicies: ['test_policy'],
        complianceScore: 0.6,
        lastAssessed: new Date()
      };

      matrix.addRoleProfile(newProfile);
      const retrieved = matrix.getRoleProfile('test-role-l1');
      expect(retrieved).toBeDefined();
      expect(retrieved?.roleTitle).toBe('L1 Test Role');
    });

    test('should update existing role profile', () => {
      const originalProfile = matrix.getRoleProfile('security-engineer-l3');
      expect(originalProfile?.complianceScore).toBe(0.95);

      matrix.updateRoleProfile('security-engineer-l3', { complianceScore: 0.98 });
      const updatedProfile = matrix.getRoleProfile('security-engineer-l3');
      expect(updatedProfile?.complianceScore).toBe(0.98);
    });

    test('should remove role profile', () => {
      const removed = matrix.removeRoleProfile('security-engineer-l3');
      expect(removed).toBe(true);

      const retrieved = matrix.getRoleProfile('security-engineer-l3');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Data Integrity', () => {
    test('should maintain data consistency across operations', () => {
      const initialCount = matrix.getAllRoleProfiles().length;

      // Add profile
      const newProfile = {
        roleTemplateId: 'consistency-test',
        roleTitle: 'Consistency Test Role',
        category: 'Test',
        regulatoryImpact: {
          GDPR: {
            id: 'gdpr-consistency-001',
            title: 'Consistency Test',
            description: 'Test',
            impact: 'MEDIUM' as RegulatoryImpact,
            specificPolicies: ['test'],
            citation: 'Test',
            lastUpdated: new Date()
          },
          EU_AI_ACT: {
            id: 'eu-ai-consistency-001',
            title: 'Consistency Test',
            description: 'Test',
            impact: 'MEDIUM' as RegulatoryImpact,
            specificPolicies: ['test'],
            citation: 'Test',
            lastUpdated: new Date()
          },
          NIS2: {
            id: 'nis2-consistency-001',
            title: 'Consistency Test',
            description: 'Test',
            impact: 'MEDIUM' as RegulatoryImpact,
            specificPolicies: ['test'],
            citation: 'Test',
            lastUpdated: new Date()
          },
          NIST_CSF: {
            id: 'nist-consistency-001',
            title: 'Consistency Test',
            description: 'Test',
            impact: 'MEDIUM' as RegulatoryImpact,
            specificPolicies: ['test'],
            citation: 'Test',
            lastUpdated: new Date()
          },
          OWASP: {
            id: 'owasp-consistency-001',
            title: 'Consistency Test',
            description: 'Test',
            impact: 'MEDIUM' as RegulatoryImpact,
            specificPolicies: ['test'],
            citation: 'Test',
            lastUpdated: new Date()
          }
        },
        autoGeneratedPolicies: ['test'],
        complianceScore: 0.7,
        lastAssessed: new Date()
      };

      matrix.addRoleProfile(newProfile);
      expect(matrix.getAllRoleProfiles()).toHaveLength(initialCount + 1);

      // Remove profile
      matrix.removeRoleProfile('consistency-test');
      expect(matrix.getAllRoleProfiles()).toHaveLength(initialCount);
    });

    test('should handle edge cases gracefully', () => {
      // Test with empty string
      expect(matrix.getRoleProfile('')).toBeUndefined();

      // Test with null/undefined
      expect(matrix.getRoleProfile(null as any)).toBeUndefined();
      expect(matrix.getRoleProfile(undefined as any)).toBeUndefined();

      // Test removing non-existent profile
      expect(matrix.removeRoleProfile('non-existent')).toBe(false);
    });
  });
});
