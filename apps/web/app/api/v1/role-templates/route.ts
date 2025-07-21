import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/v1/role-templates - List all role templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Use Record<string, unknown> for where clause
    const where: Record<string, unknown> = {};
    if (category) {
      where.category = category;
    }

    const roleTemplates = await prisma.roleTemplate.findMany({
      where,
      orderBy: {
        title: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: roleTemplates,
      count: roleTemplates.length,
    });
  } catch (error) {
    console.error('Error fetching role templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch role templates' },
      { status: 500 }
    );
  }
}

// POST /api/v1/role-templates - Create role template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      focus,
      category,
      selectable = true,
      responsibilities,
      securityContributions,
    } = body;

    // Validate required fields
    if (!title || !focus || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, focus, category' },
        { status: 400 }
      );
    }

    // Create the role template
    const roleTemplate = await prisma.roleTemplate.create({
      data: {
        title,
        focus,
        category,
        selectable,
        responsibilities,
        securityContributions,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'create',
        entity: 'role_template',
        entityId: roleTemplate.id,
        metadata: {
          title,
          category,
          selectable,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: roleTemplate,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating role template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create role template' },
      { status: 500 }
    );
  }
} 