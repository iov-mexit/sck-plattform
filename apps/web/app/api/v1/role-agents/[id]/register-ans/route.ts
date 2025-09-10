import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';
import { registerToANS, generateRoleAgentName, assignLevel, getQualificationLevel, getTrustLevel } from '@/lib/domains';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {

    // Fetch the role agent
    const roleAgent = await prisma.roleAgent.findUnique({
      where: { id },
      include: {
        roleTemplate: true,
        organization: true,
      },
    });

    if (!roleAgent) {
      return NextResponse.json(
        { success: false, error: 'Role agent not found' },
        { status: 404 }
      );
    }

    // Generate ANS identifier and qualification level
    const level = assignLevel(roleAgent.trustScore || 0);
    const qualificationLevel = getQualificationLevel(roleAgent.trustScore || 0, level);
    const roleName = generateRoleAgentName(roleAgent.roleTemplate.title, level);
    const ansIdentifier = `${level}-${roleName}.${roleAgent.organization.domain}.knaight`;

    // Build ANS registration payload
    const ansPayload = {
      ansId: ansIdentifier,
      did: roleAgent.assignedToDid || `did:web:${roleAgent.organization.domain}:${roleAgent.id}`,
      role: roleAgent.roleTemplate.title,
      level,
      qualificationLevel,
      organization: roleAgent.organization.name,
      trustLevel: getTrustLevel(roleAgent.trustScore || 0),
      verificationEndpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/role-agents/${roleAgent.id}/verify`,
      publicMetadata: {
        role: roleAgent.roleTemplate.title,
        level,
        qualificationLevel,
        organization: roleAgent.organization.name,
        trustScore: roleAgent.trustScore || 0,
        lastUpdated: new Date().toISOString()
      }
    };

    // Register to ANS
    const ansResult = await registerToANS(ansPayload);

    if (ansResult.success) {
      // Update role agent with ANS registration info
      await prisma.roleAgent.update({
        where: { id },
        data: {
          ansIdentifier,
          ansRegistrationStatus: 'SYNCED',
          ansVerificationUrl: `https://knaight.site/api/v1/verify/${ansIdentifier}`,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Role agent registered to ANS successfully',
        data: {
          ansIdentifier,
          verificationUrl: `https://knaight.site/api/v1/verify/${ansIdentifier}`,
          status: 'registered',
        },
      });
    } else {
      // Update role agent with failed status
      await prisma.roleAgent.update({
        where: { id },
        data: {
          ansIdentifier,
          ansRegistrationStatus: 'ERROR',
          ansRegistrationError: ansResult.error || 'Unknown error',
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to register to ANS',
          details: ansResult.error
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error registering role agent to ANS:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 