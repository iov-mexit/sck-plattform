import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, trustScore = 750 } = body;

    if (!organizationId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Organization ID is required',
        },
        { status: 400 }
      );
    }

    // Fetch all role templates
    const roleTemplates = await prisma.role_templates.findMany({
      where: {
        selectable: true,
      },
      orderBy: {
        title: 'asc',
      },
    });

    if (roleTemplates.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No role templates found to migrate',
        },
        { status: 404 }
      );
    }

    // Get existing role agents to avoid duplicates
    const existingAgents = await prisma.role_agents.findMany({
      where: {
        organizationId: organizationId,
      },
      select: {
        roleTemplateId: true,
      },
    });

    const existingTemplateIds = new Set(existingAgents.map(agent => agent.roleTemplateId));
    const templatesToMigrate = roleTemplates.filter(template => !existingTemplateIds.has(template.id));

    if (templatesToMigrate.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All role templates already have corresponding role agents',
        data: [],
        totalTemplates: roleTemplates.length,
        migratedCount: 0,
        skippedCount: roleTemplates.length,
      });
    }

    const createdAgents = [];

    // Create role agents from templates
    for (const template of templatesToMigrate) {
      // Generate unique DID and name for each template
      const agentDid = `did:ethr:0x${Math.random().toString(16).substr(2, 40)}`;
      const agentName = `${template.title} Role Agent`;

      // Determine if eligible for minting based on trust score
      const isEligibleForMint = trustScore >= 750;

      try {
        const roleAgent = await prisma.role_agents.create({
          data: {
            id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: agentName,
            description: `Role agent for ${template.title} role - ${template.focus}`,
            assignedToDid: agentDid,
            trustScore: trustScore,
            isEligibleForMint,
            lastTrustCheck: new Date(),
            status: 'active',
            level: 1,
            organizationId: organizationId,
            roleTemplateId: template.id,
            updatedAt: new Date(),
          },
          include: {
            role_templates: true,
            organizations: true,
          },
        });

        createdAgents.push(roleAgent);
      } catch (error) {
        console.error(`Error creating role agent for template ${template.title}:`, error);
        // Continue with other templates even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${createdAgents.length} role templates to role agents`,
      data: createdAgents,
      totalTemplates: roleTemplates.length,
      migratedCount: createdAgents.length,
      skippedCount: existingTemplateIds.size,
    });
  } catch (error) {
    console.error('Error migrating role templates to role agents:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to migrate role templates to role agents',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 