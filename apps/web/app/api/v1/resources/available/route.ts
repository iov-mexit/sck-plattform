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
      status: 'active'
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
            category: true
          }
        },
        certifications: {
          select: {
            name: true,
            issuer: true
          }
        }
      },
      orderBy: { trustScore: 'desc' }
    });

    // Filter by skills if provided
    const filteredResources = skills.length > 0
      ? resources.filter((agent: any) => {
        const agentSkills: string[] = [
          ...(agent.roleTemplate?.title ? [agent.roleTemplate.title] : []),
          ...(agent.roleTemplate?.category ? [agent.roleTemplate.category] : []),
          ...((agent.certifications || []).map((c: any) => c.name))
        ];
        return skills.some((skill: string) =>
          agentSkills.some((agentSkill: string) =>
            agentSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      })
      : resources;

    return NextResponse.json({
      success: true,
      resources: filteredResources.map((agent: any) => ({
        id: agent.id,
        name: agent.name,
        title: agent.roleTemplate?.title || 'Unknown Role',
        category: agent.roleTemplate?.category || 'General',
        skills: [],
        certifications: agent.certifications || [],
        trustScore: agent.trustScore ?? 0,
        status: agent.status,
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
