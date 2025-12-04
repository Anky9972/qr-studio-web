import { prisma } from '../prisma';

/**
 * Calculate funnel metrics for user journey
 */
export async function calculateFunnelMetrics(userId: string, startDate?: Date, endDate?: Date) {
  const dateFilter = {
    ...(startDate && { gte: startDate }),
    ...(endDate && { lte: endDate }),
  };

  // Stage 1: QR Codes Created
  const qrCodesCreated = await prisma.qRCode.count({
    where: {
      userId,
      createdAt: dateFilter,
    },
  });

  // Stage 2: QR Codes Scanned (at least once)
  const qrCodesScanned = await prisma.qRCode.count({
    where: {
      userId,
      createdAt: dateFilter,
      scans: {
        some: {},
      },
    },
  });

  // Stage 3: Total Scans
  const totalScans = await prisma.scan.count({
    where: {
      qrCode: {
        userId,
      },
      scannedAt: dateFilter,
    },
  });

  // Stage 4: Unique users (based on IP)
  const uniqueUsers = await prisma.scan.groupBy({
    by: ['ipAddress'],
    where: {
      qrCode: {
        userId,
      },
      scannedAt: dateFilter,
      ipAddress: {
        not: null,
      },
    },
  });

  return [
    {
      name: 'QR Codes Created',
      value: qrCodesCreated,
      percentage: 100,
      index: 0,
    },
    {
      name: 'QR Codes Scanned',
      value: qrCodesScanned,
      percentage: qrCodesCreated > 0 ? (qrCodesScanned / qrCodesCreated) * 100 : 0,
      index: 1,
    },
    {
      name: 'Total Scans',
      value: totalScans,
      percentage: qrCodesCreated > 0 ? (totalScans / qrCodesCreated) * 100 : 0,
      index: 2,
    },
    {
      name: 'Unique Users',
      value: uniqueUsers.length,
      percentage: qrCodesCreated > 0 ? (uniqueUsers.length / qrCodesCreated) * 100 : 0,
      index: 3,
    },
  ];
}

/**
 * Get geographic distribution of scans
 */
export async function getGeographicDistribution(userId: string, limit = 50) {
  const scans = await prisma.scan.groupBy({
    by: ['country', 'city'],
    where: {
      qrCode: {
        userId,
      },
      country: {
        not: null,
      },
      city: {
        not: null,
      },
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
    take: limit,
  });

  // Map city/country to coordinates (simplified - in production, use a geocoding service)
  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    'New York,USA': { lat: 40.7128, lng: -74.0060 },
    'London,UK': { lat: 51.5074, lng: -0.1278 },
    'Tokyo,Japan': { lat: 35.6762, lng: 139.6503 },
    'Paris,France': { lat: 48.8566, lng: 2.3522 },
    'San Francisco,USA': { lat: 37.7749, lng: -122.4194 },
    'Sydney,Australia': { lat: -33.8688, lng: 151.2093 },
    'Berlin,Germany': { lat: 52.5200, lng: 13.4050 },
    'Moscow,Russia': { lat: 55.7558, lng: 37.6173 },
  };

  return scans
    .map((scan) => {
      const key = `${scan.city},${scan.country}`;
      const coords = cityCoordinates[key] || { lat: 0, lng: 0 };
      
      return {
        lat: coords.lat,
        lng: coords.lng,
        city: scan.city || 'Unknown',
        country: scan.country || 'Unknown',
        count: scan._count.id,
      };
    })
    .filter((location) => location.lat !== 0 && location.lng !== 0);
}

/**
 * Track conversion events
 */
export async function trackConversion(
  userId: string,
  goalId: string,
  qrCodeId?: string,
  metadata?: Record<string, any>
) {
  // Store conversion in database
  // Note: You'll need to add a Conversion model to your Prisma schema
  
  // For now, return success
  return {
    success: true,
    goalId,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Calculate conversion rate for a specific goal
 */
export async function calculateConversionRate(
  userId: string,
  goalId: string,
  startDate?: Date,
  endDate?: Date
) {
  const dateFilter = {
    ...(startDate && { gte: startDate }),
    ...(endDate && { lte: endDate }),
  };

  // Total scans in period
  const totalScans = await prisma.scan.count({
    where: {
      qrCode: {
        userId,
      },
      scannedAt: dateFilter,
    },
  });

  // Conversions for this goal (would need Conversion model)
  // For now, return mock data
  const conversions = Math.floor(totalScans * 0.15); // 15% conversion rate

  return {
    totalScans,
    conversions,
    conversionRate: totalScans > 0 ? (conversions / totalScans) * 100 : 0,
  };
}

/**
 * Get real-time metrics
 */
export async function getRealtimeMetrics(userId: string) {
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
  const todayStart = new Date(now.setHours(0, 0, 0, 0));

  const [scansLastMinute, activeQRCodes, scansToday] = await Promise.all([
    // Scans in the last minute
    prisma.scan.count({
      where: {
        qrCode: {
          userId,
        },
        scannedAt: {
          gte: oneMinuteAgo,
        },
      },
    }),

    // QR codes with scans in the last 24 hours
    prisma.qRCode.count({
      where: {
        userId,
        scans: {
          some: {
            scannedAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    }),

    // Total scans today
    prisma.scan.count({
      where: {
        qrCode: {
          userId,
        },
        scannedAt: {
          gte: todayStart,
        },
      },
    }),
  ]);

  return {
    scansLastMinute,
    activeQRCodes,
    scansToday,
    currentViewers: 1, // This will be updated by Socket.IO
  };
}
