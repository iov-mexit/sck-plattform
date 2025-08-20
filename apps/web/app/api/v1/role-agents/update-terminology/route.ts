import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting terminology update for existing role agents...');

    // Find all role agents with "Digital Twin" in their name or description
    const roleAgentsToUpdate = await prisma.role_agents.findMany({
      where: {
        OR: [
          {
            name: {
              contains: 'Digital Twin',
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: 'Digital twin',
              mode: 'insensitive'
            }
          }
        ]
      }
    });

    console.log(`Found ${roleAgentsToUpdate.length} role agents to update`);

    let updatedCount = 0;

    // Update each role agent
    for (const agent of roleAgentsToUpdate) {
      const updatedName = agent.name?.replace(/Digital Twin/gi, 'Role Agent') || agent.name;
      const updatedDescription = agent.description?.replace(/Digital twin/gi, 'Role agent') || agent.description;

      await prisma.role_agents.update({
        where: { id: agent.id },
        data: {
          name: updatedName,
          description: updatedDescription,
          updatedAt: new Date()
        }
      });

      updatedCount++;
      console.log(`Updated agent ${agent.id}: "${agent.name}" -> "${updatedName}"`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated terminology for ${updatedCount} role agents`,
      updatedCount,
      totalFound: roleAgentsToUpdate.length
    });

  } catch (error) {
    console.error('Error updating role agent terminology:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update terminology',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 