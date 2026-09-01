import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/utils/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await authenticateUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, statusCode: 401, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Authenticated user profile',
      data: { user },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, message: error.message || 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
