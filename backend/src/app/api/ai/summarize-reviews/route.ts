import { NextRequest, NextResponse } from 'next/server';
import { AIService } from '@/services/ai.service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, statusCode: 400, message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const summary = await AIService.summarizeReviews(productId);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { summary }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to summarize reviews' },
      { status: 500 }
    );
  }
}
