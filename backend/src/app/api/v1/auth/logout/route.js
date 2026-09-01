import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCookieHeader } from '@/utils/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const refreshTokenCookie = req.cookies.get('refreshToken')?.value;

    if (refreshTokenCookie) {
      // Remove RefreshToken record from DB
      await prisma.refreshToken
        .deleteMany({
          where: { token: refreshTokenCookie },
        })
        .catch(() => {});
    }

    const response = NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );

    // Clear HTTP-Only Cookies
    response.headers.append('Set-Cookie', createCookieHeader('accessToken', '', 0));
    response.headers.append('Set-Cookie', createCookieHeader('refreshToken', '', 0));

    return response;
  } catch (error) {
    console.error('Logout Error:', error);
    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: 'Internal server error during logout',
      },
      { status: 500 }
    );
  }
}
