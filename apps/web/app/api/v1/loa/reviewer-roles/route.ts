import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ReviewerRole {
  id: string;
  name: string;
  category: 'Security' | 'Compliance' | 'Policy' | 'Risk' | 'External';
  canApproveLevels: ('L1' | 'L2' | 'L3' | 'L4' | 'L5')[];
  isActive: boolean;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        { success: false, error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // TODO: Implement actual reviewer roles table
    // For now, return mock data
    const mockRoles: ReviewerRole[] = [
      {
        id: '1',
        name: 'Security Officer',
        category: 'Security',
        canApproveLevels: ['L1', 'L2', 'L3', 'L4', 'L5'],
        isActive: true,
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Compliance Manager',
        category: 'Compliance',
        canApproveLevels: ['L2', 'L3', 'L4', 'L5'],
        isActive: true,
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Policy Advisor',
        category: 'Policy',
        canApproveLevels: ['L3', 'L4', 'L5'],
        isActive: true,
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Risk Analyst',
        category: 'Risk',
        canApproveLevels: ['L4', 'L5'],
        isActive: true,
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        name: 'External Auditor',
        category: 'External',
        canApproveLevels: ['L4', 'L5'],
        isActive: true,
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockRoles
    });
  } catch (error) {
    console.error('Error fetching reviewer roles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reviewer roles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organizationId,
      name,
      category,
      canApproveLevels,
      isActive = true
    } = body;

    // Validation
    if (!organizationId || !name || !category || !canApproveLevels) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(canApproveLevels) || canApproveLevels.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Can approve levels must be a non-empty array' },
        { status: 400 }
      );
    }

    // TODO: Implement actual reviewer role creation
    // For now, return mock response
    const mockRole: ReviewerRole = {
      id: `role-${Date.now()}`,
      name,
      category,
      canApproveLevels,
      isActive,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: mockRole
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating reviewer role:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create reviewer role',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
