import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Middleware to check admin access
async function checkAdminAccess(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { authorized: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true, role: true },
  });

  if (!user?.isAdmin && user?.role !== 'admin') {
    return { authorized: false, response: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) };
  }

  return { authorized: true, userId };
}

// GET /api/admin - System-wide analytics
export async function GET(request: NextRequest) {
  const adminCheck = await checkAdminAccess(request);
  if (!adminCheck.authorized) {
    return adminCheck.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (range) {
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
      case 'all':
        startDate.setFullYear(2020, 0, 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Fetch comprehensive system stats
    const [
      totalUsers,
      activeUsers,
      newUsers,
      totalQRCodes,
      totalScans,
      totalDomains,
      totalWebhooks,
      totalApiKeys,
      planDistribution,
      recentActivity,
      topUsers,
      scanTrends,
    ] = await Promise.all([
      // Total users
      prisma.user.count(),

      // Active users (logged in within range)
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: startDate,
          },
        },
      }),

      // New users in range
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),

      // Total QR codes
      prisma.qRCode.count(),

      // Total scans in range
      prisma.scan.count({
        where: {
          scannedAt: {
            gte: startDate,
          },
        },
      }),

      // Total custom domains
      prisma.customDomain.count(),

      // Total webhooks
      prisma.webhook.count(),

      // Total API keys
      prisma.apiKey.count(),

      // Plan distribution
      prisma.user.groupBy({
        by: ['plan'],
        _count: {
          id: true,
        },
      }),

      // Recent activity (last 10 users)
      prisma.user.findMany({
        orderBy: {
          lastLoginAt: 'desc',
        },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          lastLoginAt: true,
          createdAt: true,
        },
      }),

      // Top users by QR codes
      prisma.user.findMany({
        orderBy: {
          QRCode: {
            _count: 'desc',
          },
        },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          _count: {
            select: {
              QRCode: true,
            },
          },
        },
      }),

      // Scan trends (daily)
      prisma.$queryRaw`
        SELECT DATE(scanned_at) as date, COUNT(*) as count
        FROM "Scan"
        WHERE scanned_at >= ${startDate}
        GROUP BY DATE(scanned_at)
        ORDER BY date ASC
      `,
    ]);

    // Calculate growth metrics
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const previousUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    });

    const previousScans = await prisma.scan.count({
      where: {
        scannedAt: {
          gte: previousPeriodStart,
          lt: startDate,
        },
      },
    });

    const userGrowth = previousUsers > 0 ? ((newUsers - previousUsers) / previousUsers) * 100 : 0;
    const scanGrowth = previousScans > 0 ? ((totalScans - previousScans) / previousScans) * 100 : 0;

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        newUsers,
        totalQRCodes,
        totalScans,
        totalDomains,
        totalWebhooks,
        totalApiKeys,
        userGrowth: parseFloat(userGrowth.toFixed(2)),
        scanGrowth: parseFloat(scanGrowth.toFixed(2)),
      },
      planDistribution: planDistribution.map((p: any) => ({
        plan: p.plan,
        count: p._count.id,
      })),
      recentActivity,
      topUsers,
      scanTrends,
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin analytics' },
      { status: 500 }
    );
  }
}
