import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRefreshToken, generateAccessToken, createCookieHeader } from '@/utils/auth';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, statusCode: 401, message: 'Refresh token missing' },
        { status: 401 }
      );
    }

    const savedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!savedToken || new Date() > savedToken.expiresAt) {
      return NextResponse.json(
        { success: false, statusCode: 401, message: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    const response = NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Access token refreshed successfully',
    });

    response.headers.append(
      'Set-Cookie',
      createCookieHeader('accessToken', newAccessToken, 15 * 60)
    );

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 401, message: 'Token refresh failed' },
      { status: 401 }
    );
  }
}
