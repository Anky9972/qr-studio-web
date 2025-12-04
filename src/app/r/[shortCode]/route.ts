import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    // Find QR code by short URL
    const qrCode = await prisma.qRCode.findFirst({
      where: {
        shortUrl: shortCode,
        type: 'dynamic',
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Check if expired
    if (qrCode.expiresAt && qrCode.expiresAt < new Date()) {
      return NextResponse.json({ error: 'QR code has expired' }, { status: 410 });
    }

    // Check if password protected
    const { searchParams } = new URL(request.url);
    const providedPassword = searchParams.get('password');

    if (qrCode.password && qrCode.password !== providedPassword) {
      return NextResponse.json({ error: 'Password required', passwordProtected: true }, { status: 403 });
    }

    // Extract analytics data
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const referrer = request.headers.get('referer') || null;

    // Parse user agent for device/browser info
    const device = userAgent.includes('Mobile') ? 'Mobile' : userAgent.includes('Tablet') ? 'Tablet' : 'Desktop';
    const browser = 
      userAgent.includes('Chrome') ? 'Chrome' :
      userAgent.includes('Safari') ? 'Safari' :
      userAgent.includes('Firefox') ? 'Firefox' :
      userAgent.includes('Edge') ? 'Edge' : 'Other';
    const os = 
      userAgent.includes('Windows') ? 'Windows' :
      userAgent.includes('Mac') ? 'Mac' :
      userAgent.includes('Linux') ? 'Linux' :
      userAgent.includes('Android') ? 'Android' :
      userAgent.includes('iOS') ? 'iOS' : 'Other';

    // Record scan analytics
    await Promise.all([
      prisma.scan.create({
        data: {
          qrCodeId: qrCode.id,
          ipAddress,
          userAgent,
          device,
          browser,
          os,
          referrer,
          country: 'Unknown', // Could use IP geolocation API
          city: 'Unknown',
        },
      }),
      prisma.qRCode.update({
        where: { id: qrCode.id },
        data: {
          scanCount: { increment: 1 },
          lastScanned: new Date(),
        },
      }),
    ]);

    // Redirect to destination
    return NextResponse.redirect(qrCode.destination!, 302);
  } catch (error: any) {
    console.error('Error processing QR code redirect:', error);
    return NextResponse.json(
      { error: 'Failed to process QR code', details: error.message },
      { status: 500 }
    );
  }
}
