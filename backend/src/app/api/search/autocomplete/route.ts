import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/services/searchService';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    if (!q.trim()) {
      return NextResponse.json(
        { success: true, statusCode: 200, data: { products: [], categories: [], brands: [] } },
        { headers: corsHeaders }
      );
    }

    const suggestions = await SearchService.getSearchSuggestions(q);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: suggestions,
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Autocomplete failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
