import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Privacy-by-design: Trust validation without PII
const TrustValidationSchema = z.object({
  digitalTwinId: z.string().cuid(),
  roleTitle: z.string().min(1),
  trustScore: z.number().min(0).max(100),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = TrustValidationSchema.parse(body);

    // Privacy: Verify digital twin exists
    const digitalTwin = await prisma.digitalTwin.findUnique({
      where: { id: validatedData.digitalTwinId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            domain: true,
          },
        },
        roleTemplate: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
    });

    if (!digitalTwin) {
      return NextResponse.json(
        { error: 'Digital twin not found' },
        { status: 404 }
      );
    }

    // Get trust threshold for the role
    const trustThreshold = await prisma.roleTrustThreshold.findFirst({
      where: {
        organizationId: digitalTwin.organizationId,
        roleTitle: validatedData.roleTitle,
        isActive: true,
      },
    });

    const requiredScore = trustThreshold?.minTrustScore || 75;
    const isValid = validatedData.trustScore >= requiredScore;

    // Update digital twin trust score if valid
    if (isValid) {
      await prisma.digitalTwin.update({
        where: { id: validatedData.digitalTwinId },
        data: {
          trustScore: validatedData.trustScore,
          isEligibleForMint: true,
          lastTrustCheck: new Date(),
        },
      });
    }

    // Generate recommendations based on trust score
    const recommendations = generateRecommendations(
      validatedData.trustScore,
      requiredScore,
      digitalTwin.roleTemplate.category
    );

    // Audit log (privacy-compliant)
    await prisma.auditLog.create({
      data: {
        action: 'validate_trust',
        entity: 'digital_twin',
        entityId: validatedData.digitalTwinId,
        metadata: {
          roleTitle: validatedData.roleTitle,
          trustScore: validatedData.trustScore,
          requiredScore,
          isValid,
          organizationId: digitalTwin.organizationId,
        },
      },
    });

    return NextResponse.json({
      isValid,
      requiredScore,
      currentScore: validatedData.trustScore,
      isEligibleForMint: isValid,
      recommendations,
      digitalTwin: {
        id: digitalTwin.id,
        assignedToDid: digitalTwin.assignedToDid,
        organization: digitalTwin.organization,
        roleTemplate: digitalTwin.roleTemplate,
      },
    });

  } catch (error) {
    console.error('Error validating trust:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate trust score recommendations
function generateRecommendations(
  currentScore: number,
  requiredScore: number,
  category: string
): string[] {
  const recommendations: string[] = [];

  if (currentScore < requiredScore) {
    const gap = requiredScore - currentScore;

    recommendations.push(`Trust score needs ${gap} points to meet requirements`);

    // Category-specific recommendations
    switch (category) {
      case 'Product':
        recommendations.push('Complete product management certifications');
        recommendations.push('Contribute to open source projects');
        recommendations.push('Publish technical articles or blogs');
        break;
      case 'Design':
        recommendations.push('Complete UX/UI design courses');
        recommendations.push('Build portfolio of design work');
        recommendations.push('Participate in design communities');
        break;
      case 'QA':
        recommendations.push('Obtain testing certifications (ISTQB, etc.)');
        recommendations.push('Contribute to testing frameworks');
        recommendations.push('Write testing documentation');
        break;
      case 'Architecture':
        recommendations.push('Complete architecture certifications');
        recommendations.push('Design and document system architectures');
        recommendations.push('Mentor junior developers');
        break;
      case 'Solution Design':
        recommendations.push('Complete solution architecture courses');
        recommendations.push('Design end-to-end solutions');
        recommendations.push('Present at technical conferences');
        break;
      default:
        recommendations.push('Complete relevant certifications');
        recommendations.push('Contribute to open source projects');
        recommendations.push('Build a strong professional network');
    }
  } else {
    recommendations.push('Trust score meets requirements');
    recommendations.push('Consider pursuing advanced certifications');
    recommendations.push('Mentor others to build leadership skills');
  }

  return recommendations;
}

// Get trust statistics for organization
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Privacy: Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Get trust statistics (aggregated, no PII)
    const [
      totalTwins,
      eligibleTwins,
      averageTrustScore,
      trustThresholds,
    ] = await Promise.all([
      prisma.digitalTwin.count({
        where: { organizationId },
      }),
      prisma.digitalTwin.count({
        where: {
          organizationId,
          isEligibleForMint: true,
        },
      }),
      prisma.digitalTwin.aggregate({
        where: { organizationId },
        _avg: { trustScore: true },
      }),
      prisma.roleTrustThreshold.findMany({
        where: {
          organizationId,
          isActive: true,
        },
        select: {
          roleTitle: true,
          minTrustScore: true,
        },
      }),
    ]);

    return NextResponse.json({
      organization: {
        id: organization.id,
        name: organization.name,
        domain: organization.domain,
      },
      statistics: {
        totalDigitalTwins: totalTwins,
        eligibleForMint: eligibleTwins,
        averageTrustScore: averageTrustScore._avg.trustScore || 0,
        eligibilityRate: totalTwins > 0 ? (eligibleTwins / totalTwins) * 100 : 0,
      },
      trustThresholds,
    });

  } catch (error) {
    console.error('Error fetching trust statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 