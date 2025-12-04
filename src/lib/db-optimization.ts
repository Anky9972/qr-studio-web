import { prisma } from './prisma';

/**
 * Database Query Optimization Utilities
 */

/**
 * Batch load QR codes with scans for a user
 * Reduces N+1 query problems
 */
export async function getBatchQRCodesWithScans(userId: string) {
  return prisma.qRCode.findMany({
    where: { userId },
    include: {
      scans: {
        orderBy: { scannedAt: 'desc' },
        take: 10, // Limit scans per QR code
      },
      campaign: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get analytics with optimized queries
 * Uses aggregation instead of loading all records
 */
export async function getQRCodeAnalytics(qrCodeId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [totalScans, uniqueScans, scansByDate, topCountries, topCities, devices] =
    await Promise.all([
      // Total scans count
      prisma.scan.count({
        where: {
          qrCodeId,
          scannedAt: { gte: startDate },
        },
      }),

      // Unique scans (distinct IP addresses)
      prisma.scan.groupBy({
        by: ['ipAddress'],
        where: {
          qrCodeId,
          scannedAt: { gte: startDate },
        },
        _count: true,
      }),

      // Scans by date
      prisma.$queryRaw`
        SELECT DATE(scannedAt) as date, COUNT(*) as count
        FROM Scan
        WHERE qrCodeId = ${qrCodeId}
        AND scannedAt >= ${startDate}
        GROUP BY DATE(scannedAt)
        ORDER BY date DESC
      `,

      // Top countries
      prisma.scan.groupBy({
        by: ['country'],
        where: {
          qrCodeId,
          scannedAt: { gte: startDate },
          country: { not: null },
        },
        _count: true,
        orderBy: { _count: { country: 'desc' } },
        take: 5,
      }),

      // Top cities
      prisma.scan.groupBy({
        by: ['city'],
        where: {
          qrCodeId,
          scannedAt: { gte: startDate },
          city: { not: null },
        },
        _count: true,
        orderBy: { _count: { city: 'desc' } },
        take: 5,
      }),

      // Device breakdown
      prisma.scan.groupBy({
        by: ['device'],
        where: {
          qrCodeId,
          scannedAt: { gte: startDate },
          device: { not: null },
        },
        _count: true,
      }),
    ]);

  return {
    totalScans,
    uniqueScans: uniqueScans.length,
    scansByDate,
    topCountries,
    topCities,
    devices,
  };
}

/**
 * Get user dashboard stats with single query
 */
export async function getUserDashboardStats(userId: string) {
  const [qrCodeCount, totalScans, activeQRCodes, recentQRCodes] = await Promise.all([
    prisma.qRCode.count({ where: { userId } }),
    
    prisma.scan.count({
      where: {
        qrCode: { userId },
      },
    }),
    
    prisma.qRCode.count({
      where: {
        userId,
        scanCount: { gt: 0 },
      },
    }),
    
    prisma.qRCode.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        type: true,
        scanCount: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    qrCodeCount,
    totalScans,
    activeQRCodes,
    recentQRCodes,
  };
}

/**
 * Paginated QR codes query with cursor-based pagination
 * More efficient than offset-based pagination for large datasets
 */
export async function getPaginatedQRCodes(
  userId: string,
  cursor?: string,
  limit: number = 20
) {
  const qrCodes = await prisma.qRCode.findMany({
    where: { userId },
    take: limit + 1, // Take one extra to determine if there's more
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      type: true,
      content: true,
      scanCount: true,
      createdAt: true,
      shortUrl: true,
    },
  });

  let nextCursor: string | undefined;
  if (qrCodes.length > limit) {
    const nextItem = qrCodes.pop();
    nextCursor = nextItem!.id;
  }

  return {
    qrCodes,
    nextCursor,
  };
}

/**
 * Bulk update scan counts (for batch processing)
 */
export async function bulkUpdateScanCounts(updates: { id: string; increment: number }[]) {
  return prisma.$transaction(
    updates.map(({ id, increment }) =>
      prisma.qRCode.update({
        where: { id },
        data: {
          scanCount: { increment },
          lastScanned: new Date(),
        },
      })
    )
  );
}
