import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /qr/[id] - Redirect handler for short URL QR codes
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Find QR code by short URL or ID
    const qrCode = await prisma.qRCode.findFirst({
      where: {
        OR: [
          { shortUrl: id },
          { id: id }
        ]
      },
      select: {
        id: true,
        destination: true,
        content: true,
        password: true,
        expiresAt: true,
        type: true,
      },
    });

    if (!qrCode) {
      return NextResponse.redirect(new URL('/404', request.url));
    }

    // Check if QR code has expired
    if (qrCode.expiresAt && new Date() > qrCode.expiresAt) {
      return NextResponse.redirect(
        new URL(`/qr/${id}/expired`, request.url)
      );
    }

    // Check if password protected
    if (qrCode.password) {
      return NextResponse.redirect(
        new URL(`/qr/${id}/verify`, request.url)
      );
    }

    // Track scan
    await trackScan(qrCode.id, request);

    // Redirect to destination
    const redirectUrl = qrCode.destination || qrCode.content;
    
    // Ensure URL has protocol
    const finalUrl = redirectUrl.startsWith('http') 
      ? redirectUrl 
      : `https://${redirectUrl}`;

    return NextResponse.redirect(finalUrl);
  } catch (error) {
    console.error('QR redirect error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

// Helper function to track scans
async function trackScan(qrCodeId: string, request: NextRequest) {
  try {
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Parse device, browser, OS from user agent
    const device = getDeviceType(userAgent);
    const browser = getBrowser(userAgent);
    const os = getOS(userAgent);

    // Create scan record
    await prisma.scan.create({
      data: {
        qrCodeId,
        ipAddress,
        userAgent,
        device,
        browser,
        os,
        referrer: request.headers.get('referer') || undefined,
      },
    });

    // Increment scan count
    await prisma.qRCode.update({
      where: { id: qrCodeId },
      data: {
        scanCount: { increment: 1 },
        lastScanned: new Date(),
      },
    });
  } catch (error) {
    console.error('Scan tracking error:', error);
    // Don't block redirect if tracking fails
  }
}

// Helper functions for parsing user agent
function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'Mobile';
  if (/tablet|ipad/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

function getBrowser(userAgent: string): string {
  if (/edg/i.test(userAgent)) return 'Edge';
  if (/chrome/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent)) return 'Safari';
  if (/opera/i.test(userAgent)) return 'Opera';
  return 'Other';
}

function getOS(userAgent: string): string {
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/mac/i.test(userAgent)) return 'MacOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/android/i.test(userAgent)) return 'Android';
  if (/ios|iphone|ipad/i.test(userAgent)) return 'iOS';
  return 'Other';
}
