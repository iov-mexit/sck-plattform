import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { z } from 'zod';

// Simple schema for receiving trust scores from Secure Code Warrior
const TrustScoreSignalSchema = z.object({
  did: z.string().min(1), // DID of the user
  trustScore: z.number().min(0).max(100), // Trust score from Secure Code Warrior
  organizationId: z.string().cuid().optional(), // Optional organization context
  source: z.string().default('secure-code-warrior'), // Signal source
  timestamp: z.string().optional(), // Optional timestamp
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = TrustScoreSignalSchema.parse(body);

    // Find the role agent by DID
    const roleAgent = await prisma.role_agents.findFirst({
      where: {
        assignedToDid: validatedData.did,
        ...(validatedData.organizationId && { organizationId: validatedData.organizationId }),
      },
    });

    if (!roleAgent) {
      return NextResponse.json(
        { success: false, error: 'Role agent not found for this DID' },
        { status: 404 }
      );
    }

    // Simple eligibility: trust score >= 75 means eligible for NFT
    const isEligibleForMint = validatedData.trustScore >= 75;

    // Update the role agent with the new trust score
    const updatedAgent = await prisma.role_agents.update({
      where: { id: roleAgent.id },
      data: {
        trustScore: validatedData.trustScore,
        isEligibleForMint,
        lastTrustCheck: new Date(),
      },
      include: {
        organizations: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        role_templates: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
    });

    // Record the signal
    await prisma.signals.create({
      data: {
        id: `signal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'trust_score',
        title: `Trust Score Update: ${validatedData.trustScore}%`,
        description: `Trust score received from ${validatedData.source}`,
        verified: true,
        roleAgentId: roleAgent.id,
        source: validatedData.source,
        updatedAt: new Date(),
        metadata: {
          trustScore: validatedData.trustScore,
          timestamp: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        roleAgentId: roleAgent.id,
        trustScore: updatedAgent.trustScore,
        isEligibleForMint: updatedAgent.isEligibleForMint,
        organization: updatedAgent.organizations,
        roleTemplate: updatedAgent.role_templates,
      },
    });

  } catch (error) {
    console.error('Error processing trust score signal:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid signal data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to process trust score signal' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const did = searchParams.get('did');
    const organizationId = searchParams.get('organizationId');

    if (!did) {
      return NextResponse.json(
        { success: false, error: 'DID parameter is required' },
        { status: 400 }
      );
    }

    // Find digital twin and its trust score
    const roleAgent = await prisma.role_agents.findFirst({
      where: {
        assignedToDid: did,
        ...(organizationId && { organizationId }),
      },
      select: {
        id: true,
        trustScore: true,
        isEligibleForMint: true,
        lastTrustCheck: true,
        organizations: {
          select: {
            name: true,
          },
        },
        role_templates: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!roleAgent) {
      return NextResponse.json(
        { success: false, error: 'Role agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        did,
        trustScore: roleAgent.trustScore,
        isEligibleForMint: roleAgent.isEligibleForMint,
        lastTrustCheck: roleAgent.lastTrustCheck,
        organization: roleAgent.organizations,
        roleTemplate: roleAgent.role_templates,
      },
    });

  } catch (error) {
    console.error('Error fetching trust score:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 