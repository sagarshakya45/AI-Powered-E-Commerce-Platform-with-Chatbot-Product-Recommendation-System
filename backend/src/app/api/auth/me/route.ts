import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/utils/auth';
import { getCorsHeaders, handleOptions } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return handleOptions(req.headers.get('origin'));
}

export async function GET(req: NextRequest) {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  try {
    const user = await authenticateUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, statusCode: 401, message: 'Not authenticated' },
        { status: 401, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Authenticated user profile',
      data: { user },
    }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to fetch user profile' },
      { status: 500, headers: corsHeaders }
    );
  }
}
