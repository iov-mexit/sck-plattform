import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const CreateRoleAgentSchema = z.object({
  organizationId: z.string(),
  roleTemplateId: z.string(),
  assignedToDid: z.string().min(1, 'DID is required'),
  name: z.string().optional(),
  description: z.string().optional(),
  trustScore: z.number().min(0).max(1000).optional(),
  nftOptions: z.object({
    autoMintIfEligible: z.boolean().optional(),
    addToReviewQueue: z.boolean().optional(),
  }).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const whereClause = organizationId ? { organizationId } : {};

    const [roleAgents, total] = await Promise.all([
      prisma.role_agents.findMany({
        where: whereClause,
        include: {
          organizations: true,
          role_templates: true,
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.role_agents.count({ where: whereClause }),
    ]);

    // Map database results to include computed fields for frontend compatibility
    const mappedRoleAgents = roleAgents.map(agent => ({
      ...agent,
      nftMinted: !!agent.soulboundTokenId,
      assignedDid: agent.assignedToDid, // Legacy compatibility
      organization: agent.organizations, // Map snake_case to camelCase for frontend
      roleTemplate: agent.role_templates, // Map snake_case to camelCase for frontend
    }));

    return NextResponse.json({
      success: true,
      data: mappedRoleAgents,
      count: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching role agents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch role agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateRoleAgentSchema.parse(body);

    // Check for duplicate DID
    const existingRoleAgent = await prisma.role_agents.findFirst({
      where: {
        assignedToDid: validatedData.assignedToDid,
      },
      include: {
        organizations: true,
      },
    });

    if (existingRoleAgent) {
      return NextResponse.json(
        {
          success: false,
          error: 'DUPLICATE_DID',
          message: `A role agent with DID "${validatedData.assignedToDid}" already exists.`,
          existingRoleAgent: {
            id: existingRoleAgent.id,
            name: existingRoleAgent.name,
            organizationId: existingRoleAgent.organizationId,
            roleTemplateId: existingRoleAgent.roleTemplateId,
          },
        },
        { status: 409 } // Conflict status code
      );
    }

    // Simple eligibility: if trust score is provided and >= 750, eligible for NFT (75% of 1000)
    const isEligibleForMint = validatedData.trustScore ? validatedData.trustScore >= 750 : false;

    console.log('Creating role agent with validated data:', {
      organizationId: validatedData.organizationId,
      roleTemplateId: validatedData.roleTemplateId,
      assignedToDid: validatedData.assignedToDid,
      trustScore: validatedData.trustScore,
      isEligibleForMint,
      nftOptions: validatedData.nftOptions,
    });

    // Generate a unique ID
    const uniqueId = `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create role agent with DID only - manually provide the id
    const roleAgent = await prisma.role_agents.create({
      data: {
        id: uniqueId,
        organizationId: validatedData.organizationId,
        roleTemplateId: validatedData.roleTemplateId,
        assignedToDid: validatedData.assignedToDid, // DID only, no PII
        trustScore: validatedData.trustScore, // From Secure Code Warrior signal
        isEligibleForMint,
        lastTrustCheck: validatedData.trustScore ? new Date() : null,
        name: validatedData.name || `Role Agent ${Date.now()}`,
        description: validatedData.description,
        updatedAt: new Date(),
      },
    });

    console.log('Role agent created successfully:', roleAgent);

    // Handle NFT minting options
    const nftMinted = false; // Default value since field doesn't exist in schema
    const nftTokenId = roleAgent.soulboundTokenId || null;
    const nftTransactionHash = null; // Field doesn't exist in schema

    if (validatedData.nftOptions?.autoMintIfEligible && isEligibleForMint) {
      // Auto-mint NFT if eligible
      console.log('Auto-minting NFT for eligible role agent');
      // TODO: Implement auto-minting logic here
      // This would call the NFT minting API automatically
    }

    if (validatedData.nftOptions?.addToReviewQueue) {
      // Add to review queue (could be a separate table or field)
      console.log('Adding role agent to NFT review queue');
      // TODO: Implement review queue logic
    }

    return NextResponse.json({
      success: true,
      data: {
        ...roleAgent,
        nftMinted,
        nftTokenId,
        nftTransactionHash,
      },
    });
  } catch (error) {
    console.error('Error creating role agent:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create role agent' },
      { status: 500 }
    );
  }
} 