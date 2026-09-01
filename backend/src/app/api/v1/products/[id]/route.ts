import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/utils/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        images: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, statusCode: 404, message: 'Product not found' },
        { status: 404 }
      );
    }

    const reviewCount = product.reviews.length;
    const avgRating =
      reviewCount > 0
        ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
        : '4.8';

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Product details retrieved successfully',
      data: {
        product: {
          ...product,
          avgRating: parseFloat(avgRating as string),
          reviewCount,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to fetch product' },
      { status: 500 }
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
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, statusCode: 404, message: 'Product not found' },
        { status: 404 }
      );
    }

    const { title, description, price, discountPrice, stock, isFeatured, isActive, categoryId } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingProduct.title,
        description: description !== undefined ? description : existingProduct.description,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        discountPrice: discountPrice !== undefined ? (discountPrice ? parseFloat(discountPrice) : null) : existingProduct.discountPrice,
        stock: stock !== undefined ? parseInt(stock, 10) : existingProduct.stock,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : existingProduct.isFeatured,
        isActive: isActive !== undefined ? Boolean(isActive) : existingProduct.isActive,
        categoryId: categoryId !== undefined ? categoryId : existingProduct.categoryId,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Product updated successfully',
      data: { product: updatedProduct },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to update product' },
      { status: 500 }
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
        { status: 403 }
      );
    }

    const { id } = params;

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, statusCode: 404, message: 'Product not found' },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
