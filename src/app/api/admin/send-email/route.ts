import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// Create transporter with SMTP configuration
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });
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
    const { subject, body: emailBody, recipients, sendAt } = body;

    if (!subject || !emailBody) {
      return NextResponse.json(
        { error: 'Subject and body are required' },
        { status: 400 }
      );
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { error: 'SMTP server not configured. Please set SMTP environment variables.' },
        { status: 500 }
      );
    }

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

    // Send emails immediately
    const transporter = createTransporter();
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

    let successCount = 0;
    let failureCount = 0;

    for (const recipient of users) {
      try {
        if (!recipient.email) continue;
        
        await transporter.sendMail({
          from: `"QR Studio" <${fromEmail}>`,
          to: recipient.email,
          subject,
          html: emailBody,
        });
        successCount++;
      } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error);
        failureCount++;
      }
    }

    return NextResponse.json({
      message: 'Emails sent',
      totalRecipients: users.length,
      successCount,
      failureCount,
    });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
