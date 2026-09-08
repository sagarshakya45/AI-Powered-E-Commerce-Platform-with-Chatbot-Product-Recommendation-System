import { NextRequest } from 'next/server';

type Attempt = { timestamp: number };
type RateLimiter = Map<string, Attempt[]>;

// In-memory rate limiter factory.
// NOTE: this is process-local and resets on server restart.
// Replace with a durable store like Redis before production use.
export function createRateLimiter(maxAttempts: number, windowMs: number) {
  const attempts: RateLimiter = new Map();

  return function check(ip: string): boolean {
    const now = Date.now();
    const recent = (attempts.get(ip) || []).filter((t) => now - t.timestamp < windowMs);
    if (recent.length >= maxAttempts) {
      return false;
    }
    recent.push({ timestamp: now });
    attempts.set(ip, recent);
    return true;
  };
}

const checkAuthRateLimit = createRateLimiter(5, 15 * 60 * 1000);

export function checkRateLimit(ip: string): boolean {
  return checkAuthRateLimit(ip);
}

export const checkAIRateLimit = createRateLimiter(60, 60 * 1000);

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}
