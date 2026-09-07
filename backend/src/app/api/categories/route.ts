import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
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
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to fetch categories',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, statusCode: 403, message: 'Forbidden: Admin access required' },
        { status: 403, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: 'Category name is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const slug = generateSlug(name);

    const existingCategory = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, statusCode: 409, message: 'Category name or slug already exists' },
        { status: 409, headers: corsHeaders }
      );
    }

    const category = await prisma.category.create({
      data: { name, slug, description },
    });

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: 'Category created successfully',
        data: { category },
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to create category' },
      { status: 500, headers: corsHeaders }
    );
  }
}
