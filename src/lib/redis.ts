/**
 * Redis Cache Utility
 * Provides caching functionality for API responses and database queries
 */

import { Redis } from 'ioredis';

let redis: Redis | null = null;

/**
 * Get Redis client instance
 */
export function getRedisClient(): Redis {
  if (!redis) {
    // Use environment variable for Redis connection
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError: (err: Error) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
    });

    redis.on('error', (error: Error) => {
      console.error('Redis connection error:', error);
    });

    redis.on('connect', () => {
      console.log('Redis connected successfully');
    });
  }

  return redis;
}

/**
 * Cache wrapper function
 */
export async function cache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600 // Default 1 hour
): Promise<T> {
  try {
    const client = getRedisClient();
    
    // Try to get from cache
    const cached = await client.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }

    // If not in cache, fetch data
    const data = await fetcher();

    // Store in cache
    await client.setex(key, ttl, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Cache error:', error);
    // If Redis fails, just return fresh data
    return fetcher();
  }
}

/**
 * Invalidate cache by key or pattern
 */
export async function invalidateCache(keyOrPattern: string): Promise<void> {
  try {
    const client = getRedisClient();

    if (keyOrPattern.includes('*')) {
      // Pattern matching - delete all matching keys
      const keys = await client.keys(keyOrPattern);
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } else {
      // Single key
      await client.del(keyOrPattern);
    }
  } catch (error) {
    console.error('Cache invalidation error:', error);
  }
}

/**
 * Get cached value
 */
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const client = getRedisClient();
    const cached = await client.get(key);
    return cached ? (JSON.parse(cached) as T) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Set cached value
 */
export async function setCached<T>(
  key: string,
  value: T,
  ttl: number = 3600
): Promise<void> {
  try {
    const client = getRedisClient();
    await client.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * Close Redis connection (for cleanup)
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

/**
 * Common cache key generators
 */
export const CacheKeys = {
  user: (userId: string) => `user:${userId}`,
  qrCodes: (userId: string) => `qrcodes:${userId}`,
  qrCode: (qrCodeId: string) => `qrcode:${qrCodeId}`,
  analytics: (qrCodeId: string, range: string) => `analytics:${qrCodeId}:${range}`,
  scans: (qrCodeId: string) => `scans:${qrCodeId}`,
  templates: () => 'templates:all',
  planLimits: (userId: string) => `planlimits:${userId}`,
};

/**
 * Common cache TTLs (in seconds)
 */
export const CacheTTL = {
  short: 60, // 1 minute
  medium: 300, // 5 minutes
  long: 3600, // 1 hour
  day: 86400, // 24 hours
  week: 604800, // 7 days
};
