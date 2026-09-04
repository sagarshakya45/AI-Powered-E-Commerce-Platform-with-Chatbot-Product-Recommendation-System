const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5174',
];

function getAllowedOrigins(): string[] {
  const env = process.env.CLIENT_URL;
  if (env) {
    return [env, ...DEFAULT_ALLOWED_ORIGINS];
  }
  return DEFAULT_ALLOWED_ORIGINS;
}

export function getCorsHeaders(origin: string | null): HeadersInit {
  const allowed = getAllowedOrigins();
  const allowOrigin = origin && allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };
}

export const corsHeaders: HeadersInit = getCorsHeaders(null);

export function handleOptions(origin: string | null = null) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}
