import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createCookieHeader } from '@/utils/auth';
import { corsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    const response = NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Logged out successfully',
    }, { headers: corsHeaders });

    response.headers.append('Set-Cookie', createCookieHeader('accessToken', '', 0));
    response.headers.append('Set-Cookie', createCookieHeader('refreshToken', '', 0));

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Logout failed' },
      { status: 500, headers: corsHeaders }
    );
  }
}
