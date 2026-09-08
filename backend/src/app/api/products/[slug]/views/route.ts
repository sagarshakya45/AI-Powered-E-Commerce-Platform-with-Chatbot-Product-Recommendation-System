import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductViewService } from '@/services/productViewService';
import { corsHeaders, handleOptions } from '@/lib/cors';
import { authenticateUser } from '@/utils/auth';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await authenticateUser(req);
    const { slug } = params;

    const product = await prisma.product.findFirst({
      where: { OR: [{ id: slug }, { slug: slug }] },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, statusCode: 404, message: 'Product not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      undefined;

    await ProductViewService.recordView(product.id, user?.id, ipAddress);

    return NextResponse.json(
      { success: true, statusCode: 200, message: 'View recorded' },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to record view' },
      { status: 500, headers: corsHeaders }
    );
  }
}
