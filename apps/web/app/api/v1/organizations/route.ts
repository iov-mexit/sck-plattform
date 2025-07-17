import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OrganizationService } from '@/lib/database';

// Validation schemas
const CreateOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  domain: z.string().min(1, 'Domain is required').max(100, 'Domain too long'),
});

const GetOrganizationSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateOrganizationSchema.parse(body);

    const organization = await OrganizationService.create(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: organization,
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

    console.error('Error creating organization:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create organization',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        {
          success: false,
          message: 'Domain parameter is required',
        },
        { status: 400 }
      );
    }

    const validatedData = GetOrganizationSchema.parse({ domain });
    const organization = await OrganizationService.getByDomain(validatedData.domain);

    if (!organization) {
      return NextResponse.json(
        {
          success: false,
          message: 'Organization not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: organization,
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

    console.error('Error fetching organization:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch organization',
      },
      { status: 500 }
    );
  }
} 