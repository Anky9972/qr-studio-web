import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/user/export-data
 * 
 * GDPR Data Export - Right to Data Portability
 * 
 * Exports all user data in JSON format including:
 * - Account information
 * - QR codes
 * - Scan analytics
 * - Team memberships
 * - API keys
 * - Webhooks
 * - Subscription details
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        qrCodes: {
          include: {
            scans: true
          }
        },
        teamMembers: {
          include: {
            team: {
              include: {
                members: true,
              }
            }
          }
        },
        apiKeys: true,
        webhooks: {
          include: {
            logs: {
              take: 100,
              orderBy: { createdAt: 'desc' as const }
            }
          }
        },
        templates: true
      }
    }) as any;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive data
    const exportData = {
      exportDate: new Date().toISOString(),
      exportType: 'GDPR Data Export',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        plan: user.plan,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      qrCodes: user.qrCodes?.map((qr: any) => ({
        id: qr.id,
        name: qr.name,
        type: qr.type,
        content: qr.content,
        design: qr.design,
        createdAt: qr.createdAt,
        updatedAt: qr.updatedAt,
        scans: qr.scans?.map((scan: any) => ({
          id: scan.id,
          scannedAt: scan.scannedAt,
          device: scan.device,
          browser: scan.browser,
          os: scan.os,
          country: scan.country,
          city: scan.city
        })) || []
      })) || [],
      teams: user.teamMembers?.map((membership: any) => ({
        role: membership.role,
        joinedAt: membership.joinedAt,
        team: {
          id: membership.team.id,
          name: membership.team.name,
          createdAt: membership.team.createdAt,
          memberCount: membership.team.members?.length || 0
        }
      })) || [],
      apiKeys: user.apiKeys?.map((key: any) => ({
        id: key.id,
        name: key.name,
        prefix: key.key.substring(0, 8) + '...',
        createdAt: key.createdAt,
        lastUsedAt: key.lastUsedAt,
        expiresAt: key.expiresAt
      })) || [],
      webhooks: user.webhooks?.map((webhook: any) => ({
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        active: webhook.active,
        createdAt: webhook.createdAt,
        recentLogs: webhook.logs?.map((log: any) => ({
          event: log.event,
          success: log.success,
          statusCode: log.statusCode,
          createdAt: log.createdAt
        })) || []
      })) || [],
      templates: user.templates?.map((template: any) => ({
        id: template.id,
        name: template.name,
        category: template.category,
        createdAt: template.createdAt
      })) || [],
      statistics: {
        totalQRCodes: user.qrCodes?.length || 0,
        totalScans: user.qrCodes?.reduce((sum: number, qr: any) => sum + (qr.scans?.length || 0), 0) || 0,
        totalTeams: user.teamMembers?.length || 0,
        totalAPIKeys: user.apiKeys?.length || 0,
        totalWebhooks: user.webhooks?.length || 0
      }
    };

    // Return as downloadable JSON file
    const filename = `qrstudio-data-export-${user.id}-${Date.now()}.json`;
    
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
