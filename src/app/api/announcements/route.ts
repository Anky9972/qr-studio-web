import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's subscription to filter announcements
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { subscription: true },
    });

    const userPlan = user?.subscription?.toLowerCase() || 'free';

    // Fetch active announcements for user's plan
    const announcements = await prisma.announcement.findMany({
      where: {
        active: true,
        OR: [
          { targetAudience: 'all' },
          { targetAudience: userPlan },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
