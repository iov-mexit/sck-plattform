import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    const roleTemplates = await prisma.roleTemplate.findMany({
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

    const roleTemplate = await prisma.roleTemplate.create({
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