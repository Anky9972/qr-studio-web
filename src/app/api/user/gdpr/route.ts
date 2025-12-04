import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/user/data-export - Export all user data (GDPR)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Fetch all user data
    const [
      user,
      qrCodes,
      scans,
      campaigns,
      templates,
      customDomains,
      webhooks,
      apiKeys,
      teamMembers,
      microsites,
      notificationSettings,
      notificationLogs,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          role: true,
          plan: true,
          planExpiry: true,
          subscription: true,
          lastLoginAt: true,
          emailNotifications: true,
          scanAlerts: true,
          weeklyReports: true,
          limitWarnings: true,
          expirationReminders: true,
          createdAt: true,
          updatedAt: true,
        },
      }),

      prisma.qRCode.findMany({
        where: { userId },
        include: {
          campaign: true,
          scans: {
            select: {
              id: true,
              ipAddress: true,
              country: true,
              city: true,
              device: true,
              browser: true,
              os: true,
              scannedAt: true,
            },
          },
          routingRules: true,
          pixelConfigs: true,
        },
      }),

      prisma.scan.findMany({
        where: {
          qrCode: {
            userId,
          },
        },
        select: {
          id: true,
          qrCodeId: true,
          ipAddress: true,
          userAgent: true,
          country: true,
          city: true,
          device: true,
          browser: true,
          os: true,
          referrer: true,
          visitorId: true,
          isUnique: true,
          scannedAt: true,
        },
      }),

      prisma.campaign.findMany({
        where: { userId },
      }),

      prisma.template.findMany({
        where: { userId },
      }),

      prisma.customDomain.findMany({
        where: { userId },
      }),

      prisma.webhook.findMany({
        where: { userId },
        include: {
          logs: {
            take: 100,
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      }),

      prisma.apiKey.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          keyPrefix: true,
          lastUsedAt: true,
          expiresAt: true,
          createdAt: true,
        },
      }),

      prisma.teamMember.findMany({
        where: { userId },
        include: {
          team: true,
        },
      }),

      prisma.microsite.findMany({
        where: { userId },
      }),

      prisma.notificationSetting.findMany({
        where: { userId },
      }),

      prisma.notificationLog.findMany({
        where: { userId },
        orderBy: {
          sentAt: 'desc',
        },
        take: 1000,
      }),
    ]);

    const exportData = {
      user,
      qrCodes,
      scans: scans.length,
      campaigns,
      templates,
      customDomains,
      webhooks,
      apiKeys,
      teamMembers,
      microsites,
      notificationSettings,
      notificationLogs: notificationLogs.length,
      exportedAt: new Date().toISOString(),
      dataRetentionPolicy: 'Data will be retained until account deletion',
    };

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="qr-studio-data-export-${userId}-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/data-deletion - Delete all user data (GDPR)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { confirmEmail } = body;

    // Verify email confirmation
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user || user.email !== confirmEmail) {
      return NextResponse.json(
        { error: 'Email confirmation does not match' },
        { status: 400 }
      );
    }

    // Delete user account (cascade will handle all related data)
    // This includes: QR codes, scans, campaigns, templates, domains, webhooks, etc.
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: 'Account and all associated data have been permanently deleted',
    });
  } catch (error) {
    console.error('Data deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account data' },
      { status: 500 }
    );
  }
}
