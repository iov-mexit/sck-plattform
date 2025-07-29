import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received body:', body);

    // Check if organization exists
    const organization = await prisma.organizations.findUnique({
      where: { id: body.organizationId },
    });

    console.log('Organization found:', organization);

    if (!organization) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Check if role template exists
    const roleTemplate = await prisma.role_templates.findUnique({
      where: { id: body.roleTemplateId },
    });

    console.log('Role template found:', roleTemplate);

    if (!roleTemplate) {
      return NextResponse.json(
        { success: false, error: 'Role template not found' },
        { status: 404 }
      );
    }

    // Simple eligibility: if trust score is provided and >= 75, eligible for NFT
    const isEligibleForMint = body.trustScore ? body.trustScore >= 75 : false;

    console.log('Creating digital twin with data:', {
      organizationId: body.organizationId,
      roleTemplateId: body.roleTemplateId,
      assignedToDid: body.assignedToDid,
      trustScore: body.trustScore,
      isEligibleForMint,
    });

    // Create digital twin with DID only
    const digitalTwin = await prisma.digital_twins.create({
      data: {
        id: `twin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        organizationId: body.organizationId,
        roleTemplateId: body.roleTemplateId,
        assignedToDid: body.assignedToDid,
        trustScore: body.trustScore,
        isEligibleForMint,
        lastTrustCheck: body.trustScore ? new Date() : null,
        name: body.name || `Digital Twin ${Date.now()}`,
        updatedAt: new Date(),
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

    console.log('Digital twin created:', digitalTwin);

    return NextResponse.json({
      success: true,
      data: {
        id: digitalTwin.id,
        name: digitalTwin.name,
        assignedToDid: digitalTwin.assignedToDid,
        trustScore: digitalTwin.trustScore,
        isEligibleForMint: digitalTwin.isEligibleForMint,
        organization: digitalTwin.organizations,
        roleTemplate: digitalTwin.role_templates,
        createdAt: digitalTwin.createdAt,
      }
    });

  } catch (error) {
    console.error('Error creating digital twin:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 