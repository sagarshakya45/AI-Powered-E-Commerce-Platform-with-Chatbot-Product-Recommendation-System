import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderService } from '@/services/orderService';
import { ProductService } from '@/services/productService';
import { authenticateUser } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';
import { AppError } from '@/utils/errorHandler';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'SALESMAN') {
      throw new AppError('Forbidden: Seller access required', 403);
    }

    const sellerOrders = await OrderService.getSellerOrders(user.id);
    const sellerProducts = await ProductService.getSellerProducts(user.id);

    const totalOrders = sellerOrders.length;
    const totalUnitsSold = sellerOrders.reduce((sum: number, order: any) => {
      const sellerItems = order.items.filter((i: any) => i.sellerId === user.id);
      return sum + sellerItems.reduce((s: number, i: any) => s + i.quantity, 0);
    }, 0);

    const totalRevenue = sellerOrders.reduce((sum: number, order: any) => {
      const sellerItems = order.items.filter((i: any) => i.sellerId === user.id);
      return sum + sellerItems.reduce((s: number, i: any) => s + i.totalPrice, 0);
    }, 0);

    const totalViews = sellerProducts.reduce((sum: number, p: any) => sum + (p.views || 0), 0);
    const totalReviews = sellerProducts.reduce((sum: number, p: any) => sum + (p.reviews?.length || 0), 0);

    const avgRating = totalReviews > 0
      ? sellerProducts.reduce((sum: number, p: any) => {
          const reviewCount = p.reviews?.length || 0;
          const productAvg = reviewCount > 0
            ? p.reviews.reduce((rs: number, r: any) => rs + r.rating, 0) / reviewCount
            : 0;
          return sum + productAvg * reviewCount;
        }, 0) / totalReviews
      : 0;

    const productAnalytics = sellerProducts.map((p: any) => ({
      id: p.id,
      title: p.title,
      views: p.views || 0,
      salesCount: p.salesCount || 0,
      avgRating: p.reviews.length > 0
        ? parseFloat((p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
        : 0,
      reviewCount: p.reviews.length,
      stock: p.stock,
      price: p.price,
      discountPrice: p.discountPrice,
    }));

    const topProducts = [...productAnalytics].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);
    const lowStockProducts = productAnalytics
      .filter((p) => p.stock <= 5)
      .sort((a, b) => a.stock - b.stock);

    const recentOrders = sellerOrders.slice(0, 5);
    const recentReviews = sellerProducts
      .flatMap((p: any) => p.reviews || [])
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: {
        totalOrders,
        totalUnitsSold,
        totalRevenue,
        totalViews,
        avgRating: Number(avgRating.toFixed(1)),
        topProducts,
        lowStockProducts,
        recentOrders,
        recentReviews,
      },
    }, { headers: corsHeaders });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}
