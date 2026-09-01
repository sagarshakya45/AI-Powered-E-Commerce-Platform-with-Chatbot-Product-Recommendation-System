import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/utils/auth';

export const dynamic = 'force-dynamic';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, statusCode: 404, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Category fetched successfully',
      data: { category },
    });
  } catch (error) {
    console.error('Fetch single category error:', error);
    return NextResponse.json(
      { success: false, statusCode: 500, message: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { error, status } = await requireAdmin(req);
    if (error) {
      return NextResponse.json({ success: false, statusCode: status, message: error }, { status });
    }

    const { id } = params;
    const body = await req.json();
    const { name, description, image, parentId } = body;

    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, statusCode: 404, message: 'Category not found' },
        { status: 404 }
      );
    }

    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = body.slug ? slugify(body.slug) : slugify(name);
    }
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (parentId !== undefined) updateData.parentId = parentId;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Category updated successfully',
      data: { category: updatedCategory },
    });
  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { success: false, statusCode: 500, message: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { error, status } = await requireAdmin(req);
    if (error) {
      return NextResponse.json({ success: false, statusCode: status, message: error }, { status });
    }

    const { id } = params;

    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      return NextResponse.json(
        { success: false, statusCode: 404, message: 'Category not found' },
        { status: 404 }
      );
    }

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { success: false, statusCode: 500, message: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
