import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;
    const body = await request.json();
    const { password, userAgent, referrer } = body;

    // Find QR code by short URL
    const qrCode = await prisma.qRCode.findFirst({
      where: {
        shortUrl: shortCode,
      },
      include: {
        user: {
          select: {
            id: true,
            plan: true
          }
        }
      }
    });

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      );
    }

    // Check if expired
    if (qrCode.expiresAt && new Date(qrCode.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This QR code has expired' },
        { status: 410 }
      );
    }

    // Check password protection
    if (qrCode.password) {
      if (!password) {
        return NextResponse.json(
          { passwordRequired: true },
          { status: 401 }
        );
      }

      const isValidPassword = await bcrypt.compare(password, qrCode.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid password', passwordRequired: true },
          { status: 401 }
        );
      }
    }

    // Get client IP address
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwardedFor?.split(',')[0] || realIp || 'unknown';

    // Parse user agent for device/browser info
    const ua = userAgent || request.headers.get('user-agent') || 'unknown';
    let deviceType = 'Desktop';
    let browser = 'Unknown';
    let os = 'Unknown';

    // Simple user agent parsing
    if (/mobile/i.test(ua)) deviceType = 'Mobile';
    else if (/tablet|ipad/i.test(ua)) deviceType = 'Tablet';

    if (/chrome/i.test(ua)) browser = 'Chrome';
    else if (/safari/i.test(ua)) browser = 'Safari';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/edge/i.test(ua)) browser = 'Edge';

    if (/windows/i.test(ua)) os = 'Windows';
    else if (/mac/i.test(ua)) os = 'macOS';
    else if (/linux/i.test(ua)) os = 'Linux';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/ios|iphone|ipad/i.test(ua)) os = 'iOS';

    // Get approximate location from IP (you would use a GeoIP service in production)
    // For now, we'll use a placeholder
    const location = 'Unknown';

    // Create scan record
    await prisma.scan.create({
      data: {
        qrCodeId: qrCode.id,
        scannedAt: new Date(),
        ipAddress,
        userAgent: ua,
        device: deviceType,
        browser,
        os,
        referrer: referrer || 'direct'
      }
    });

    // Increment scan count
    await prisma.qRCode.update({
      where: { id: qrCode.id },
      data: {
        scanCount: {
          increment: 1
        }
      }
    });

    // Return destination URL
    return NextResponse.json({
      destination: qrCode.destination || qrCode.content,
      success: true
    });

  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
