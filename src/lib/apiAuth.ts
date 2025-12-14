import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export interface ApiAuthContext {
  userId: string;
  apiKeyId: string;
  subscription: string;
}

export async function validateApiKey(request: NextRequest): Promise<{ valid: boolean; context?: ApiAuthContext; error?: string }> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return { valid: false, error: 'Missing Authorization header' };
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return { valid: false, error: 'Invalid Authorization format. Use: Bearer <api_key>' };
  }

  // Hash the provided key to compare with stored hash
  const keyHash = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash },
      include: {
        User: {
          select: {
            id: true,
            subscription: true,
          },
        },
      },
    });

    if (!apiKey) {
      return { valid: false, error: 'Invalid API key' };
    }

    // Check if key is expired
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return { valid: false, error: 'API key has expired' };
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      valid: true,
      context: {
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
        subscription: apiKey.User.subscription || 'FREE',
      },
    };
  } catch (error) {
    console.error('API key validation error:', error);
    return { valid: false, error: 'Internal server error' };
  }
}

export function createApiError(message: string, status: number = 400) {
  return NextResponse.json(
    {
      error: {
        message,
        status,
      },
    },
    { status }
  );
}
