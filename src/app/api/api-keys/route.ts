import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { checkApiKeyLimit } from '@/middleware/planLimits';

// GET /api/api-keys - List user's API keys
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error('Get API keys error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST /api/api-keys - Create new API key
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { name, expiresIn } = await request.json();

    // Check API key limit
    const apiKeyCheck = await checkApiKeyLimit(userId);
    if (!apiKeyCheck.allowed) {
      return NextResponse.json(
        {
          error: 'API_KEY_LIMIT_EXCEEDED',
          message: apiKeyCheck.message,
          current: apiKeyCheck.current,
          limit: apiKeyCheck.limit,
          percentage: apiKeyCheck.percentage,
        },
        { status: 403 }
      );
    }

    // Generate secure API key
    const keyBytes = crypto.randomBytes(32);
    const apiKey = `qrs_${keyBytes.toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const keyPrefix = apiKey.substring(0, 12) + '...';

    // Calculate expiration
    let expiresAt: Date | null = null;
    if (expiresIn) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresIn));
    }

    // Create API key in database
    const newKey = await prisma.apiKey.create({
      data: {
        userId,
        name: name || 'API Key',
        keyHash,
        keyPrefix,
        expiresAt,
      },
    });

    // Return the full key only once (never stored)
    return NextResponse.json({
      apiKey: {
        id: newKey.id,
        name: newKey.name,
        keyPrefix: newKey.keyPrefix,
        createdAt: newKey.createdAt,
        expiresAt: newKey.expiresAt,
      },
      key: apiKey, // Only shown once!
    });
  } catch (error) {
    console.error('Create API key error:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}
