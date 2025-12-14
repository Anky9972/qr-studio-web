import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { evaluateRoutingRules, shouldBlockByScanLimit } from '@/lib/smartRouting';
import { generatePixelLandingPage } from '@/lib/pixelManager';
import { appendUTMParameters } from '@/lib/utmBuilder';
import { RedirectContext } from '@/types/routing';
import { getGeolocation } from '@/lib/geolocation';
import { parseUserAgent } from '@/lib/user-agent-parser';
import { 
  generateVisitorFingerprint, 
  checkUniqueVisitor, 
  getVisitorIdFromCookie 
} from '@/lib/visitor-tracking';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    // Find QR code with all related data
    const qrCode = await prisma.qRCode.findFirst({
      where: {
        shortUrl: shortCode,
        type: 'dynamic',
      },
      include: {
        routingRules: {
          where: { active: true },
          orderBy: { priority: 'desc' },
        },
        pixelConfigs: {
          where: { active: true },
        },
      },
    });

    if (!qrCode) {
      // Redirect to friendly error page
      const errorUrl = new URL('/qr-expired', request.url);
      errorUrl.searchParams.set('type', 'not-found');
      return NextResponse.redirect(errorUrl, 302);
    }

    // Check if expired
    if (qrCode.expiresAt && qrCode.expiresAt < new Date()) {
      // Redirect to friendly error page with optional fallback
      const errorUrl = new URL('/qr-expired', request.url);
      errorUrl.searchParams.set('type', 'expired');
      
      // Check if owner set a fallback URL for expired codes
      const fallbackRule = qrCode.routingRules.find(r => r.type === 'expired');
      if (fallbackRule && fallbackRule.destination) {
        errorUrl.searchParams.set('fallback', fallbackRule.destination);
      }
      
      return NextResponse.redirect(errorUrl, 302);
    }

    // Check password protection
    const { searchParams } = new URL(request.url);
    const providedPassword = searchParams.get('password');

    if (qrCode.password && qrCode.password !== providedPassword) {
      // Redirect to friendly error page
      const errorUrl = new URL('/qr-expired', request.url);
      errorUrl.searchParams.set('type', 'password');
      errorUrl.searchParams.set('message', 'This QR code requires a password. Please contact the owner.');
      return NextResponse.redirect(errorUrl, 302);
    }

    // Check scan limit
    if (shouldBlockByScanLimit(qrCode.scanCount, qrCode.maxScans || undefined)) {
      // Find scan limit rule with exceeded URL
      const scanLimitRule = qrCode.routingRules.find(r => r.type === 'scanLimit');
      
      // Redirect to friendly error page
      const errorUrl = new URL('/qr-expired', request.url);
      errorUrl.searchParams.set('type', 'limit');
      
      if (scanLimitRule && scanLimitRule.destination) {
        errorUrl.searchParams.set('fallback', scanLimitRule.destination);
      }
      
      return NextResponse.redirect(errorUrl, 302);
    }

    // Extract request context
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const acceptLanguage = request.headers.get('accept-language') || '';
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    const referrer = request.headers.get('referer') || undefined;
    const cookieHeader = request.headers.get('cookie');

    // Generate visitor fingerprint
    const cookieVisitorId = getVisitorIdFromCookie(cookieHeader);
    const visitorId = cookieVisitorId || generateVisitorFingerprint(
      ipAddress,
      userAgent,
      acceptLanguage,
      acceptEncoding
    );

    // Check if visitor is unique
    const visitorInfo = await checkUniqueVisitor(qrCode.id, visitorId, prisma);

    // Parse user agent for analytics
    const parsed = parseUserAgent(userAgent);
    const device = parsed.device;
    const browser = parsed.browser;
    const os = parsed.os;

    // Build redirect context
    const context: RedirectContext = {
      qrCodeId: qrCode.id,
      userAgent,
      ipAddress,
      acceptLanguage,
      referer: referrer,
      timestamp: new Date(),
      scanCount: qrCode.scanCount,
    };

    // Evaluate smart routing rules
    const routingResult = await evaluateRoutingRules(
      qrCode.routingRules as any[],
      context,
      qrCode.destination || ''
    );

    let finalDestination = routingResult.destination;

    // Apply UTM parameters if configured
    if (qrCode.utmParams && typeof qrCode.utmParams === 'object') {
      finalDestination = appendUTMParameters(finalDestination, qrCode.utmParams as any);
    }

    // Get geolocation data (don't await - fire and forget)
    getGeolocation(ipAddress).then(geoData => {
      // Record scan analytics with geolocation and visitor tracking
      Promise.all([
        prisma.scan.create({
          data: {
            qrCodeId: qrCode.id,
            ipAddress,
            userAgent,
            device,
            browser,
            os,
            referrer,
            country: geoData.country,
            city: geoData.city,
            visitorId,
            isUnique: visitorInfo.isUnique,
          },
        }),
        // Increment scan count
        prisma.qRCode.update({
          where: { id: qrCode.id },
          data: { scanCount: { increment: 1 } },
        }),
      ]).catch(err => console.error('Failed to record scan:', err));
    }).catch(err => {
      console.error('Geolocation failed, recording scan without geo data:', err);
      // Fallback: record scan without geolocation
      Promise.all([
        prisma.scan.create({
          data: {
            qrCodeId: qrCode.id,
            ipAddress,
            userAgent,
            device,
            browser,
            os,
            referrer,
            country: 'Unknown',
            city: 'Unknown',
            visitorId,
            isUnique: visitorInfo.isUnique,
          },
        }),
        // Increment scan count
        prisma.qRCode.update({
          where: { id: qrCode.id },
          data: { scanCount: { increment: 1 } },
        }),
      ]).catch(err => console.error('Failed to record scan:', err));
    });

    // Update scan count (don't await)
    prisma.qRCode.update({
      where: { id: qrCode.id },
      data: {
        scanCount: { increment: 1 },
        lastScanned: new Date(),
      },
    }).catch(err => console.error('Failed to update scan count:', err));

    // Check if pixels are configured
    if (qrCode.pixelConfigs && qrCode.pixelConfigs.length > 0) {
      // Generate landing page with pixel injection
      const maxDelay = Math.max(...qrCode.pixelConfigs.map(p => p.delayRedirect));
      const landingPageHtml = generatePixelLandingPage(
        qrCode.pixelConfigs as any[],
        finalDestination,
        maxDelay
      );

      // Return HTML landing page with pixels
      return new NextResponse(landingPageHtml, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    // Direct redirect (no pixels)
    return NextResponse.redirect(finalDestination, 302);
  } catch (error: any) {
    console.error('Error processing QR code redirect:', error);
    return NextResponse.json(
      { error: 'Failed to process QR code', details: error.message },
      { status: 500 }
    );
  }
}
