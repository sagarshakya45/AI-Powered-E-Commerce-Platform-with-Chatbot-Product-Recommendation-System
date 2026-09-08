import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';
import { AppError } from '@/utils/errorHandler';

export async function OPTIONS() {
  return handleOptions();
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, statusCode: 403, message: 'Forbidden' }, { status: 403, headers: corsHeaders });
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'approve') {
      const product = await prisma.product.update({
        where: { id: params.id },
        data: { isApproved: true, isActive: true },
      });
      return NextResponse.json({ success: true, statusCode: 200, data: { product } }, { headers: corsHeaders });
    } else if (action === 'reject') {
      const product = await prisma.product.update({
        where: { id: params.id },
        data: { isApproved: false, isActive: false },
      });
      return NextResponse.json({ success: true, statusCode: 200, data: { product } }, { headers: corsHeaders });
    } else {
      throw new AppError('Invalid action. Use "approve" or "reject".', 400);
    }
  } catch (error: any) {
    const status = error instanceof AppError ? error.statusCode : 500;
    return NextResponse.json(
      { success: false, statusCode: status, message: error.message },
      { status, headers: corsHeaders }
    );
  }
}
