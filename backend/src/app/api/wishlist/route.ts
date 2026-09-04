import { NextRequest, NextResponse } from 'next/server';
import { WishlistService } from '@/services/wishlistService';
import { authenticateUser } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, statusCode: 401, message: 'Unauthorized' },
      { status: 401, headers: corsHeaders }
    );
  }

  const wishlist = await WishlistService.getOrCreate(user.id);
  return NextResponse.json(
    { success: true, statusCode: 200, data: { items: wishlist.items.map((i) => i.product) } },
    { headers: corsHeaders }
  );
}

export async function POST(req: NextRequest) {
  const user = await authenticateUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, statusCode: 401, message: 'Unauthorized' },
      { status: 401, headers: corsHeaders }
    );
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json(
      { success: false, statusCode: 400, message: 'productId is required' },
      { status: 400, headers: corsHeaders }
    );
  }

  const result = await WishlistService.toggle(user.id, productId);
  return NextResponse.json({ success: true, statusCode: 200, data: result }, { headers: corsHeaders });
}
