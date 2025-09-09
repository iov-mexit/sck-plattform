import { describe, it, expect } from 'vitest';
import { recommendPrivileges } from '../team/risk';

describe('Team Risk Assessment', () => {
  describe('recommendPrivileges', () => {
    it('should recommend appropriate LoA for low risk team', async () => {
      const teamMembers = [
        {
          id: '1',
          name: 'John Doe',
          title: 'Senior Developer',
          trustScore: 4.5,
          skills: ['TypeScript', 'React'],
          certifications: []
        },
        {
          id: '2',
          name: 'Jane Smith',
          title: 'Security Engineer',
          trustScore: 4.8,
          skills: ['Security', 'Compliance'],
          certifications: [{ name: 'CISSP', issuer: 'ISC2', trustScore: 5 }]
        }
      ];

      const result = await recommendPrivileges({
        teamMembers,
        projectSensitivity: 'low'
      });

      expect(result.recommendedLoA).toBeLessThanOrEqual(3);
      expect(result.riskLevel).toBe('low');
      expect(result.suggestedControls).toContain('Multi-factor authentication');
      expect(result.suggestedControls).toContain('Regular access reviews');
    });

    it('should recommend higher LoA for critical risk team', async () => {
      const teamMembers = [
        {
          id: '1',
          name: 'John Doe',
          title: 'Junior Developer',
          trustScore: 2.0,
          skills: ['JavaScript'],
          certifications: []
        },
        {
          id: '2',
          name: 'Jane Smith',
          title: 'Intern',
          trustScore: 1.5,
          skills: ['HTML', 'CSS'],
          certifications: []
        }
      ];

      const result = await recommendPrivileges({
        teamMembers,
        projectSensitivity: 'critical'
      });

      expect(result.recommendedLoA).toBeGreaterThanOrEqual(4);
      expect(result.riskLevel).toBe('critical');
      expect(result.requiredApprovals).toContain('Executive Leadership');
      expect(result.suggestedControls).toContain('Zero-trust network access');
    });

    it('should adjust LoA based on team size', async () => {
      const smallTeam = [
        {
          id: '1',
          name: 'John Doe',
          title: 'Developer',
          trustScore: 3.0,
          skills: ['TypeScript'],
          certifications: []
        }
      ];

      const largeTeam = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        name: `Developer ${i}`,
        title: 'Developer',
        trustScore: 3.0,
        skills: ['TypeScript'],
        certifications: []
      }));

      const smallTeamResult = await recommendPrivileges({
        teamMembers: smallTeam,
        projectSensitivity: 'medium'
      });

      const largeTeamResult = await recommendPrivileges({
        teamMembers: largeTeam,
        projectSensitivity: 'medium'
      });

      expect(largeTeamResult.recommendedLoA).toBeGreaterThanOrEqual(smallTeamResult.recommendedLoA);
    });

    it('should identify compliance requirements based on project sensitivity', async () => {
      const teamMembers = [
        {
          id: '1',
          name: 'John Doe',
          title: 'Developer',
          trustScore: 3.0,
          skills: ['TypeScript'],
          certifications: []
        }
      ];

      const highSensitivityResult = await recommendPrivileges({
        teamMembers,
        projectSensitivity: 'high'
      });

      const criticalSensitivityResult = await recommendPrivileges({
        teamMembers,
        projectSensitivity: 'critical'
      });

      expect(highSensitivityResult.complianceRequirements).toContain('SOC 2 Type II');
      expect(highSensitivityResult.complianceRequirements).toContain('ISO 27001');
      
      expect(criticalSensitivityResult.complianceRequirements).toContain('FedRAMP (if applicable)');
      expect(criticalSensitivityResult.complianceRequirements).toContain('NIST Cybersecurity Framework');
    });

    it('should suggest security training for teams without security skills', async () => {
      const teamMembers = [
        {
          id: '1',
          name: 'John Doe',
          title: 'Frontend Developer',
          trustScore: 4.0,
          skills: ['React', 'CSS', 'JavaScript'],
          certifications: []
        }
      ];

      const result = await recommendPrivileges({
        teamMembers,
        projectSensitivity: 'high'
      });

      expect(result.suggestedControls).toContain('Security training requirement');
      expect(result.suggestedControls).toContain('Security mentor assignment');
    });

    it('should not suggest security training for teams with security skills', async () => {
      const teamMembers = [
        {
          id: '1',
          name: 'John Doe',
          title: 'Security Engineer',
          trustScore: 4.0,
          skills: ['Security', 'Compliance', 'TypeScript'],
          certifications: [{ name: 'CISSP', issuer: 'ISC2', trustScore: 5 }]
        }
      ];

      const result = await recommendPrivileges({
        teamMembers,
        projectSensitivity: 'high'
      });

      expect(result.suggestedControls).not.toContain('Security training requirement');
    });

    it('should generate appropriate rationale', async () => {
      const teamMembers = [
        {
          id: '1',
          name: 'John Doe',
          title: 'Developer',
          trustScore: 3.5,
          skills: ['TypeScript'],
          certifications: []
        }
      ];

      const result = await recommendPrivileges({
        teamMembers,
        projectSensitivity: 'medium'
      });

      expect(result.rationale).toContain('medium sensitivity project');
      expect(result.rationale).toContain('average trust score 3.5/5');
      expect(result.rationale).toContain('team size 1');
    });

    it('should handle empty team gracefully', async () => {
      const result = await recommendPrivileges({
        teamMembers: [],
        projectSensitivity: 'medium'
      });

      expect(result.recommendedLoA).toBeGreaterThanOrEqual(1);
      expect(result.riskLevel).toBeDefined();
      expect(result.requiredApprovals).toBeDefined();
      expect(result.suggestedControls).toBeDefined();
    });

    it('should include all required approval levels for high LoA', async () => {
      const teamMembers = [
        {
          id: '1',
          name: 'John Doe',
          title: 'Developer',
          trustScore: 2.0,
          skills: ['TypeScript'],
          certifications: []
        }
      ];

      const result = await recommendPrivileges({
        teamMembers,
        projectSensitivity: 'critical'
      });

      if (result.recommendedLoA >= 3) {
        expect(result.requiredApprovals).toContain('Security Team');
      }
      if (result.recommendedLoA >= 4) {
        expect(result.requiredApprovals).toContain('CISO');
      }
      if (result.recommendedLoA >= 5) {
        expect(result.requiredApprovals).toContain('Executive Leadership');
      }
    });

    it('should suggest appropriate security controls based on LoA', async () => {
      const teamMembers = [
        {
          id: '1',
          name: 'John Doe',
          title: 'Developer',
          trustScore: 2.0,
          skills: ['TypeScript'],
          certifications: []
        }
      ];

      const result = await recommendPrivileges({
        teamMembers,
        projectSensitivity: 'critical'
      });

      // Basic controls should always be present
      expect(result.suggestedControls).toContain('Multi-factor authentication');
      expect(result.suggestedControls).toContain('Regular access reviews');

      // Higher LoA should have more advanced controls
      if (result.recommendedLoA >= 2) {
        expect(result.suggestedControls).toContain('Session monitoring');
        expect(result.suggestedControls).toContain('Privileged access management');
      }

      if (result.recommendedLoA >= 3) {
        expect(result.suggestedControls).toContain('Behavioral analytics');
        expect(result.suggestedControls).toContain('Real-time threat detection');
      }

      if (result.recommendedLoA >= 4) {
        expect(result.suggestedControls).toContain('Zero-trust network access');
        expect(result.suggestedControls).toContain('Continuous compliance monitoring');
      }

      if (result.recommendedLoA >= 5) {
        expect(result.suggestedControls).toContain('Air-gapped environments');
        expect(result.suggestedControls).toContain('Hardware security modules');
      }
    });
  });
});
