import { NextRequest, NextResponse } from 'next/server';
import { ReviewService } from '@/services/reviewService';
import { authenticateUser } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ success: false, statusCode: 400, message: 'productId is required' }, { status: 400, headers: corsHeaders });
    }

    const data = await ReviewService.getReviews(productId);

    return NextResponse.json({ success: true, statusCode: 200, data }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to fetch reviews' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json({ success: false, statusCode: 401, message: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const body = await req.json();
    const { productId, rating, comment } = body;

    if (!productId || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, statusCode: 400, message: 'Valid productId and rating (1-5) are required' }, { status: 400, headers: corsHeaders });
    }

    const review = await ReviewService.addReview(user.id, productId, rating, comment || '');

    return NextResponse.json({ success: true, statusCode: 201, data: { review } }, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    const status = error.message.includes('already reviewed') ? 400 : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message || 'Failed to add review' },
      { status, headers: corsHeaders }
    );
  }
}
