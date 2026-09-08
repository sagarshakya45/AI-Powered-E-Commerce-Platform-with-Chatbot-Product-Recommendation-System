import { NextRequest, NextResponse } from 'next/server';
import { SearchService } from '@/services/searchService';
import { authenticateUser } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined;
    const inStock = searchParams.get('inStock');
    const sort = (searchParams.get('sort') as any) || 'relevance';
    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 20;

    const result = await SearchService.searchProducts({
      q,
      category,
      categoryId,
      brand,
      minPrice,
      maxPrice,
      minRating,
      inStock: inStock === 'true' ? true : inStock === 'false' ? false : undefined,
      sort,
      page,
      limit,
    });

    const user = await authenticateUser(req);
    await SearchService.recordSearch(user?.id || null, q, result.total);

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: result,
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Search failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
