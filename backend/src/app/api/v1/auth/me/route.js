import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAccessToken } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const accessTokenCookie = req.cookies.get('accessToken')?.value;

    if (!accessTokenCookie) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 401,
          message: 'Unauthorized: No token provided',
        },
        { status: 401 }
      );
    }

    const decoded = verifyAccessToken(accessTokenCookie);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 401,
          message: 'Unauthorized: Invalid or expired access token',
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 404,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: 'User profile retrieved successfully',
        data: { user },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Me Endpoint Error:', error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: 'Internal server error while fetching user profile',
      },
      { status: 500 }
    );
  }
}
