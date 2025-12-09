import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

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
    const { subject, body: emailBody, recipients, sendAt } = body;

    if (!subject || !emailBody) {
      return NextResponse.json(
        { error: 'Subject and body are required' },
        { status: 400 }
      );
    }

    // Get SMTP server configuration
    const SMTP_SERVER_URL = process.env.SMTP_SERVER_URL || 'http://localhost:3001';
    const SMTP_API_KEY = process.env.SMTP_API_KEY || '';

    console.log('[Send Email] Using SMTP server:', SMTP_SERVER_URL);

    // Get recipient emails based on filter
    let recipientFilter: any = {};
    
    if (recipients === 'free') {
      recipientFilter.subscription = 'FREE';
    } else if (recipients === 'pro') {
      recipientFilter.subscription = 'PRO';
    } else if (recipients === 'business') {
      recipientFilter.subscription = 'BUSINESS';
    } else if (recipients === 'enterprise') {
      recipientFilter.subscription = 'ENTERPRISE';
    } else if (recipients === 'inactive') {
      recipientFilter.lastLoginAt = {
        lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      };
    }

    const users = await prisma.user.findMany({
      where: recipientFilter,
      select: { email: true, name: true },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'No recipients found matching the criteria' },
        { status: 400 }
      );
    }

    // If scheduled, save for later (email queue would be implemented in production)
    if (sendAt) {
      return NextResponse.json(
        { message: 'Email scheduled successfully (queue not implemented)', recipientCount: users.length },
        { status: 200 }
      );
    }

    // Send emails immediately via SMTP server
    console.log('[Send Email] Sending to', users.length, 'recipients');
    
    let successCount = 0;
    let failureCount = 0;

    const emailPromises = users.map(async (recipient) => {
      try {
        if (!recipient.email) return { success: false };
        
        const response = await fetch(`${SMTP_SERVER_URL}/api/email/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SMTP_API_KEY}`,
          },
          body: JSON.stringify({
            to: recipient.email,
            subject,
            html: emailBody,
          }),
        });

        if (response.ok) {
          console.log('[Send Email] ✓ Sent to', recipient.email);
          return { success: true };
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('[Send Email] ✗ Failed to send to', recipient.email, errorData);
          return { success: false };
        }
      } catch (error) {
        console.error('[Send Email] ✗ Error sending to', recipient.email, error);
        return { success: false };
      }
    });

    const results = await Promise.allSettled(emailPromises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.success) {
        successCount++;
      } else {
        failureCount++;
      }
    });

    console.log('[Send Email] Results:', successCount, 'success,', failureCount, 'failed');

    return NextResponse.json({
      message: 'Emails sent',
      totalRecipients: users.length,
      successCount,
      failureCount,
    });
  } catch (error) {
    console.error('[Send Email] Error:', error);
    console.error('[Send Email] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
