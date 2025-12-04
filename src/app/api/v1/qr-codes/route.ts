import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, createApiError, ApiAuthContext } from '@/lib/apiAuth';
import { checkRateLimit, addRateLimitHeaders } from '@/lib/rateLimit';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';

// POST /api/v1/qr-codes - Generate QR code
export async function POST(request: NextRequest) {
  // Validate API key
  const authResult = await validateApiKey(request);
  if (!authResult.valid) {
    return createApiError(authResult.error || 'Unauthorized', 401);
  }

  const context = authResult.context!;

  // Check rate limit
  const rateLimit = await checkRateLimit(context.apiKeyId, context.subscription);
  if (!rateLimit.allowed) {
    const response = createApiError('Rate limit exceeded', 429);
    addRateLimitHeaders(response.headers, rateLimit.limit, rateLimit.remaining, rateLimit.resetAt);
    return response;
  }

  try {
    const body = await request.json();
    const { content, name, type = 'url', size = 512, foreground = '#000000', background = '#FFFFFF', errorLevel = 'M' } = body;

    if (!content) {
      return createApiError('Content is required', 400);
    }

    // Generate QR code
    const qrDataUrl = await QRCode.toDataURL(content, {
      width: size,
      color: {
        dark: foreground,
        light: background,
      },
      errorCorrectionLevel: errorLevel as any,
    });

    // Save to database
    const qrCode = await prisma.qRCode.create({
      data: {
        userId: context.userId,
        name: name || 'API Generated QR',
        type: 'static',
        content,
        qrType: type,
        size,
        foreground,
        background,
        errorLevel,
      },
    });

    const response = NextResponse.json({
      success: true,
      data: {
        id: qrCode.id,
        name: qrCode.name,
        content: qrCode.content,
        qrType: qrCode.qrType,
        qrCode: qrDataUrl,
        createdAt: qrCode.createdAt,
      },
    }, { status: 201 });

    addRateLimitHeaders(response.headers, rateLimit.limit, rateLimit.remaining, rateLimit.resetAt);
    return response;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return createApiError('Failed to generate QR code', 500);
  }
}

// GET /api/v1/qr-codes - List QR codes
export async function GET(request: NextRequest) {
  // Validate API key
  const authResult = await validateApiKey(request);
  if (!authResult.valid) {
    return createApiError(authResult.error || 'Unauthorized', 401);
  }

  const context = authResult.context!;

  // Check rate limit
  const rateLimit = await checkRateLimit(context.apiKeyId, context.subscription);
  if (!rateLimit.allowed) {
    const response = createApiError('Rate limit exceeded', 429);
    addRateLimitHeaders(response.headers, rateLimit.limit, rateLimit.remaining, rateLimit.resetAt);
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const skip = (page - 1) * limit;

    const [qrCodes, total] = await Promise.all([
      prisma.qRCode.findMany({
        where: { userId: context.userId },
        select: {
          id: true,
          name: true,
          qrType: true,
          content: true,
          scanCount: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.qRCode.count({ where: { userId: context.userId } }),
    ]);

    const response = NextResponse.json({
      success: true,
      data: {
        qrCodes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });

    addRateLimitHeaders(response.headers, rateLimit.limit, rateLimit.remaining, rateLimit.resetAt);
    return response;
  } catch (error) {
    console.error('Error listing QR codes:', error);
    return createApiError('Failed to list QR codes', 500);
  }
}
