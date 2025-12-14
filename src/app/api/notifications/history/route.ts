import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/notifications/history - Fetch all notification history (announcements)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    // Get user's subscription to filter announcements
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscription: true },
    });

    const userPlan = user?.subscription?.toLowerCase() || 'free';

    // Fetch all active announcements that target this user's plan
    const announcements = await prisma.announcement.findMany({
      where: {
        active: true,
        OR: [
          { targetAudience: 'all' },
          { targetAudience: userPlan },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Transform announcements to notification format
    const notifications = announcements.map(announcement => ({
      id: announcement.id,
      type: 'announcement',
      subject: announcement.title,
      message: announcement.message,
      sentAt: announcement.createdAt.toISOString(),
      success: true,
      error: null,
    }));

    return NextResponse.json({
      notifications,
      total: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching notification history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification history' },
      { status: 500 }
    );
  }
}
