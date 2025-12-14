import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, createApiError } from '@/lib/apiAuth';
import { checkRateLimit, addRateLimitHeaders } from '@/lib/rateLimit';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';

// GET /api/v1/qr-codes/:id - Get specific QR code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  try {
    const qrCode = await prisma.qRCode.findFirst({
      where: {
        id,
        userId: context.userId,
      },
      include: {
        _count: {
          select: { Scan: true },
        },
      },
    });

    if (!qrCode) {
      return createApiError('QR code not found', 404);
    }

    // Generate QR code image
    const qrDataUrl = await QRCode.toDataURL(qrCode.content, {
      width: qrCode.size,
      color: {
        dark: qrCode.foreground,
        light: qrCode.background,
      },
      errorCorrectionLevel: qrCode.errorLevel as any,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        id: qrCode.id,
        name: qrCode.name,
        type: qrCode.type,
        qrType: qrCode.qrType,
        content: qrCode.content,
        size: qrCode.size,
        foreground: qrCode.foreground,
        background: qrCode.background,
        errorLevel: qrCode.errorLevel,
        scanCount: qrCode._count.Scan,
        qrCode: qrDataUrl,
        createdAt: qrCode.createdAt,
        updatedAt: qrCode.updatedAt,
      },
    });

    addRateLimitHeaders(response.headers, rateLimit.limit, rateLimit.remaining, rateLimit.resetAt);
    return response;
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return createApiError('Failed to fetch QR code', 500);
  }
}

// PATCH /api/v1/qr-codes/:id - Update QR code
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  try {
    // Check ownership
    const existing = await prisma.qRCode.findFirst({
      where: {
        id,
        userId: context.userId,
      },
    });

    if (!existing) {
      return createApiError('QR code not found', 404);
    }

    const body = await request.json();
    const { name, foreground, background, size } = body;

    const updated = await prisma.qRCode.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(foreground && { foreground }),
        ...(background && { background }),
        ...(size && { size }),
      },
    });

    const response = NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        updatedAt: updated.updatedAt,
      },
    });

    addRateLimitHeaders(response.headers, rateLimit.limit, rateLimit.remaining, rateLimit.resetAt);
    return response;
  } catch (error) {
    console.error('Error updating QR code:', error);
    return createApiError('Failed to update QR code', 500);
  }
}

// DELETE /api/v1/qr-codes/:id - Delete QR code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id } = await params;

  try {
    // Check ownership
    const existing = await prisma.qRCode.findFirst({
      where: {
        id,
        userId: context.userId,
      },
    });

    if (!existing) {
      return createApiError('QR code not found', 404);
    }

    await prisma.qRCode.delete({
      where: { id },
    });

    const response = NextResponse.json({
      success: true,
      message: 'QR code deleted successfully',
    });

    addRateLimitHeaders(response.headers, rateLimit.limit, rateLimit.remaining, rateLimit.resetAt);
    return response;
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return createApiError('Failed to delete QR code', 500);
  }
}
