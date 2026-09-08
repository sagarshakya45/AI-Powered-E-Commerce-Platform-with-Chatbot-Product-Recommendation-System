import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/utils/auth';
import { OrderService } from '@/services/orderService';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, statusCode: 403, message: 'Forbidden' }, { status: 403, headers: corsHeaders });

    const body = await req.json();
    const { status } = body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, statusCode: 400, message: 'Invalid status' }, { status: 400, headers: corsHeaders });
    }

    let updatedOrder;

    if (status === 'CANCELLED') {
      await OrderService.cancelAndRestore(params.id);
      updatedOrder = await prisma.order.findUnique({
        where: { id: params.id },
        include: { items: true },
      });
    } else {
      updatedOrder = await prisma.order.update({
        where: { id: params.id },
        data: { status }
      });
    }

    return NextResponse.json({ success: true, statusCode: 200, data: { order: updatedOrder } }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ success: false, statusCode: 500, message: error.message }, { status: 500, headers: corsHeaders });
  }
}
