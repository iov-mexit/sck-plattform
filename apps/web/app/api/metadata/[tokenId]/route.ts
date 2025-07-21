import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/metadata/[tokenId] - Serve NFT metadata for tokenURI
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  try {
    const { tokenId } = await params;

    // Find the digital twin by soulboundTokenId
    const digitalTwin = await prisma.digitalTwin.findFirst({
      where: { soulboundTokenId: tokenId },
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
            focus: true,
          },
        },
        signals: {
          where: { verified: true },
          select: {
            id: true,
            type: true,
            title: true,
            value: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        certifications: {
          where: { verified: true },
          select: {
            id: true,
            name: true,
            issuer: true,
            issuedAt: true,
            expiresAt: true,
          },
          orderBy: { issuedAt: 'desc' },
          take: 3,
        },
      },
    });

    if (!digitalTwin) {
      return NextResponse.json(
        { error: 'Digital twin not found' },
        { status: 404 }
      );
    }

    // Calculate level based on signals and certifications
    const totalValue = digitalTwin.signals.reduce((sum, signal) => sum + (signal.value || 0), 0);
    const certificationCount = digitalTwin.certifications.length;
    const signalCount = digitalTwin.signals.length;

    // Level calculation: base level + achievements
    const calculatedLevel = Math.min(10, Math.max(1,
      digitalTwin.level +
      Math.floor(totalValue / 100) +
      certificationCount +
      Math.floor(signalCount / 5)
    ));

    // Build metadata object (privacy-first, no PII)
    const metadata = {
      name: `Digital Twin #${tokenId}`,
      description: `Secure Code KnAIght Digital Twin for ${digitalTwin.roleTemplate.title} role`,
      image: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/nft-image/${tokenId}`,
      external_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/digital-twin/${digitalTwin.id}`,
      attributes: [
        {
          trait_type: 'Role',
          value: digitalTwin.roleTemplate.title,
        },
        {
          trait_type: 'Category',
          value: digitalTwin.roleTemplate.category,
        },
        {
          trait_type: 'Focus',
          value: digitalTwin.roleTemplate.focus,
        },
        {
          trait_type: 'Level',
          value: calculatedLevel,
          max_value: 10,
        },
        {
          trait_type: 'Status',
          value: digitalTwin.status,
        },
        {
          trait_type: 'Network',
          value: digitalTwin.blockchainNetwork || 'ethereum',
        },
        {
          trait_type: 'Organization',
          value: digitalTwin.organization.name,
        },
        {
          trait_type: 'Signals Count',
          value: signalCount,
        },
        {
          trait_type: 'Certifications Count',
          value: certificationCount,
        },
        {
          trait_type: 'Total Achievement Value',
          value: totalValue,
        },
      ],
      properties: {
        files: [
          {
            uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/nft-image/${tokenId}`,
            type: 'image/png',
          },
        ],
        category: 'image',
        did: digitalTwin.assignedToDid,
        blockchain_address: digitalTwin.blockchainAddress,
        organization_id: digitalTwin.organizationId,
        role_template_id: digitalTwin.roleTemplateId,
        created_at: digitalTwin.createdAt.toISOString(),
        updated_at: digitalTwin.updatedAt.toISOString(),
      },
    };

    return NextResponse.json(metadata, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating NFT metadata:', error);
    return NextResponse.json(
      { error: 'Failed to generate metadata' },
      { status: 500 }
    );
  }
} 