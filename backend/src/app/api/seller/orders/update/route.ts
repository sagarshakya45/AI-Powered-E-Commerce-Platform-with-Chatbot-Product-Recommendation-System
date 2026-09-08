import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateUser } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';
import { AppError } from '@/utils/errorHandler';

export async function OPTIONS() {
  return handleOptions();
}

export async function PUT(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'SALESMAN') {
      throw new AppError('Forbidden: Seller access required', 403);
    }

    const body = await req.json();
    const { orderItemId, status } = body;

    if (!orderItemId) {
      throw new AppError('orderItemId is required', 400);
    }

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid status', 400);
    }

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
    });

    if (!orderItem) {
      throw new AppError('Order item not found', 404);
    }

    if (orderItem.sellerId !== user.id) {
      throw new AppError('You can only update your own order items', 403);
    }

    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: orderItemId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { orderItem: updatedOrderItem },
    }, { headers: corsHeaders });
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}
