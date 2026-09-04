import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/paymentService';
import { authenticateUser } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) return NextResponse.json({ success: false, statusCode: 401, message: 'Unauthorized' }, { status: 401 });

    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ success: false, statusCode: 400, message: 'Order ID is required' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.userId !== user.id) {
      return NextResponse.json({ success: false, statusCode: 404, message: 'Order not found' }, { status: 404 });
    }

    const checkoutUrl = await PaymentService.createCheckoutSession(order.id, user.email, order.finalAmount);

    return NextResponse.json({ success: true, statusCode: 200, data: { url: checkoutUrl } });
  } catch (error: any) {
    return NextResponse.json({ success: false, statusCode: 500, message: error.message }, { status: 500 });
  }
}
