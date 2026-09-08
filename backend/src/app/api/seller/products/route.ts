import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateUser } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';
import { AppError } from '@/utils/errorHandler';
import { productQuerySchema, createProductSchema } from '@/validators/productValidator';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'SALESMAN') {
      throw new AppError('Forbidden: Seller access required', 403);
    }

    const { searchParams } = new URL(req.url);
    const queryObj: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });
    queryObj.sellerId = user.id;

    const validatedParams = productQuerySchema.parse(queryObj);

    const result = await prisma.product.findMany({
      where: { sellerId: user.id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: { select: { id: true, url: true, isPrimary: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { products: result },
    }, { headers: corsHeaders });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'SALESMAN') {
      throw new AppError('Forbidden: Seller access required', 403);
    }

    const body = await req.json();
    const validatedData = createProductSchema.parse(body);

    validatedData.isActive = false;

    const product = await prisma.product.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        discountPrice: validatedData.discountPrice,
        stock: validatedData.stock,
        isFeatured: validatedData.isFeatured,
        isActive: validatedData.isActive,
        brand: validatedData.brand,
        sku: validatedData.sku,
        attributes: validatedData.attributes,
        slug: `${validatedData.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-6)}`,
        seller: { connect: { id: user.id } },
        category: { connect: { id: validatedData.categoryId } },
        images: validatedData.images?.length
          ? {
              create: validatedData.images.map((img: any, index: number) => ({
                url: img.url,
                publicId: img.publicId || `img-${Date.now()}-${index}`,
                isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
        seller: { select: { id: true, name: true, avatar: true } },
      },
    });

    return NextResponse.json({
      success: true,
      statusCode: 201,
      message: 'Product submitted for admin approval',
      data: { product },
    }, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}
