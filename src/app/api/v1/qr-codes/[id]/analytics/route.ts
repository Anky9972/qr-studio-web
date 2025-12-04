import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, createApiError } from '@/lib/apiAuth';
import { checkRateLimit, addRateLimitHeaders } from '@/lib/rateLimit';
import { prisma } from '@/lib/prisma';

// GET /api/v1/qr-codes/:id/analytics - Get QR code analytics
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
    // Check ownership
    const qrCode = await prisma.qRCode.findFirst({
      where: {
        id,
        userId: context.userId,
      },
    });

    if (!qrCode) {
      return createApiError('QR code not found', 404);
    }

    // Get analytics data
    const [scans, deviceStats, browserStats, locationStats] = await Promise.all([
      // Total scans
      prisma.scan.findMany({
        where: { qrCodeId: id },
        select: {
          scannedAt: true,
          device: true,
          browser: true,
          os: true,
          country: true,
          city: true,
        },
        orderBy: { scannedAt: 'desc' },
        take: 100,
      }),
      // Device breakdown
      prisma.scan.groupBy({
        by: ['device'],
        where: { qrCodeId: id },
        _count: true,
      }),
      // Browser breakdown
      prisma.scan.groupBy({
        by: ['browser'],
        where: { qrCodeId: id },
        _count: true,
      }),
      // Location breakdown
      prisma.scan.groupBy({
        by: ['country'],
        where: { qrCodeId: id },
        _count: true,
      }),
    ]);

    const response = NextResponse.json({
      success: true,
      data: {
        totalScans: scans.length,
        recentScans: scans.slice(0, 10),
        deviceBreakdown: deviceStats.map((d: any) => ({
          device: d.device || 'Unknown',
          count: d._count,
        })),
        browserBreakdown: browserStats.map((b: any) => ({
          browser: b.browser || 'Unknown',
          count: b._count,
        })),
        locationBreakdown: locationStats.map((l: any) => ({
          country: l.country || 'Unknown',
          count: l._count,
        })),
      },
    });

    addRateLimitHeaders(response.headers, rateLimit.limit, rateLimit.remaining, rateLimit.resetAt);
    return response;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return createApiError('Failed to fetch analytics', 500);
  }
}
