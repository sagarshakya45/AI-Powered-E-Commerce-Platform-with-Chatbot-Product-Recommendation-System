import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/utils/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json({ success: false, statusCode: 401, message: 'Unauthorized' }, { status: 401 });
    }

    const userProfile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, statusCode: 200, data: { user: userProfile } });
  } catch (error: any) {
    return NextResponse.json({ success: false, statusCode: 500, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json({ success: false, statusCode: 401, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, avatar } = body;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, statusCode: 200, data: { user: updatedUser } });
  } catch (error: any) {
    return NextResponse.json({ success: false, statusCode: 500, message: error.message }, { status: 500 });
  }
}
