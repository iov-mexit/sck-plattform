import prisma from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const status = searchParams.get('status');

    const where: any = {};
    if (organizationId) {
      where.organizationId = organizationId;
    }
    if (status) {
      where.status = status;
    }

    const mcpPolicies = await prisma.mcpPolicy.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            domain: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: mcpPolicies });
  } catch (error) {
    console.error('Error fetching MCP policies:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch MCP policies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      organizationId, 
      name, 
      version, 
      status, 
      regoModule, 
      sha256, 
      isDefault, 
      scope, 
      createdBy 
    } = body;

    if (!organizationId || !name || !regoModule || !sha256 || !scope || !createdBy) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newPolicy = await prisma.mcpPolicy.create({
      data: {
        organizationId,
        name,
        version: version || 1,
        status: status || 'draft',
        regoModule,
        sha256,
        isDefault: isDefault || false,
        scope,
        createdBy,
      },
      include: {
        organization: {
          select: {
            name: true,
            domain: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: newPolicy }, { status: 201 });
  } catch (error) {
    console.error('Error creating MCP policy:', error);
    return NextResponse.json({ success: false, error: 'Failed to create MCP policy' }, { status: 500 });
  }
}
