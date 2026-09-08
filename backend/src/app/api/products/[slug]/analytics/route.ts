import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findFirst({
      where: { OR: [{ id: slug }, { slug: slug }] },
      include: {
        reviews: { select: { rating: true } },
        orderItems: {
          select: { quantity: true },
        },
        wishlistItems: {
          select: { id: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, statusCode: 404, message: 'Product not found' }, { status: 404, headers: corsHeaders });
    }

    const reviewCount = product.reviews.length;
    const avgRating = reviewCount > 0
      ? parseFloat((product.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
      : 0;

    const totalSales = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = product.wishlistItems.length;
    const cartAddCount = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: {
        views: product.views,
        sales: totalSales,
        unitsSold: totalSales,
        wishlistAdds: wishlistCount,
        cartAdds: cartAddCount,
        reviews: reviewCount,
        avgRating,
        revenue: totalSales * (product.discountPrice ?? product.price),
      },
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to fetch analytics' },
      { status: 500, headers: corsHeaders }
    );
  }
}
