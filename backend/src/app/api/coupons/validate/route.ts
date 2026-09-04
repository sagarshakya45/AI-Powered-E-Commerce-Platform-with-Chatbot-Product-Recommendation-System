import { NextRequest, NextResponse } from 'next/server';
import { CouponService } from '@/services/couponService';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: 'Coupon code is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const coupon = await CouponService.validate(String(code), Number(subtotal) || 0);
    return NextResponse.json(
      { success: true, statusCode: 200, data: { coupon } },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    const status = error.statusCode || 400;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}
