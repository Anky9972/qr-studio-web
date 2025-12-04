import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RateLimitConfig {
  free: number;
  pro: number;
  business: number;
  enterprise: number;
}

const DAILY_LIMITS: RateLimitConfig = {
  free: 100,
  pro: 1000,
  business: 10000,
  enterprise: 999999, // Effectively unlimited
};

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
}

export async function checkRateLimit(
  userId: string,
  plan: string
): Promise<RateLimitResult> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const planKey = plan.toLowerCase() as keyof RateLimitConfig;
  const limit = DAILY_LIMITS[planKey] || DAILY_LIMITS.free;

  try {
    // Count API requests today
    const requestCount = await prisma.apiKey.count({
      where: {
        userId,
        lastUsedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    const remaining = Math.max(0, limit - requestCount);
    const allowed = requestCount < limit;

    return {
      allowed,
      limit,
      remaining,
      resetAt: tomorrow,
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Allow request on error, but log it
    return {
      allowed: true,
      limit,
      remaining: limit,
      resetAt: tomorrow,
    };
  }
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.floor(result.resetAt.getTime() / 1000).toString(),
  };
}
