import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId') || 'default-org';
    const skills = searchParams.get('skills')?.split(',') || [];
    const minTrust = searchParams.get('minTrust') ? parseInt(searchParams.get('minTrust')!) : 0;

    // Build where clause
    const where: any = {
      organizationId,
      isActive: true
    };

    if (minTrust > 0) {
      where.trustScore = { gte: minTrust };
    }

    // Get role agents with their templates and certifications
    const resources = await prisma.roleAgent.findMany({
      where,
      include: {
        roleTemplate: {
          select: {
            title: true,
            category: true,
            skills: true
          }
        },
        certifications: {
          select: {
            name: true,
            issuer: true,
            trustScore: true
          }
        }
      },
      orderBy: { trustScore: 'desc' }
    });

    // Filter by skills if provided
    const filteredResources = skills.length > 0
      ? resources.filter(agent => {
        const agentSkills = [
          ...(agent.roleTemplate?.skills || []),
          ...(agent.certifications?.map(c => c.name) || [])
        ];
        return skills.some(skill =>
          agentSkills.some(agentSkill =>
            agentSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      })
      : resources;

    return NextResponse.json({
      success: true,
      resources: filteredResources.map(agent => ({
        id: agent.id,
        name: agent.name,
        title: agent.roleTemplate?.title || 'Unknown Role',
        category: agent.roleTemplate?.category || 'General',
        skills: agent.roleTemplate?.skills || [],
        certifications: agent.certifications || [],
        trustScore: agent.trustScore,
        isActive: agent.isActive,
        createdAt: agent.createdAt
      })),
      total: filteredResources.length,
      filters: {
        organizationId,
        skills,
        minTrust
      }
    });
  } catch (error) {
    console.error("Failed to fetch available resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch available resources" },
      { status: 500 }
    );
  }
}
