import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRefreshToken, generateAccessToken, createCookieHeader } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const refreshTokenCookie = req.cookies.get('refreshToken')?.value;

    if (!refreshTokenCookie) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 401,
          message: 'Refresh token not found',
        },
        { status: 401 }
      );
    }

    const decoded = verifyRefreshToken(refreshTokenCookie);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 401,
          message: 'Invalid or expired refresh token',
        },
        { status: 401 }
      );
    }

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenCookie },
    });

    if (!tokenRecord || new Date(tokenRecord.expiresAt) < new Date()) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 401,
          message: 'Refresh token revoked or expired',
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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

    // Generate new Access Token
    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(tokenPayload);

    const response = NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: 'Token refreshed successfully',
      },
      { status: 200 }
    );

    response.headers.append(
      'Set-Cookie',
      createCookieHeader('accessToken', newAccessToken, 15 * 60)
    );

    return response;
  } catch (error) {
    console.error('Refresh Token Error:', error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: 'Internal server error while refreshing token',
      },
      { status: 500 }
    );
  }
}
