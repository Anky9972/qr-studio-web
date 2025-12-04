// Visitor Fingerprinting & Tracking
// Distinguishes unique visitors from returning visitors

import crypto from 'crypto';

export interface VisitorFingerprint {
  visitorId: string;
  isUnique: boolean;
  lastSeen?: Date;
}

/**
 * Generate visitor fingerprint from request data
 * Creates a hash from IP + User Agent + other signals
 */
export function generateVisitorFingerprint(
  ipAddress: string,
  userAgent: string,
  acceptLanguage?: string,
  acceptEncoding?: string
): string {
  const components = [
    ipAddress,
    userAgent,
    acceptLanguage || '',
    acceptEncoding || '',
  ];

  const fingerprint = components.join('|');
  return crypto
    .createHash('sha256')
    .update(fingerprint)
    .digest('hex')
    .substring(0, 32);
}

/**
 * Check if visitor is unique (first-time visitor to this QR code)
 * Returns visitor ID and whether they're unique
 */
export async function checkUniqueVisitor(
  qrCodeId: string,
  visitorId: string,
  prisma: any
): Promise<VisitorFingerprint> {
  try {
    // Check if this visitor has scanned this QR before
    const existingScan = await prisma.scan.findFirst({
      where: {
        qrCodeId,
        visitorId,
      },
      orderBy: {
        scannedAt: 'desc',
      },
      select: {
        scannedAt: true,
      },
    });

    if (existingScan) {
      return {
        visitorId,
        isUnique: false,
        lastSeen: existingScan.scannedAt,
      };
    }

    return {
      visitorId,
      isUnique: true,
    };
  } catch (error) {
    console.error('Error checking unique visitor:', error);
    // Default to unique if check fails
    return {
      visitorId,
      isUnique: true,
    };
  }
}

/**
 * Get unique visitor count for QR code
 */
export async function getUniqueVisitorCount(
  qrCodeId: string,
  prisma: any,
  dateRange?: { start: Date; end: Date }
): Promise<number> {
  try {
    const where: any = {
      qrCodeId,
      isUnique: true,
    };

    if (dateRange) {
      where.scannedAt = {
        gte: dateRange.start,
        lte: dateRange.end,
      };
    }

    const count = await prisma.scan.count({ where });
    return count;
  } catch (error) {
    console.error('Error getting unique visitor count:', error);
    return 0;
  }
}

/**
 * Get visitor retention metrics
 * Returns data about returning vs new visitors
 */
export async function getVisitorRetentionMetrics(
  qrCodeId: string,
  prisma: any,
  dateRange: { start: Date; end: Date }
): Promise<{
  totalScans: number;
  uniqueVisitors: number;
  returningVisitors: number;
  retentionRate: number;
  avgScansPerVisitor: number;
}> {
  try {
    const [totalScans, uniqueScans, visitorGroups] = await Promise.all([
      // Total scans in period
      prisma.scan.count({
        where: {
          qrCodeId,
          scannedAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        },
      }),

      // Unique visitors in period
      prisma.scan.count({
        where: {
          qrCodeId,
          isUnique: true,
          scannedAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        },
      }),

      // Group by visitor ID to count scans per visitor
      prisma.scan.groupBy({
        by: ['visitorId'],
        where: {
          qrCodeId,
          scannedAt: {
            gte: dateRange.start,
            lte: dateRange.end,
          },
        },
        _count: {
          id: true,
        },
      }),
    ]);

    const returningVisitors = visitorGroups.filter(
      (group: any) => group._count.id > 1
    ).length;

    const retentionRate =
      uniqueScans > 0 ? (returningVisitors / uniqueScans) * 100 : 0;

    const avgScansPerVisitor =
      visitorGroups.length > 0 ? totalScans / visitorGroups.length : 0;

    return {
      totalScans,
      uniqueVisitors: uniqueScans,
      returningVisitors,
      retentionRate: parseFloat(retentionRate.toFixed(2)),
      avgScansPerVisitor: parseFloat(avgScansPerVisitor.toFixed(2)),
    };
  } catch (error) {
    console.error('Error getting visitor retention metrics:', error);
    return {
      totalScans: 0,
      uniqueVisitors: 0,
      returningVisitors: 0,
      retentionRate: 0,
      avgScansPerVisitor: 0,
    };
  }
}

/**
 * Client-side fingerprinting script (to be injected in landing page)
 * More sophisticated than server-side only
 */
export function getClientFingerprintScript(): string {
  return `
<script>
(function() {
  // Generate client-side fingerprint
  function generateFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('fingerprint', 2, 2);
    const canvasFingerprint = canvas.toDataURL();
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: screen.width + 'x' + screen.height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasFingerprint: canvasFingerprint.substring(0, 50),
    };
    
    return btoa(JSON.stringify(fingerprint)).substring(0, 32);
  }
  
  // Store in localStorage and cookie
  const fpKey = 'qr_visitor_id';
  let visitorId = localStorage.getItem(fpKey);
  
  if (!visitorId) {
    visitorId = generateFingerprint();
    localStorage.setItem(fpKey, visitorId);
  }
  
  // Set cookie (30 days)
  document.cookie = fpKey + '=' + visitorId + '; max-age=2592000; path=/; SameSite=Lax';
})();
</script>
`;
}

/**
 * Extract visitor ID from cookies
 */
export function getVisitorIdFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const match = cookieHeader.match(/qr_visitor_id=([^;]+)/);
  return match ? match[1] : null;
}
