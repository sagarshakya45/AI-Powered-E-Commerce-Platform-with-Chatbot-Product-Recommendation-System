import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) return NextResponse.json({ success: false, statusCode: 401, message: 'Unauthorized' }, { status: 401 });

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, statusCode: 200, data: { addresses } });
  } catch (error: any) {
    return NextResponse.json({ success: false, statusCode: 500, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) return NextResponse.json({ success: false, statusCode: 401, message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName: body.fullName,
        phone: body.phone,
        street: body.street,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country
      }
    });

    return NextResponse.json({ success: true, statusCode: 201, data: { address } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, statusCode: 500, message: error.message }, { status: 500 });
  }
}
