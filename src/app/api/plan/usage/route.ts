import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getPlanLimits } from '@/lib/plan-limits';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Get user with counts
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        _count: {
          select: {
            QRCode: true,
            Campaign: true,
            TeamMember: true,
            ApiKey: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Count dynamic QR codes
    const dynamicQrCount = await prisma.qRCode.count({
      where: {
        userId,
        type: 'dynamic',
      },
    });

    // Get plan limits
    const limits = getPlanLimits(user.plan || 'FREE');

    // Calculate usage percentages
    const usage = {
      qrCodes: {
        used: user._count.QRCode,
        limit: limits.qrCodes,
        percentage: Math.round((user._count.QRCode / limits.qrCodes) * 100),
      },
      dynamicQrCodes: {
        used: dynamicQrCount,
        limit: limits.dynamicQrCodes,
        percentage: limits.dynamicQrCodes > 0
          ? Math.round((dynamicQrCount / limits.dynamicQrCodes) * 100)
          : 0,
      },
      teamMembers: {
        used: (user._count as any).TeamMember,
        limit: limits.teamMembers,
        percentage: Math.round(((user._count as any).TeamMember / limits.teamMembers) * 100),
      },
      campaigns: {
        used: (user._count as any).Campaign,
        limit: 999999, // No limit for campaigns
        percentage: 0,
      },
    };

    return NextResponse.json({
      plan: user.plan || 'FREE',
      limits,
      usage,
      features: limits.features,
    });
  } catch (error) {
    console.error('Get plan usage error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan usage' },
      { status: 500 }
    );
  }
}
