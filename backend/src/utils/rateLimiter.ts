import { NextRequest } from 'next/server';

type Attempt = { timestamp: number };
type RateLimiter = Map<string, Attempt[]>;

// In-memory rate limiter. NOTE: this is process-local and resets on server restart.
// Replace with a durable store like Redis before production use.
const limiter: RateLimiter = new Map();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempts = limiter.get(ip) || [];

  const recent = attempts.filter((t) => now - t.timestamp < WINDOW_MS);

  if (recent.length >= MAX_ATTEMPTS) {
    return false;
  }

  recent.push({ timestamp: now });
  limiter.set(ip, recent);
  return true;
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}
