import { prisma } from "@/lib/prisma";

export interface TeamSuggestion {
  id: string;
  name: string;
  title: string;
  category: string;
  skills: string[];
  certifications: any[];
  trustScore: number;
  skillMatchScore: number;
  availability: 'available' | 'busy' | 'unknown';
}

export interface TeamSuggestionResult {
  suggestions: TeamSuggestion[];
  gaps: string[];
  confidence: number;
  rationale: string;
}

export async function suggestTeam(phase: any): Promise<TeamSuggestionResult> {
  try {
    const requirements = phase.requiredSkills as {
      skills: string[];
      trustMin: number;
      maxTeamSize?: number;
      preferredRoles?: string[];
    };

    // Get all active role agents with their templates and certifications
    const agents = await prisma.roleAgent.findMany({
      where: {
        status: 'active',
        organizationId: 'default-org' // TODO: Get from auth context
      },
      include: {
        roleTemplate: true,
        certifications: {
          select: {
            name: true,
            issuer: true
          }
        }
      }
    });

    // Calculate skill match scores for each agent
    const scoredAgents = agents.map(agent => {
      const agentSkills: string[] = [
        ...((agent.roleTemplate as any)?.skills || []),
        ...(agent.roleTemplate?.title ? [agent.roleTemplate.title] : []),
        ...(agent.roleTemplate?.category ? [agent.roleTemplate.category] : []),
        ...((agent as any).certifications?.map((c: any) => c.name) || [])
      ];

      const skillMatches = requirements.skills.filter(skill =>
        agentSkills.some(agentSkill =>
          agentSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );

      const skillMatchScore = skillMatches.length / requirements.skills.length;
      const trustOk = (agent.trustScore ?? 0) >= (requirements.trustMin || 0);

      return {
        id: agent.id,
        name: agent.name,
        title: agent.roleTemplate?.title || 'Unknown Role',
        category: agent.roleTemplate?.category || 'General',
        skills: agentSkills,
        certifications: (agent as any).certifications || [],
        trustScore: agent.trustScore ?? 0,
        skillMatchScore,
        availability: 'available' as const, // TODO: Implement real availability checking
        meetsTrustRequirement: trustOk,
        matchedSkills: skillMatches
      };
    });

    // Filter agents that meet minimum requirements
    const eligibleAgents = scoredAgents.filter(agent =>
      agent.skillMatchScore > 0 && agent.meetsTrustRequirement
    );

    // Sort by skill match score and trust score
    const sortedAgents = eligibleAgents.sort((a, b) => {
      if (a.skillMatchScore !== b.skillMatchScore) {
        return b.skillMatchScore - a.skillMatchScore;
      }
      return b.trustScore - a.trustScore;
    });

    // Limit team size if specified
    const maxSize = requirements.maxTeamSize || 5;
    const selectedAgents = sortedAgents.slice(0, maxSize);

    // Identify skill gaps
    const coveredSkills = new Set<string>();
    selectedAgents.forEach(agent => {
      agent.matchedSkills.forEach(skill => coveredSkills.add(skill));
    });

    const gaps = requirements.skills.filter(skill => !coveredSkills.has(skill));

    // Calculate overall confidence
    const avgSkillMatch = selectedAgents.length > 0
      ? selectedAgents.reduce((sum, agent) => sum + agent.skillMatchScore, 0) / selectedAgents.length
      : 0;

    const avgTrustScore = selectedAgents.length > 0
      ? selectedAgents.reduce((sum, agent) => sum + agent.trustScore, 0) / selectedAgents.length
      : 0;

    const confidence = (avgSkillMatch * 0.7) + (Math.min(avgTrustScore / 5, 1) * 0.3);

    // Generate rationale
    const rationale = generateRationale(selectedAgents, gaps, confidence, requirements);

    return {
      suggestions: selectedAgents,
      gaps,
      confidence,
      rationale
    };
  } catch (error) {
    console.error("Error in suggestTeam:", error);
    throw new Error(`Failed to suggest team: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function generateRationale(
  agents: any[],
  gaps: string[],
  confidence: number,
  requirements: any
): string {
  const teamSize = agents.length;
  const avgTrust = agents.length > 0
    ? agents.reduce((sum, agent) => sum + agent.trustScore, 0) / agents.length
    : 0;

  let rationale = `Suggested team of ${teamSize} members with average trust score ${avgTrust.toFixed(1)}/5. `;

  if (gaps.length === 0) {
    rationale += "All required skills are covered by the team.";
  } else {
    rationale += `Missing skills: ${gaps.join(', ')}. Consider additional training or external consultants.`;
  }

  if (confidence > 0.8) {
    rationale += " High confidence in team composition.";
  } else if (confidence > 0.6) {
    rationale += " Moderate confidence - consider reviewing skill gaps.";
  } else {
    rationale += " Low confidence - significant skill gaps or trust mismatches.";
  }

  return rationale;
}

export async function getTeamComposition(compositionId: string) {
  try {
    const composition = await prisma.teamComposition.findUnique({
      where: { id: compositionId },
      include: {
        organization: {
          select: {
            name: true,
            domain: true
          }
        }
      }
    });

    if (!composition) {
      throw new Error("Team composition not found");
    }

    return composition;
  } catch (error) {
    console.error("Error fetching team composition:", error);
    throw new Error(`Failed to fetch team composition: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
