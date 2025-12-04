import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Get real data from database
    const [
      totalUsers,
      totalQRCodes,
      totalScans,
      activeUsersLast30Days
    ] = await Promise.all([
      // Total registered users
      prisma.user.count(),
      
      // Total QR codes created
      prisma.qRCode.count(),
      
      // Total scans
      prisma.scan.count(),
      
      // Active users in last 30 days
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Format numbers for display
    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M+`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K+`;
      }
      return num.toString();
    };

    const stats = {
      activeUsers: formatNumber(activeUsersLast30Days),
      qrCodesCreated: formatNumber(totalQRCodes),
      totalScans: formatNumber(totalScans),
      totalUsers: formatNumber(totalUsers),
      // Uptime is calculated based on service monitoring (hardcoded for now)
      uptime: '99.9%',
      support: '24/7'
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    
    // Return fallback data on error
    return NextResponse.json({
      activeUsers: '0',
      qrCodesCreated: '0',
      totalScans: '0',
      totalUsers: '0',
      uptime: '99.9%',
      support: '24/7'
    });
  }
}
