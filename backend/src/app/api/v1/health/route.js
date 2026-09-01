import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      statusCode: 200,
      success: true,
      message: 'Next.js E-Commerce Backend API is operational',
      data: {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      },
    },
    { status: 200 }
  );
}
