import { NextRequest, NextResponse } from 'next/server';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const corsHeaders = {
  'Access-Control-Allow-Origin': CLIENT_URL,
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
};

export function middleware(req: NextRequest) {
  const origin = req.headers.get('origin');

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Origin': origin || CLIENT_URL,
      },
    });
  }

  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
