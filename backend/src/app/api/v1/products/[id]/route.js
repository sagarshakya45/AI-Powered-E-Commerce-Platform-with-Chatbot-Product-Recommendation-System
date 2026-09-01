import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    const { id } = params;

    // Check if query is UUID or slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ],
        isActive: true,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true, description: true },
        },
        images: {
          select: { id: true, url: true, publicId: true, isPrimary: true },
          orderBy: { isPrimary: 'desc' },
        },
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

    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
        : 0;

    const formattedProduct = {
      ...product,
      avgRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
    };

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Product retrieved successfully',
      data: { product: formattedProduct },
    });
  } catch (error) {
    console.error('Fetch single product error:', error);
    return NextResponse.json(
      { success: false, statusCode: 500, message: 'Failed to fetch product details' },
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

    const existingProduct = await prisma.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, statusCode: 404, message: 'Product not found' },
        { status: 404 }
      );
    }

    const { title, description, price, discountPrice, stock, isFeatured, isActive, categoryId } = body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (discountPrice !== undefined) updateData.discountPrice = discountPrice ? parseFloat(discountPrice) : null;
    if (stock !== undefined) updateData.stock = parseInt(stock, 10);
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (categoryId) updateData.categoryId = categoryId;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
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
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { success: false, statusCode: 500, message: 'Failed to update product' },
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
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, statusCode: 500, message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
