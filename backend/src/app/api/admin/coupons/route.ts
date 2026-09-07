import { NextRequest, NextResponse } from 'next/server';
import { CouponService } from '@/services/couponService';
import { authenticateUser } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, statusCode: 403, message: 'Forbidden' }, { status: 403, headers: corsHeaders });
    }

    const coupons = await CouponService.getAllCoupons();
    return NextResponse.json({ success: true, statusCode: 200, data: { coupons } }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to fetch coupons' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, statusCode: 403, message: 'Forbidden' }, { status: 403, headers: corsHeaders });
    }

    const body = await req.json();
    const coupon = await CouponService.createCoupon({
      code: body.code,
      discountType: body.discountType,
      discountValue: parseFloat(body.discountValue),
      minOrderAmount: body.minOrderAmount ? parseFloat(body.minOrderAmount) : 0,
      usageLimit: body.usageLimit ? parseInt(body.usageLimit, 10) : 100,
    });

    return NextResponse.json({ success: true, statusCode: 201, data: { coupon } }, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 400, message: error.message || 'Failed to create coupon' },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ success: false, statusCode: 403, message: 'Forbidden' }, { status: 403, headers: corsHeaders });
    }

    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json({ success: false, statusCode: 400, message: 'Coupon id required' }, { status: 400, headers: corsHeaders });
    }

    const updated = await CouponService.toggleCouponStatus(id);
    return NextResponse.json({ success: true, statusCode: 200, data: { coupon: updated } }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 400, message: error.message || 'Failed to update coupon' },
      { status: 400, headers: corsHeaders }
    );
  }
}
