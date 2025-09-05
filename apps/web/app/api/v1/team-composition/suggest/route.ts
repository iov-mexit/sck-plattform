import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, projectPhase, requiredSkills, trustMinLevel = 3, teamSize = 5 } = body;

    if (!organizationId || !projectPhase || !requiredSkills) {
      return NextResponse.json({ 
        error: 'Organization ID, project phase, and required skills are required' 
      }, { status: 400 });
    }

    // Get all role agents in the organization with their skills and trust scores
    const roleAgents = await prisma.roleAgent.findMany({
      where: {
        organizationId,
        status: 'active',
        trustScore: { gte: trustMinLevel * 100 } // Convert level to trust score
      },
      include: {
        roleTemplate: {
          select: { title: true, focus: true, category: true }
        },
        certifications: {
          select: { name: true, issuer: true, verified: true }
        },
        signals: {
          select: { type: true, title: true, value: true, verified: true }
        }
      }
    });

    // Extract skills from role templates, certifications, and signals
    const agentsWithSkills = roleAgents.map(agent => {
      const skills = new Set<string>();
      
      // Add role template skills
      if (agent.roleTemplate.focus) {
        skills.add(agent.roleTemplate.focus.toLowerCase());
      }
      if (agent.roleTemplate.category) {
        skills.add(agent.roleTemplate.category.toLowerCase());
      }
      
      // Add certification skills
      agent.certifications.forEach(cert => {
        if (cert.verified) {
          skills.add(cert.name.toLowerCase());
          skills.add(cert.issuer.toLowerCase());
        }
      });
      
      // Add signal-based skills
      agent.signals.forEach(signal => {
        if (signal.verified && signal.value && signal.value > 0.7) {
          skills.add(signal.title.toLowerCase());
        }
      });

      return {
        ...agent,
        skills: Array.from(skills),
        skillMatchCount: 0,
        skillMatchScore: 0
      };
    });

    // Calculate skill matching scores
    const requiredSkillsLower = requiredSkills.map((skill: string) => skill.toLowerCase());
    
    agentsWithSkills.forEach(agent => {
      let matchCount = 0;
      let totalScore = 0;
      
      requiredSkillsLower.forEach(requiredSkill => {
        agent.skills.forEach(agentSkill => {
          if (agentSkill.includes(requiredSkill) || requiredSkill.includes(agentSkill)) {
            matchCount++;
            totalScore += 1;
          }
        });
      });
      
      agent.skillMatchCount = matchCount;
      agent.skillMatchScore = totalScore / requiredSkills.length;
    });

    // Sort by skill match score and trust score
    const sortedAgents = agentsWithSkills
      .filter(agent => agent.skillMatchCount > 0)
      .sort((a, b) => {
        // Primary sort: skill match score
        if (a.skillMatchScore !== b.skillMatchScore) {
          return b.skillMatchScore - a.skillMatchScore;
        }
        // Secondary sort: trust score
        return (b.trustScore || 0) - (a.trustScore || 0);
      });

    // Select top agents for the team
    const suggestedTeam = sortedAgents.slice(0, teamSize);
    
    // Identify skill gaps
    const coveredSkills = new Set<string>();
    suggestedTeam.forEach(agent => {
      agent.skills.forEach(skill => {
        coveredSkills.add(skill);
      });
    });
    
    const gaps = requiredSkillsLower.filter(skill => 
      !Array.from(coveredSkills).some(coveredSkill => 
        coveredSkill.includes(skill) || skill.includes(coveredSkill)
      )
    );

    // Create team composition record
    const composition = await prisma.teamComposition.create({
      data: {
        organizationId,
        projectPhase,
        requirements: {
          skills: requiredSkills,
          trustMinLevel,
          teamSize
        },
        suggestedTeam: suggestedTeam.map(agent => ({
          id: agent.id,
          name: agent.name,
          role: agent.roleTemplate.title,
          trustScore: agent.trustScore,
          skillMatchScore: agent.skillMatchScore,
          skills: agent.skills
        })),
        gaps: gaps.length > 0 ? { missingSkills: gaps } : null
      },
      include: {
        organization: {
          select: { name: true, domain: true }
        }
      }
    });

    return NextResponse.json({ 
      composition,
      suggestedTeam: suggestedTeam.map(agent => ({
        id: agent.id,
        name: agent.name,
        role: agent.roleTemplate.title,
        trustScore: agent.trustScore,
        skillMatchScore: agent.skillMatchScore,
        skills: agent.skills,
        certifications: agent.certifications.length,
        signals: agent.signals.length
      })),
      gaps: gaps.length > 0 ? gaps : null,
      totalCandidates: roleAgents.length,
      qualifiedCandidates: agentsWithSkills.filter(a => a.skillMatchCount > 0).length
    });

  } catch (error) {
    console.error('Error suggesting team composition:', error);
    return NextResponse.json({ error: 'Failed to suggest team composition' }, { status: 500 });
  }
}
