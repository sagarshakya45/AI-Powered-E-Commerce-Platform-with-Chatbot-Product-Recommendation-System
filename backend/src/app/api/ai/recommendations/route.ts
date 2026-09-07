import { NextRequest, NextResponse } from 'next/server';
import { RecommendationService } from '@/services/recommendation.service';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    // Optionally fetch userId from session/token here
    const recommendations = await RecommendationService.getRecommendations();

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: recommendations
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to fetch recommendations' },
      { status: 500, headers: corsHeaders }
    );
  }
}
