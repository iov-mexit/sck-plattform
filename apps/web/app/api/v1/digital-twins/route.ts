import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DigitalTwinService, RoleTemplateService } from '@/lib/database';
import { MOCK_CUSTOMER, getRoleTemplateById } from '@/lib/mock-customer';

// Validation schemas
const CreateDigitalTwinSchema = z.object({
  roleIdentifier: z.string().min(1, 'Role identifier is required').max(100, 'Role identifier too long'),
  description: z.string().max(500, 'Description too long').optional(),
  organizationId: z.string().min(1, 'Organization ID is required'),
  roleTemplateId: z.string().min(1, 'Role template ID is required'),
  assignedToDid: z.string().min(1, 'DID is required for assignment'),
  blockchainAddress: z.string().optional(),
  blockchainNetwork: z.enum(['ethereum', 'polygon', 'flare']).optional(),
});

const GetDigitalTwinsSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateDigitalTwinSchema.parse(body);

    // For demo purposes, use mock data when database is not available
    const roleTemplate = getRoleTemplateById(validatedData.roleTemplateId);
    if (!roleTemplate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid role template for this organization',
        },
        { status: 400 }
      );
    }

    // Create mock digital twin response
    const mockDigitalTwin = {
      id: `twin_${Date.now()}`,
      roleIdentifier: validatedData.roleIdentifier,
      description: validatedData.description,
      organizationId: validatedData.organizationId,
      roleTemplateId: validatedData.roleTemplateId,
      assignedToDid: validatedData.assignedToDid,
      status: 'active',
      level: 1,
      blockchainAddress: validatedData.blockchainAddress,
      blockchainNetwork: validatedData.blockchainNetwork,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      roleTemplate: {
        id: roleTemplate.id,
        title: roleTemplate.title,
        category: roleTemplate.category,
        focus: roleTemplate.focus,
      },
      organization: {
        id: MOCK_CUSTOMER.organization.id,
        name: MOCK_CUSTOMER.organization.name,
        domain: MOCK_CUSTOMER.organization.domain,
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: mockDigitalTwin,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Error creating digital twin:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create digital twin',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');

    if (!organizationId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Organization ID parameter is required',
        },
        { status: 400 }
      );
    }

    const validatedData = GetDigitalTwinsSchema.parse({ organizationId });

    // For demo purposes, return mock digital twins
    const mockDigitalTwins = MOCK_CUSTOMER.sampleDigitalTwins.map((twin, index) => {
      const roleTemplate = getRoleTemplateById(twin.roleTemplateId);
      return {
        id: `twin_demo_${index + 1}`,
        roleIdentifier: twin.roleIdentifier,
        description: twin.description,
        organizationId: MOCK_CUSTOMER.organization.id,
        roleTemplateId: twin.roleTemplateId,
        assignedToDid: twin.assignedToDid,
        status: twin.status,
        level: twin.level,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        roleTemplate: {
          id: roleTemplate?.id,
          title: roleTemplate?.title,
          category: roleTemplate?.category,
          focus: roleTemplate?.focus,
        },
        organization: {
          id: MOCK_CUSTOMER.organization.id,
          name: MOCK_CUSTOMER.organization.name,
          domain: MOCK_CUSTOMER.organization.domain,
        },
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: mockDigitalTwins,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          errors: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Error fetching digital twins:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch digital twins',
      },
      { status: 500 }
    );
  }
} 