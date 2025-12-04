import { NextRequest } from 'next/server';
import { createApiError } from './apiAuth';

interface RateLimitConfig {
  FREE: number;
  PRO: number;
  BUSINESS: number;
  ENTERPRISE: number;
}

// Rate limits per day
const RATE_LIMITS: RateLimitConfig = {
  FREE: 100,
  PRO: 1000,
  BUSINESS: 10000,
  ENTERPRISE: 100000,
};

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: Date }>();

export async function checkRateLimit(
  apiKeyId: string,
  subscription: string
): Promise<{ allowed: boolean; limit: number; remaining: number; resetAt: Date }> {
  const limit = RATE_LIMITS[subscription as keyof RateLimitConfig] || RATE_LIMITS.FREE;
  const now = new Date();
  const resetAt = new Date(now);
  resetAt.setHours(24, 0, 0, 0); // Reset at midnight

  const key = `${apiKeyId}:${now.toDateString()}`;
  const existing = rateLimitStore.get(key);

  if (!existing) {
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, limit, remaining: limit - 1, resetAt };
  }

  if (now > existing.resetAt) {
    // Reset counter
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, limit, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, limit, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count++;
  return { allowed: true, limit, remaining: limit - existing.count, resetAt: existing.resetAt };
}

export function addRateLimitHeaders(headers: Headers, limit: number, remaining: number, resetAt: Date) {
  headers.set('X-RateLimit-Limit', limit.toString());
  headers.set('X-RateLimit-Remaining', remaining.toString());
  headers.set('X-RateLimit-Reset', Math.floor(resetAt.getTime() / 1000).toString());
}
