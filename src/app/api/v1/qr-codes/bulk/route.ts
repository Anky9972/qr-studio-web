import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, createApiError } from '@/lib/apiAuth';
import { checkRateLimit, addRateLimitHeaders } from '@/lib/rateLimit';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';
import crypto from 'crypto';

// POST /api/v1/qr-codes/bulk - Bulk generate QR codes
export async function POST(request: NextRequest) {
  const authResult = await validateApiKey(request);
  if (!authResult.valid) {
    return createApiError(authResult.error || 'Unauthorized', 401);
  }

  const context = authResult.context!;
  const rateLimit = await checkRateLimit(context.apiKeyId, context.subscription);

  if (!rateLimit.allowed) {
    const response = createApiError('Rate limit exceeded', 429);
    addRateLimitHeaders(response.headers, rateLimit.limit, rateLimit.remaining, rateLimit.resetAt);
    return response;
  }

  try {
    const body = await request.json();
    const { qrCodes, options = {} } = body;

    if (!Array.isArray(qrCodes) || qrCodes.length === 0) {
      return createApiError('qrCodes array is required', 400);
    }

    if (qrCodes.length > 100) {
      return createApiError('Maximum 100 QR codes per request', 400);
    }

    const {
      size = 512,
      foreground = '#000000',
      background = '#FFFFFF',
      errorLevel = 'M',
    } = options;

    const results = [];

    for (const item of qrCodes) {
      if (!item.content) {
        results.push({
          success: false,
          error: 'Content is required',
          data: item,
        });
        continue;
      }

      try {
        // Generate QR code
        const qrDataUrl = await QRCode.toDataURL(item.content, {
          width: item.size || size,
          color: {
            dark: item.foreground || foreground,
            light: item.background || background,
          },
          errorCorrectionLevel: (item.errorLevel || errorLevel) as any,
        });

        // Save to database
        const qrCode = await prisma.qRCode.create({
          data: {
            id: crypto.randomUUID(),
            userId: context.userId,
            name: item.name || `Bulk Generated - ${item.content.substring(0, 20)}`,
            type: 'static',
            content: item.content,
            qrType: item.type || 'url',
            size: item.size || size,
            foreground: item.foreground || foreground,
            background: item.background || background,
            errorLevel: item.errorLevel || errorLevel,
            updatedAt: new Date(),
          },
        });

        results.push({
          success: true,
          data: {
            id: qrCode.id,
            name: qrCode.name,
            content: qrCode.content,
            qrCode: qrDataUrl,
            createdAt: qrCode.createdAt,
          },
        });
      } catch (error) {
        results.push({
          success: false,
          error: 'Failed to generate QR code',
          data: item,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    const response = NextResponse.json({
      success: true,
      data: {
        results,
        summary: {
          total: qrCodes.length,
          successful: successCount,
          failed: failureCount,
        },
      },
    }, { status: 201 });

    addRateLimitHeaders(response.headers, rateLimit.limit, rateLimit.remaining, rateLimit.resetAt);
    return response;
  } catch (error) {
    console.error('Error bulk generating QR codes:', error);
    return createApiError('Failed to bulk generate QR codes', 500);
  }
}
