import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (range) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    // Get user's QR codes
    const userQRCodes = await prisma.qRCode.findMany({
      where: { userId },
      select: { id: true },
    });
    const qrCodeIds = userQRCodes.map((q: any) => q.id);

    // Fetch analytics data
    const [
      totalQRCodes,
      totalScans,
      scansByDevice,
      scansByBrowser,
      scansByCountry,
      scansOverTime,
      topQRCodes,
    ] = await Promise.all([
      // Total QR codes
      prisma.qRCode.count({ where: { userId } }),

      // Total scans in range
      qrCodeIds.length > 0 ? prisma.scan.count({
        where: {
          qrCodeId: { in: qrCodeIds },
          scannedAt: { gte: startDate },
        },
      }) : 0,

      // Scans by device
      qrCodeIds.length > 0 ? prisma.scan.groupBy({
        by: ['device'],
        where: {
          qrCodeId: { in: qrCodeIds },
          scannedAt: { gte: startDate },
        },
        _count: { id: true },
      }) : [],

      // Scans by browser
      qrCodeIds.length > 0 ? prisma.scan.groupBy({
        by: ['browser'],
        where: {
          qrCodeId: { in: qrCodeIds },
          scannedAt: { gte: startDate },
        },
        _count: { id: true },
      }) : [],

      // Scans by country
      qrCodeIds.length > 0 ? prisma.scan.groupBy({
        by: ['country'],
        where: {
          qrCodeId: { in: qrCodeIds },
          scannedAt: { gte: startDate },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      }) : [],

      // Scans over time (daily aggregation)
      qrCodeIds.length > 0 
        ? prisma.$queryRaw`
            SELECT 
              DATE("scannedAt") as date,
              COUNT(*) as scans
            FROM "Scan"
            WHERE "qrCodeId" = ANY(${qrCodeIds}::text[])
              AND "scannedAt" >= ${startDate}
            GROUP BY DATE("scannedAt")
            ORDER BY date ASC
          `
        : Promise.resolve([]),

      // Top QR codes
      prisma.qRCode.findMany({
        where: {
          userId,
          Scan: {
            some: {
              scannedAt: { gte: startDate },
            },
          },
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              Scan: {
                where: {
                  scannedAt: { gte: startDate },
                },
              },
            },
          },
        },
        orderBy: {
          Scan: {
            _count: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    // Format data
    const formattedData = {
      totalQRCodes,
      totalScans,
      scansByDevice: scansByDevice.map((d: any) => ({
        device: d.device || 'Unknown',
        count: d._count.id,
      })),
      scansByBrowser: scansByBrowser.map((d: any) => ({
        browser: d.browser || 'Unknown',
        count: d._count.id,
      })),
      scansByCountry: scansByCountry.map((d: any) => ({
        country: d.country || 'Unknown',
        count: d._count.id,
      })),
      scansOverTime: (scansOverTime as any[]).map((d: any) => ({
        date: new Date(d.date).toISOString().split('T')[0],
        scans: Number(d.scans),
      })),
      topQRCodes: topQRCodes.map((qr: any) => ({
        id: qr.id,
        name: qr.name || 'Unnamed',
        scanCount: qr._count.Scan,
      })),
    };

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error.message },
      { status: 500 }
    );
  }
}
