import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { RoleTemplateService } from '@/lib/database';

// Validation schemas
const GetRoleTemplatesSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
});

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

    const validatedData = GetRoleTemplatesSchema.parse({ organizationId });
    const roleTemplates = await RoleTemplateService.getByOrganization(validatedData.organizationId);

    return NextResponse.json(
      {
        success: true,
        data: roleTemplates,
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

    console.error('Error fetching role templates:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch role templates',
      },
      { status: 500 }
    );
  }
} 