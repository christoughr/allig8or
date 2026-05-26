/**
 * Simple in-memory rate limiter for /api/generate/* routes.
 * Resets on cold start (acceptable for MVP — use Upstash Redis for prod).
 *
 * Free tier: 10 requests per hour per IP
 * Authenticated users get higher limits via plan check (P1).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const FREE_LIMIT = 10;

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + WINDOW_MS;
    store.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: FREE_LIMIT - 1, resetAt };
  }

  if (entry.count >= FREE_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: FREE_LIMIT - entry.count,
    resetAt: entry.resetAt,
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'unknown';
}

export function rateLimitExceededResponse(resetAt: number) {
  return {
    status: 429,
    headers: {
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': String(resetAt),
      'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
    },
  } as const;
}
