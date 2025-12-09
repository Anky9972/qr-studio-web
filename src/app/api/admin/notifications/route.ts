import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { sendAdminNotificationEmail } from '@/lib/emailService';

// Middleware to check admin access
async function checkAdmin(session: any) {
  if (!session?.user) {
    return { error: 'Unauthorized', status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    return { error: 'Forbidden', status: 403 };
  }

  return null;
}

// POST /api/admin/notifications - Send internal notification to users
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const adminCheck = await checkAdmin(session);
    if (adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await request.json();
    const { subject, message, recipients, notificationType } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Determine recipient users based on filter
    let recipientFilter: any = {};

    if (recipients === 'all') {
      // All users
      recipientFilter = {};
    } else if (recipients === 'free') {
      recipientFilter.subscription = 'FREE';
    } else if (recipients === 'pro') {
      recipientFilter.subscription = 'PRO';
    } else if (recipients === 'business') {
      recipientFilter.subscription = 'BUSINESS';
    } else if (recipients === 'enterprise') {
      recipientFilter.subscription = 'ENTERPRISE';
    } else if (recipients === 'active') {
      recipientFilter.lastLoginAt = {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      };
    } else if (recipients === 'inactive') {
      recipientFilter.lastLoginAt = {
        lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // More than 30 days ago
      };
    } else if (Array.isArray(recipients)) {
      // Specific user IDs
      recipientFilter.id = {
        in: recipients,
      };
    }

    const users = await prisma.user.findMany({
      where: recipientFilter,
      select: { id: true, email: true, name: true },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'No users found matching the criteria' },
        { status: 400 }
      );
    }

    // Create notification logs for all users
    const notificationLogs = users.map((user) => ({
      userId: user.id,
      type: notificationType || 'admin_message',
      subject,
      message,
      success: true, // Used for unread status in some logic? Or maybe just 'log created successfully'
    }));

    await prisma.notificationLog.createMany({
      data: notificationLogs,
    });

    // Send emails asynchronously (don't block response)
    const emailPromises = users.map(user =>
      sendAdminNotificationEmail(
        user.email!,
        user.name || 'User',
        subject,
        message
      )
    );

    // Note: In a production serverless env (Vercel), this might be cut off if not awaited.
    await Promise.allSettled(emailPromises);

    return NextResponse.json({
      message: 'Notifications sent successfully',
      totalRecipients: users.length,
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/admin/notifications - Get all notification logs (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const adminCheck = await checkAdmin(session);
    if (adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const type = searchParams.get('type') || 'all';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (type !== 'all') {
      where.type = type;
    }

    const [notifications, totalCount] = await Promise.all([
      prisma.notificationLog.findMany({
        where,
        orderBy: {
          sentAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.notificationLog.count({ where }),
    ]);

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching notification logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
