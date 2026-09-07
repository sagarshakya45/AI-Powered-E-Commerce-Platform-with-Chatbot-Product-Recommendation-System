import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        products: {
          take: 10,
          include: { images: true },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, statusCode: 404, message: 'Category not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Category retrieved successfully',
      data: { category },
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to fetch category' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, statusCode: 403, message: 'Forbidden: Admin access required' },
        { status: 403, headers: corsHeaders }
      );
    }

    const { id } = params;
    const body = await req.json();
    const { name, description } = body;

    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, statusCode: 404, message: 'Category not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingCategory.name,
        description: description !== undefined ? description : existingCategory.description,
      },
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Category updated successfully',
      data: { category: updatedCategory },
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to update category' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, statusCode: 403, message: 'Forbidden: Admin access required' },
        { status: 403, headers: corsHeaders }
      );
    }

    const { id } = params;

    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, statusCode: 404, message: 'Category not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Category deleted successfully',
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to delete category' },
      { status: 500, headers: corsHeaders }
    );
  }
}
