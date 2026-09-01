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

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        children: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Categories fetched successfully',
      data: { categories },
    });
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json(
      { success: false, statusCode: 500, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { user, error, status } = await requireAdmin(req);
    if (error) {
      return NextResponse.json({ success: false, statusCode: status, message: error }, { status });
    }

    const body = await req.json();
    const { name, description, image, parentId } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: 'Category name is required' },
        { status: 400 }
      );
    }

    const slug = body.slug ? slugify(body.slug) : slugify(name);

    const existingCategory = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, statusCode: 409, message: 'Category with this name or slug already exists' },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: 'Category created successfully',
        data: { category },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { success: false, statusCode: 500, message: 'Failed to create category' },
      { status: 500 }
    );
  }
}
