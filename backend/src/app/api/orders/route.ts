import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/services/orderService';
import { authenticateUser } from '@/utils/auth';
import { createOrderSchema } from '@/validators/orderValidator';
import { corsHeaders, handleOptions } from '@/lib/cors';
import { AppError } from '@/utils/errorHandler';
import { ZodError } from 'zod';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, statusCode: 401, message: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    const orders = await OrderService.getUserOrders(user.id);
    return NextResponse.json({ success: true, statusCode: 200, data: { orders } }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, statusCode: 401, message: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const payload = createOrderSchema.parse(body);
    const order = await OrderService.createOrder(user.id, payload);

    return NextResponse.json(
      { success: true, statusCode: 201, data: { order } },
      { status: 201, headers: corsHeaders }
    );
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: 'Validation failed', errors: error.errors },
        { status: 400, headers: corsHeaders }
      );
    }
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}
