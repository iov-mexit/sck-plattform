import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '../../../../generated/prisma';

const prisma = new PrismaClient();

// Validation schemas
const CreateOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  domain: z.string().min(1, 'Domain is required').max(100, 'Domain too long'),
});

const GetOrganizationSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
});

const UpdateOnboardingSchema = z.object({
  domain: z.string().min(1, 'Domain is required'),
  onboardingComplete: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateOrganizationSchema.parse(body);

    // Check if organization with same domain already exists
    const existingOrganization = await prisma.organizations.findUnique({
      where: { domain: validatedData.domain },
    });

    if (existingOrganization) {
      return NextResponse.json(
        {
          success: false,
          error: 'DUPLICATE_ORGANIZATION',
          message: `An organization with domain "${validatedData.domain}" already exists.`,
          existingOrganization: {
            id: existingOrganization.id,
            name: existingOrganization.name,
            domain: existingOrganization.domain,
          },
        },
        { status: 409 } // Conflict status code
      );
    }

    // Generate a unique ID
    const uniqueId = `org-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const organization = await prisma.organizations.create({
      data: {
        id: uniqueId,
        name: validatedData.name,
        description: validatedData.description,
        domain: validatedData.domain,
        onboardingComplete: false, // New organizations start with onboarding incomplete
        updatedAt: new Date(),
      },
    });

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
          errors: error.issues.map(e => ({
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

    if (domain) {
      const validatedData = GetOrganizationSchema.parse({ domain });
      const organization = await prisma.organizations.findUnique({
        where: { domain: validatedData.domain },
      });

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
    } else {
      // Return all organizations
      const organizations = await prisma.organizations.findMany();
      return NextResponse.json(
        {
          success: true,
          data: organizations,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          errors: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Error fetching organization(s):', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch organization(s)',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = UpdateOnboardingSchema.parse(body);

    const organization = await prisma.organizations.update({
      where: { domain: validatedData.domain },
      data: {
        onboardingComplete: validatedData.onboardingComplete,
        updatedAt: new Date(),
      },
    });

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
          errors: error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error('Error updating organization onboarding:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update organization onboarding',
      },
      { status: 500 }
    );
  }
} 