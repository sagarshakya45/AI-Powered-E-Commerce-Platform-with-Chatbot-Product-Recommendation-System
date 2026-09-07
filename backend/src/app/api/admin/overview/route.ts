import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, statusCode: 403, message: 'Forbidden' }, { status: 403, headers: corsHeaders });

    const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });
    const totalOrders = await prisma.order.count();
    const totalProducts = await prisma.product.count();
    
    const revenueObj = await prisma.order.aggregate({
      _sum: { finalAmount: true },
      where: { status: { in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] } }
    });
    
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        revenue: revenueObj._sum.finalAmount || 0,
        recentOrders
      }
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ success: false, statusCode: 500, message: error.message }, { status: 500, headers: corsHeaders });
  }
}
