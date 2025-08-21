import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId');
    const category = searchParams.get('category');

    const whereClause: Record<string, unknown> = {};

    // Filter by organization if provided
    if (organizationId) {
      whereClause.organizationId = organizationId;
    }

    // Filter by category if provided
    if (category) {
      whereClause.category = category;
    }

    const roleTemplates = await prisma.role_templates.findMany({
      where: whereClause,
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: roleTemplates,
      },
      { status: 200 }
    );
  } catch (error) {
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.focus || !body.category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title, focus, and category are required',
        },
        { status: 400 }
      );
    }

    const roleTemplate = await prisma.role_templates.create({
      data: {
        id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: body.title,
        focus: body.focus,
        category: body.category,
        selectable: body.selectable ?? true,
        responsibilities: body.responsibilities || [],
        securityContributions: body.securityContributions || [],
        organizationId: body.organizationId || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: roleTemplate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating role template:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create role template',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('id');

    if (!templateId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Template ID is required',
        },
        { status: 400 }
      );
    }

    // Check if template is being used by any digital twins
    const roleAgentsUsingTemplate = await prisma.role_agents.findFirst({
      where: {
        roleTemplateId: templateId,
      },
    });

    if (roleAgentsUsingTemplate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot delete template that is being used by role agents',
        },
        { status: 409 }
      );
    }

    await prisma.role_templates.delete({
      where: {
        id: templateId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Role template deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting role template:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete role template',
      },
      { status: 500 }
    );
  }
} 