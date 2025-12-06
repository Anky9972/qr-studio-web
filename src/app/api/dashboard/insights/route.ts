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
        const now = new Date();
        // Start of today (00:00:00)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // Start of yesterday (00:00:00)
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(todayStart.getDate() - 1);

        // Fetch data in parallel
        const [
            todayScansCount,
            yesterdayScansCount,
            todayQRCodesCount,
            topLocationsData,
            mostScannedData,
        ] = await Promise.all([
            // 1. Today's Scans
            prisma.scan.count({
                where: {
                    qrCode: { userId },
                    scannedAt: { gte: todayStart },
                },
            }),
            // 2. Yesterday's Scans (for trend)
            prisma.scan.count({
                where: {
                    qrCode: { userId },
                    scannedAt: {
                        gte: yesterdayStart,
                        lt: todayStart,
                    },
                },
            }),
            // 3. Today's QR Codes
            prisma.qRCode.count({
                where: {
                    userId,
                    createdAt: { gte: todayStart },
                },
            }),
            // 4. Top Locations
            prisma.scan.groupBy({
                by: ['country'],
                where: {
                    qrCode: { userId },
                    scannedAt: { gte: todayStart },
                    country: { not: null },
                },
                _count: {
                    country: true,
                },
                orderBy: {
                    _count: {
                        country: 'desc',
                    },
                },
                take: 3,
            }),
            // 5. Most Scanned QR
            prisma.scan.groupBy({
                by: ['qrCodeId'],
                where: {
                    qrCode: { userId },
                    scannedAt: { gte: todayStart },
                },
                _count: {
                    qrCodeId: true,
                },
                orderBy: {
                    _count: {
                        qrCodeId: 'desc',
                    },
                },
                take: 1,
            }),
        ]);

        // Calculate Trend
        let scanTrend = 0;
        if (yesterdayScansCount > 0) {
            scanTrend = ((todayScansCount - yesterdayScansCount) / yesterdayScansCount) * 100;
        } else if (todayScansCount > 0) {
            scanTrend = 100; // 100% increase if yesterday was 0 and today is > 0
        }

        // Format Top Locations
        const topLocations = topLocationsData.map((item) => ({
            country: item.country || 'Unknown',
            count: item._count.country,
        }));

        // Start with default most scanned
        let mostScanned = null;

        // If we have a most scanned QR, get its details
        if (mostScannedData.length > 0) {
            const qrId = mostScannedData[0].qrCodeId;
            const qrCode = await prisma.qRCode.findUnique({
                where: { id: qrId },
                select: { name: true, type: true }
            });

            if (qrCode) {
                mostScanned = {
                    name: qrCode.name,
                    type: qrCode.type,
                    scans: mostScannedData[0]._count.qrCodeId
                };
            }
        }

        return NextResponse.json({
            todayScans: todayScansCount,
            scanTrend: scanTrend.toFixed(1),
            todayQRCodes: todayQRCodesCount,
            mostScanned,
            topLocations,
        });
    } catch (error) {
        console.error('Dashboard insights error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard insights' },
            { status: 500 }
        );
    }
}
