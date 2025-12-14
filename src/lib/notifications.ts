// Notification Service - Email alerts and reports
import { prisma } from './prisma';
import { sendEmail } from './emailService';
import crypto from 'crypto';

export type NotificationType =
  | 'scan_alert'
  | 'weekly_report'
  | 'limit_warning'
  | 'expiration_reminder'
  | 'domain_verified'
  | 'qr_expired';

export interface NotificationData {
  userId: string;
  type: NotificationType;
  qrCodeId?: string;
  data: any;
}

/**
 * Send scan alert notification
 */
export async function sendScanAlert(
  userId: string,
  qrCodeId: string,
  scanData: {
    country: string;
    city: string;
    device: string;
    timestamp: Date;
  }
): Promise<void> {
  try {
    // Check if user has scan alerts enabled
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        scanAlerts: true,
        emailNotifications: true,
      },
    });

    if (!user?.email || !user.scanAlerts || !user.emailNotifications) {
      return;
    }

    // Get QR code details
    const qrCode = await prisma.qRCode.findUnique({
      where: { id: qrCodeId },
      select: {
        name: true,
        shortUrl: true,
        scanCount: true,
      },
    });

    if (!qrCode) return;

    const subject = `🔔 New Scan: ${qrCode.name || qrCode.shortUrl}`;
    const message = `
      <h2>Your QR Code was just scanned!</h2>
      <p><strong>QR Code:</strong> ${qrCode.name || qrCode.shortUrl}</p>
      <p><strong>Location:</strong> ${scanData.city}, ${scanData.country}</p>
      <p><strong>Device:</strong> ${scanData.device}</p>
      <p><strong>Time:</strong> ${scanData.timestamp.toLocaleString()}</p>
      <p><strong>Total Scans:</strong> ${qrCode.scanCount}</p>
      <br>
      <p><a href="${process.env.NEXTAUTH_URL}/dashboard/qr-codes/${qrCodeId}">View Analytics</a></p>
    `;

    await sendEmail({
      to: user.email,
      subject,
      html: message,
    });

    // Log notification
    await logNotification(userId, 'scan_alert', subject, message, true);
  } catch (error) {
    console.error('Error sending scan alert:', error);
    await logNotification(
      userId,
      'scan_alert',
      'Scan Alert',
      '',
      false,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * Send weekly report
 */
export async function sendWeeklyReport(userId: string): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        weeklyReports: true,
        emailNotifications: true,
      },
    });

    if (!user?.email || !user.weeklyReports || !user.emailNotifications) {
      return;
    }

    // Get last 7 days of data
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const [qrCodes, totalScans, topQR] = await Promise.all([
      prisma.qRCode.count({ where: { userId } }),
      prisma.scan.count({
        where: {
          QRCode: { userId },
          scannedAt: { gte: lastWeek },
        },
      }),
      prisma.qRCode.findFirst({
        where: { userId },
        orderBy: { scanCount: 'desc' },
        select: {
          name: true,
          shortUrl: true,
          scanCount: true,
        },
      }),
    ]);

    const subject = '📊 Your Weekly QR Code Report';
    const message = `
      <h2>Weekly Report Summary</h2>
      <p>Here's what happened with your QR codes this week:</p>
      <ul>
        <li><strong>Total QR Codes:</strong> ${qrCodes}</li>
        <li><strong>Total Scans:</strong> ${totalScans}</li>
        <li><strong>Top Performer:</strong> ${topQR?.name || topQR?.shortUrl || 'N/A'} (${topQR?.scanCount || 0} scans)</li>
      </ul>
      <br>
      <p><a href="${process.env.NEXTAUTH_URL}/dashboard/analytics">View Full Analytics</a></p>
    `;

    await sendEmail({
      to: user.email,
      subject,
      html: message,
    });

    await logNotification(userId, 'weekly_report', subject, message, true);
  } catch (error) {
    console.error('Error sending weekly report:', error);
    await logNotification(
      userId,
      'weekly_report',
      'Weekly Report',
      '',
      false,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * Send limit warning
 */
export async function sendLimitWarning(
  userId: string,
  limitType: 'qr_codes' | 'dynamic_qr' | 'scans',
  current: number,
  limit: number,
  percentage: number
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        limitWarnings: true,
        emailNotifications: true,
        plan: true,
      },
    });

    if (!user?.email || !user.limitWarnings || !user.emailNotifications) {
      return;
    }

    let limitName = '';
    switch (limitType) {
      case 'qr_codes':
        limitName = 'QR Codes';
        break;
      case 'dynamic_qr':
        limitName = 'Dynamic QR Codes';
        break;
      case 'scans':
        limitName = 'Monthly Scans';
        break;
    }

    const subject = `⚠️ ${percentage}% of ${limitName} Limit Reached`;
    const message = `
      <h2>Usage Limit Warning</h2>
      <p>You've used <strong>${current} of ${limit}</strong> ${limitName} (${percentage}%).</p>
      <p>Current Plan: <strong>${user.plan.toUpperCase()}</strong></p>
      <br>
      <p>Consider upgrading your plan to avoid interruptions.</p>
      <p><a href="${process.env.NEXTAUTH_URL}/dashboard/settings/billing">Upgrade Plan</a></p>
    `;

    await sendEmail({
      to: user.email,
      subject,
      html: message,
    });

    await logNotification(userId, 'limit_warning', subject, message, true);
  } catch (error) {
    console.error('Error sending limit warning:', error);
    await logNotification(
      userId,
      'limit_warning',
      'Limit Warning',
      '',
      false,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * Send expiration reminder
 */
export async function sendExpirationReminder(
  userId: string,
  qrCodeId: string,
  daysUntilExpiration: number
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        expirationReminders: true,
        emailNotifications: true,
      },
    });

    if (!user?.email || !user.expirationReminders || !user.emailNotifications) {
      return;
    }

    const qrCode = await prisma.qRCode.findUnique({
      where: { id: qrCodeId },
      select: {
        name: true,
        shortUrl: true,
        expiresAt: true,
      },
    });

    if (!qrCode || !qrCode.expiresAt) return;

    const subject = `⏰ QR Code Expiring in ${daysUntilExpiration} Days`;
    const message = `
      <h2>QR Code Expiration Notice</h2>
      <p>Your QR Code <strong>${qrCode.name || qrCode.shortUrl}</strong> will expire in ${daysUntilExpiration} days.</p>
      <p><strong>Expiration Date:</strong> ${qrCode.expiresAt.toLocaleDateString()}</p>
      <br>
      <p>Update the expiration date or download a backup now.</p>
      <p><a href="${process.env.NEXTAUTH_URL}/dashboard/qr-codes/${qrCodeId}">Manage QR Code</a></p>
    `;

    await sendEmail({
      to: user.email,
      subject,
      html: message,
    });

    await logNotification(userId, 'expiration_reminder', subject, message, true);
  } catch (error) {
    console.error('Error sending expiration reminder:', error);
    await logNotification(
      userId,
      'expiration_reminder',
      'Expiration Reminder',
      '',
      false,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

/**
 * Send domain verified notification
 */
export async function sendDomainVerifiedNotification(
  userId: string,
  domain: string
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        emailNotifications: true,
      },
    });

    if (!user?.email || !user.emailNotifications) {
      return;
    }

    const subject = `✅ Custom Domain Verified: ${domain}`;
    const message = `
      <h2>Domain Successfully Verified!</h2>
      <p>Your custom domain <strong>${domain}</strong> has been verified and is now active.</p>
      <p>You can now use this domain for your QR codes.</p>
      <br>
      <p><a href="${process.env.NEXTAUTH_URL}/dashboard/settings/domains">Manage Domains</a></p>
    `;

    await sendEmail({
      to: user.email,
      subject,
      html: message,
    });

    await logNotification(userId, 'domain_verified', subject, message, true);
  } catch (error) {
    console.error('Error sending domain verified notification:', error);
  }
}

