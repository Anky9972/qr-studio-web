import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { parseUserAgent } from '@/lib/user-agent-parser';
import { getGeolocation } from '@/lib/geolocation';

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
    const parsed = parseUserAgent(ua);
    const deviceType = parsed.device;
    const browser = parsed.browser;
    const os = parsed.os;

    // Get geolocation data
    const geoData = await getGeolocation(ipAddress).catch(() => ({ 
      country: 'Unknown', 
      city: 'Unknown' 
    }));

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
        country: geoData.country,
        city: geoData.city,
        referrer: referrer || undefined
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
