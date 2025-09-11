import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma before importing the module
vi.mock('@/lib/prisma', () => ({
  prisma: {
    roleAgent: {
      findMany: vi.fn()
    }
  }
}));

import { suggestTeam } from '../team/suggester';
import { prisma } from '@/lib/prisma';

describe('Team Suggester', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('suggestTeam', () => {
    it('should return team suggestions with skill matching', async () => {
      // Mock role agents data
      const mockAgents = [
        {
          id: 'agent-1',
          name: 'John Doe',
          isActive: true,
          organizationId: 'default-org',
          trustScore: 4,
          roleTemplate: {
            title: 'Senior Developer',
            category: 'Engineering',
            skills: ['TypeScript', 'React', 'Node.js']
          },
          certifications: [
            { name: 'AWS Certified', issuer: 'Amazon', trustScore: 4 }
          ]
        },
        {
          id: 'agent-2',
          name: 'Jane Smith',
          isActive: true,
          organizationId: 'default-org',
          trustScore: 3,
          roleTemplate: {
            title: 'Security Engineer',
            category: 'Security',
            skills: ['Security', 'Compliance', 'Python']
          },
          certifications: [
            { name: 'CISSP', issuer: 'ISC2', trustScore: 5 }
          ]
        },
        {
          id: 'agent-3',
          name: 'Bob Wilson',
          isActive: true,
          organizationId: 'default-org',
          trustScore: 2,
          roleTemplate: {
            title: 'Junior Developer',
            category: 'Engineering',
            skills: ['JavaScript', 'HTML', 'CSS']
          },
          certifications: []
        }
      ];

      vi.mocked(prisma.roleAgent.findMany).mockResolvedValue(mockAgents as any);

      const phase = {
        phaseName: 'Implementation',
        requiredSkills: {
          skills: ['TypeScript', 'Security'],
          trustMin: 3,
          maxTeamSize: 2
        }
      };

      const result = await suggestTeam(phase);

      expect(result).toBeDefined();
      expect(result.suggestions).toHaveLength(2);
      expect(result.suggestions[0].name).toBe('John Doe');
      expect(result.suggestions[1].name).toBe('Jane Smith');
      expect(result.gaps).toEqual([]);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.rationale).toContain('Suggested team');
    });

    it('should identify skill gaps when requirements not met', async () => {
      const mockAgents = [
        {
          id: 'agent-1',
          name: 'John Doe',
          isActive: true,
          organizationId: 'default-org',
          trustScore: 4,
          roleTemplate: {
            title: 'Frontend Developer',
            category: 'Engineering',
            skills: ['JavaScript', 'React']
          },
          certifications: []
        }
      ];

      vi.mocked(prisma.roleAgent.findMany).mockResolvedValue(mockAgents as any);

      const phase = {
        phaseName: 'Security Audit',
        requiredSkills: {
          skills: ['GoLang', 'Kubernetes', 'Security'],
          trustMin: 3,
          maxTeamSize: 5
        }
      };

      const result = await suggestTeam(phase);

      expect(result.suggestions).toHaveLength(0);
      expect(result.gaps).toEqual(['GoLang', 'Kubernetes', 'Security']);
      expect(result.confidence).toBe(0);
    });

    it('should filter by trust score requirements', async () => {
      const mockAgents = [
        {
          id: 'agent-1',
          name: 'John Doe',
          isActive: true,
          organizationId: 'default-org',
          trustScore: 2,
          roleTemplate: {
            title: 'Developer',
            category: 'Engineering',
            skills: ['TypeScript', 'React']
          },
          certifications: []
        },
        {
          id: 'agent-2',
          name: 'Jane Smith',
          isActive: true,
          organizationId: 'default-org',
          trustScore: 4,
          roleTemplate: {
            title: 'Senior Developer',
            category: 'Engineering',
            skills: ['TypeScript', 'React']
          },
          certifications: []
        }
      ];

      vi.mocked(prisma.roleAgent.findMany).mockResolvedValue(mockAgents as any);

      const phase = {
        phaseName: 'Critical Implementation',
        requiredSkills: {
          skills: ['TypeScript'],
          trustMin: 3,
          maxTeamSize: 5
        }
      };

      const result = await suggestTeam(phase);

      expect(result.suggestions).toHaveLength(1);
      expect(result.suggestions[0].name).toBe('Jane Smith');
      expect(result.suggestions[0].trustScore).toBe(4);
    });

    it('should respect max team size limit', async () => {
      const mockAgents = Array.from({ length: 10 }, (_, i) => ({
        id: `agent-${i}`,
        name: `Agent ${i}`,
        isActive: true,
        organizationId: 'default-org',
        trustScore: 4,
        roleTemplate: {
          title: 'Developer',
          category: 'Engineering',
          skills: ['TypeScript', 'React']
        },
        certifications: []
      }));

      vi.mocked(prisma.roleAgent.findMany).mockResolvedValue(mockAgents as any);

      const phase = {
        phaseName: 'Implementation',
        requiredSkills: {
          skills: ['TypeScript'],
          trustMin: 3,
          maxTeamSize: 3
        }
      };

      const result = await suggestTeam(phase);

      expect(result.suggestions).toHaveLength(3);
    });

    it('should calculate skill match scores correctly', async () => {
      const mockAgents = [
        {
          id: 'agent-1',
          name: 'John Doe',
          isActive: true,
          organizationId: 'default-org',
          trustScore: 4,
          roleTemplate: {
            title: 'Full Stack Developer',
            category: 'Engineering',
            skills: ['TypeScript', 'React', 'Node.js', 'Python']
          },
          certifications: []
        }
      ];

      vi.mocked(prisma.roleAgent.findMany).mockResolvedValue(mockAgents as any);

      const phase = {
        phaseName: 'Implementation',
        requiredSkills: {
          skills: ['TypeScript', 'React', 'GoLang'],
          trustMin: 3,
          maxTeamSize: 5
        }
      };

      const result = await suggestTeam(phase);

      expect(result.suggestions).toHaveLength(1);
      expect(result.suggestions[0].skillMatchScore).toBe(2 / 3); // 2 out of 3 skills matched
      expect(result.gaps).toContain('GoLang');
    });

    it('should handle empty agent list gracefully', async () => {
      vi.mocked(prisma.roleAgent.findMany).mockResolvedValue([] as any);

      const phase = {
        phaseName: 'Implementation',
        requiredSkills: {
          skills: ['TypeScript'],
          trustMin: 3,
          maxTeamSize: 5
        }
      };

      const result = await suggestTeam(phase);

      expect(result.suggestions).toHaveLength(0);
      expect(result.gaps).toEqual(['TypeScript']);
      expect(result.confidence).toBe(0);
    });

    it('should throw error when database query fails', async () => {
      vi.mocked(prisma.roleAgent.findMany).mockRejectedValue(new Error('Database connection failed'));

      const phase = {
        phaseName: 'Implementation',
        requiredSkills: {
          skills: ['TypeScript'],
          trustMin: 3,
          maxTeamSize: 5
        }
      };

      await expect(suggestTeam(phase)).rejects.toThrow('Failed to suggest team: Database connection failed');
    });
  });
});
