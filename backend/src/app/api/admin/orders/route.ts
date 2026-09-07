import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ success: false, statusCode: 403, message: 'Forbidden' }, { status: 403, headers: corsHeaders });

    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        payment: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, statusCode: 200, data: { orders } }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ success: false, statusCode: 500, message: error.message }, { status: 500 });
  }
}
