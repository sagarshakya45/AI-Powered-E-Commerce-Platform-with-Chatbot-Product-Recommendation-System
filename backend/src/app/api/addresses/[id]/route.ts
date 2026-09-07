import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/utils/auth';
import { prisma } from '@/lib/prisma';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateUser(req);
    if (!user) return NextResponse.json({ success: false, statusCode: 401, message: 'Unauthorized' }, { status: 401, headers: corsHeaders });

    const existing = await prisma.address.findUnique({ where: { id: params.id } });
    if (!existing || existing.userId !== user.id) {
      return NextResponse.json({ success: false, statusCode: 404, message: 'Address not found or forbidden' }, { status: 404, headers: corsHeaders });
    }

    const body = await req.json();
    const updated = await prisma.address.update({
      where: { id: params.id },
      data: {
        fullName: body.fullName,
        phone: body.phone,
        street: body.street,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country,
      },
    });

    return NextResponse.json({ success: true, statusCode: 200, data: { address: updated } }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ success: false, statusCode: 500, message: error.message }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateUser(req);
    if (!user) return NextResponse.json({ success: false, statusCode: 401, message: 'Unauthorized' }, { status: 401, headers: corsHeaders });

    const address = await prisma.address.findUnique({ where: { id: params.id } });
    
    if (!address || address.userId !== user.id) {
      return NextResponse.json({ success: false, statusCode: 404, message: 'Address not found' }, { status: 404, headers: corsHeaders });
    }

    await prisma.address.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, statusCode: 200, message: 'Address deleted' }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ success: false, statusCode: 500, message: error.message }, { status: 500, headers: corsHeaders });
  }
}
