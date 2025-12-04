// Cron Jobs and Scheduled Tasks
// Run expiration checks, send weekly reports, auto-archive, etc.

import { prisma } from './prisma';
import {
  checkExpiringQRCodes,
  sendAllWeeklyReports,
  sendLimitWarning,
} from './notifications';
import { sendDomainVerifiedNotification } from './notifications';

/**
 * Check and archive expired QR codes
 * Run daily
 */
export async function archiveExpiredQRCodes(): Promise<void> {
  try {
    const now = new Date();

    // Find expired QR codes
    const expiredQRCodes = await prisma.qRCode.findMany({
      where: {
        expiresAt: {
          lt: now,
        },
        // Add a flag to check if not already archived (you may need to add this field)
      },
      select: {
        id: true,
        userId: true,
        name: true,
        expiresAt: true,
      },
    });

    if (expiredQRCodes.length === 0) {
      console.log('No expired QR codes to archive');
      return;
    }

    // Update QR codes to mark as expired/inactive
    // Option 1: Soft delete (add 'archived' field to schema)
    // Option 2: Move to archive table
    // Option 3: Just log expiration

    for (const qr of expiredQRCodes) {
      // For now, just log
      console.log(
        `QR Code ${qr.id} (${qr.name}) expired on ${qr.expiresAt?.toISOString()}`
      );

      // You could add an 'archived' field to schema and update it:
      // await prisma.qRCode.update({
      //   where: { id: qr.id },
      //   data: { archived: true },
      // });
    }

    console.log(`Processed ${expiredQRCodes.length} expired QR codes`);
  } catch (error) {
    console.error('Error archiving expired QR codes:', error);
  }
}

/**
 * Check user limits and send warnings
 * Run daily
 */
export async function checkUserLimits(): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      where: {
        emailNotifications: true,
      },
      select: {
        id: true,
        plan: true,
        _count: {
          select: {
            qrCodes: true,
          },
        },
      },
    });

    const planLimits: Record<string, number> = {
      FREE: 50,
      PRO: 100,
      BUSINESS: 1000,
      ENTERPRISE: 999999,
    };

    for (const user of users) {
      const limit = planLimits[user.plan.toUpperCase()] || 50;
      const current = user._count.qrCodes;
      const percentage = (current / limit) * 100;

      // Send warnings at 80%, 90%, 95%, 100%
      if (percentage >= 80 && percentage < 90) {
        await sendLimitWarning(user.id, 'qr_codes', current, limit, 80);
      } else if (percentage >= 90 && percentage < 95) {
        await sendLimitWarning(user.id, 'qr_codes', current, limit, 90);
      } else if (percentage >= 95 && percentage < 100) {
        await sendLimitWarning(user.id, 'qr_codes', current, limit, 95);
      } else if (percentage >= 100) {
        await sendLimitWarning(user.id, 'qr_codes', current, limit, 100);
      }
    }

    console.log(`Checked limits for ${users.length} users`);
  } catch (error) {
    console.error('Error checking user limits:', error);
  }
}

/**
 * Verify pending custom domains
 * Run every hour
 */
export async function verifyPendingDomains(): Promise<void> {
  try {
    // Get domains that are not verified
    const pendingDomains = await prisma.customDomain.findMany({
      where: {
        verified: false,
      },
      select: {
        id: true,
        userId: true,
        domain: true,
        verificationToken: true,
      },
    });

    for (const domain of pendingDomains) {
      try {
        // Perform DNS check (simplified - you'll need actual DNS verification)
        const isVerified = await checkDNSVerification(
          domain.domain,
          domain.verificationToken
        );

        if (isVerified) {
          // Update domain as verified
          await prisma.customDomain.update({
            where: { id: domain.id },
            data: {
              verified: true,
              verifiedAt: new Date(),
            },
          });

          // Send notification
          await sendDomainVerifiedNotification(domain.userId, domain.domain);

          console.log(`Domain ${domain.domain} verified`);
        }
      } catch (error) {
        console.error(`Error verifying domain ${domain.domain}:`, error);
      }
    }

    console.log(`Checked ${pendingDomains.length} pending domains`);
  } catch (error) {
    console.error('Error verifying pending domains:', error);
  }
}

/**
 * Clean up old scan data (GDPR compliance)
 * Run weekly
 */
export async function cleanupOldScanData(): Promise<void> {
  try {
    // Delete scans older than 1 year (adjust based on your policy)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const result = await prisma.scan.deleteMany({
      where: {
        scannedAt: {
          lt: oneYearAgo,
        },
      },
    });

    console.log(`Deleted ${result.count} old scan records`);
  } catch (error) {
    console.error('Error cleaning up old scan data:', error);
  }
}

/**
 * Clean up old notification logs
 * Run weekly
 */
export async function cleanupOldNotificationLogs(): Promise<void> {
  try {
    // Delete notification logs older than 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await prisma.notificationLog.deleteMany({
      where: {
        sentAt: {
          lt: ninetyDaysAgo,
        },
      },
    });

    console.log(`Deleted ${result.count} old notification logs`);
  } catch (error) {
    console.error('Error cleaning up notification logs:', error);
  }
}

/**
 * Clean up old webhook logs
 * Run weekly
 */
export async function cleanupOldWebhookLogs(): Promise<void> {
  try {
    // Delete webhook logs older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await prisma.webhookLog.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    console.log(`Deleted ${result.count} old webhook logs`);
  } catch (error) {
    console.error('Error cleaning up webhook logs:', error);
  }
}

/**
 * Check DNS verification for custom domain
 * This is a simplified version - implement actual DNS lookup
 */
async function checkDNSVerification(
  domain: string,
  verificationToken: string
): Promise<boolean> {
  try {
    // In production, use dns.promises.resolveTxt() or external DNS API
    // Check for TXT record: qr-verification=<verificationToken>
    // For now, return false (manual verification needed)
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Main cron job runner
 * Configure these in your deployment (Vercel Cron, AWS EventBridge, etc.)
 */
export const cronJobs = {
  // Run every hour
  hourly: async () => {
    await verifyPendingDomains();
  },

  // Run daily at 2 AM
  daily: async () => {
    await checkExpiringQRCodes();
    await archiveExpiredQRCodes();
    await checkUserLimits();
  },

  // Run weekly on Mondays at 9 AM
  weekly: async () => {
    await sendAllWeeklyReports();
    await cleanupOldScanData();
    await cleanupOldNotificationLogs();
    await cleanupOldWebhookLogs();
  },
};

/**
 * Example API route to trigger cron jobs
 * Add authentication/API key in production
 */
export async function runScheduledTask(taskName: string): Promise<void> {
  console.log(`Running scheduled task: ${taskName}`);

  switch (taskName) {
    case 'expiring-qrcodes':
      await checkExpiringQRCodes();
      break;
    case 'archive-expired':
      await archiveExpiredQRCodes();
      break;
    case 'check-limits':
      await checkUserLimits();
      break;
    case 'verify-domains':
      await verifyPendingDomains();
      break;
    case 'weekly-reports':
      await sendAllWeeklyReports();
      break;
    case 'cleanup-scans':
      await cleanupOldScanData();
      break;
    case 'cleanup-logs':
      await cleanupOldNotificationLogs();
      await cleanupOldWebhookLogs();
      break;
    case 'all-hourly':
      await cronJobs.hourly();
      break;
    case 'all-daily':
      await cronJobs.daily();
      break;
    case 'all-weekly':
      await cronJobs.weekly();
      break;
    default:
      throw new Error(`Unknown task: ${taskName}`);
  }

  console.log(`Completed scheduled task: ${taskName}`);
}
