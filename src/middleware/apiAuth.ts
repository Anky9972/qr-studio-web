import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export interface ApiAuthContext {
  userId: string;
  apiKey: string;
  plan: string;
}

export async function validateApiKey(
  request: NextRequest
): Promise<{ success: true; context: ApiAuthContext } | { success: false; error: string; status: number }> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return {
      success: false,
      error: 'Missing Authorization header. Use: Authorization: Bearer YOUR_API_KEY',
      status: 401,
    };
  }

  const [type, token] = authHeader.split(' ');
  
  if (type !== 'Bearer' || !token) {
    return {
      success: false,
      error: 'Invalid Authorization format. Use: Authorization: Bearer YOUR_API_KEY',
      status: 401,
    };
  }

  // Hash the provided API key
  const hashedKey = crypto.createHash('sha256').update(token).digest('hex');

  try {
    // Find the API key in database
    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash: hashedKey },
      include: {
        user: {
          select: {
            id: true,
            plan: true,
            email: true,
          },
        },
      },
    });

    if (!apiKey) {
      return {
        success: false,
        error: 'Invalid API key',
        status: 401,
      };
    }

    // Check if key is expired
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      return {
        success: false,
        error: 'API key has expired',
        status: 401,
      };
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return {
      success: true,
      context: {
        userId: apiKey.userId,
        apiKey: apiKey.id,
        plan: apiKey.user.plan,
      },
    };
  } catch (error) {
    console.error('API key validation error:', error);
    return {
      success: false,
      error: 'Internal server error',
      status: 500,
    };
  }
}

export function createApiErrorResponse(error: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}
