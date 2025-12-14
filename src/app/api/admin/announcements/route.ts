import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { sendAdminNotificationEmail } from '@/lib/emailService';

export async function GET(request: NextRequest) {
  try {
    console.log('[Announcements GET] Starting request');
    const session = await getServerSession(authOptions);
    console.log('[Announcements GET] Session:', session ? 'exists' : 'missing');

    if (!session?.user) {
      console.log('[Announcements GET] No session user - returning 401');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    console.log('[Announcements GET] Checking admin status for:', session.user.email);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      console.log('[Announcements GET] User is not admin - returning 403');
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    console.log('[Announcements GET] Fetching announcements from database...');
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });
    console.log('[Announcements GET] Found', announcements.length, 'announcements');

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('[Announcements GET] Error fetching announcements:', error);
    console.error('[Announcements GET] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, message, type, active, targetAudience, sendEmail, sendWebNotification } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    // Create the announcement record (for banners etc)
    const announcement = await prisma.announcement.create({
      data: {
        id: `ann_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        title,
        message,
        type: type || 'info',
        active: active !== undefined ? active : true,
        targetAudience: targetAudience || 'all',
        sendEmail: sendEmail || false,
        sendWebNotification: sendWebNotification !== undefined ? sendWebNotification : true,
        updatedAt: new Date(),
      },
    });

    // Determine target users for notifications/emails
    let whereClause: any = {};
    if (targetAudience === 'free') {
      whereClause = { subscription: 'FREE' };
    } else if (targetAudience === 'pro') {
      whereClause = { subscription: 'PRO' };
    } else if (targetAudience === 'business') {
      whereClause = { subscription: 'BUSINESS' };
    }
    // If 'all', whereClause remains empty

    const users = await prisma.user.findMany({
      where: whereClause,
      select: { id: true, email: true, name: true },
    });

    if (users.length > 0) {
      // 1. Create Dashboard Notifications (if enabled or implied)
      // The user requested that announcements show in the notification icon.
      if (sendWebNotification) {
        const notificationLogs = users.map((u) => ({
          id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${u.id}`,
          userId: u.id,
          type: 'announcement',
          subject: title,
          message: message, // Or a summarized version
          success: true,
        }));

        await prisma.notificationLog.createMany({
          data: notificationLogs,
        });
      }

      // 2. Send Emails (if enabled)
      if (sendEmail) {
        console.log('[Announcements] Sending styled emails to', users.length, 'users');

        const emailPromises = users.map(u =>
          sendAdminNotificationEmail(
            u.email!,
            u.name || 'User',
            `📢 ${title}`,
            message,
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`, // Action URL
            'View Announcement'
          )
        );

        // Process in background/await settled
        await Promise.allSettled(emailPromises);

        // Update announcement status
        await prisma.announcement.update({
          where: { id: announcement.id },
          data: {
            emailSent: true,
            emailSentAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ announcement }, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