/**
 * Log notification to database
 */
async function logNotification(
  userId: string,
  type: string,
  subject: string,
  message: string,
  success: boolean,
  error?: string
): Promise<void> {
  try {
    await prisma.notificationLog.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        type,
        subject,
        message,
        success,
        error,
      },
    });
  } catch (err) {
    console.error('Error logging notification:', err);
  }
}

/**
 * Check and send expiration reminders (cron job)
 * Should be run daily
 */
export async function checkExpiringQRCodes(): Promise<void> {
  try {
    const reminderDays = [7, 3, 1]; // Send reminders at 7, 3, and 1 day before expiration

    for (const days of reminderDays) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + days);
      targetDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      // Find QR codes expiring in X days
      const expiringQRCodes = await prisma.qRCode.findMany({
        where: {
          expiresAt: {
            gte: targetDate,
            lt: nextDay,
          },
        },
        select: {
          id: true,
          userId: true,
          expiresAt: true,
        },
      });

      // Send reminders
      for (const qr of expiringQRCodes) {
        await sendExpirationReminder(qr.userId, qr.id, days);
      }

      console.log(`Sent ${expiringQRCodes.length} expiration reminders for ${days} days`);
    }
  } catch (error) {
    console.error('Error checking expiring QR codes:', error);
  }
}

/**
 * Send weekly reports to all users (cron job)
 * Should be run weekly
 */
export async function sendAllWeeklyReports(): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      where: {
        weeklyReports: true,
        emailNotifications: true,
        email: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    for (const user of users) {
      await sendWeeklyReport(user.id);
    }

    console.log(`Sent weekly reports to ${users.length} users`);
  } catch (error) {
    console.error('Error sending weekly reports:', error);
  }
}
