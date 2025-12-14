import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { ComplianceSettings: true } as any,
    }) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return existing settings or defaults
    const settings = user.ComplianceSettings || {
      gdprMode: false,
      dataRetentionDays: 365,
      anonymizeScans: false,
      allowDataExport: true,
      allowDataDeletion: true,
      cookieConsentRequired: true,
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching compliance settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();

    // Validate input
    const {
      gdprMode,
      dataRetentionDays,
      anonymizeScans,
      allowDataExport,
      allowDataDeletion,
      cookieConsentRequired,
    } = body;

    // Ensure data retention is within bounds
    const validRetentionDays = Math.max(30, Math.min(3650, dataRetentionDays || 365));

    // Upsert compliance settings
    const settings = await prisma.complianceSettings.upsert({
      where: { userId: user.id },
      create: {
        id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId: user.id,
        gdprMode: gdprMode ?? false,
        dataRetentionDays: validRetentionDays,
        anonymizeScans: anonymizeScans ?? false,
        allowDataExport: allowDataExport ?? true,
        allowDataDeletion: allowDataDeletion ?? true,
        cookieConsentRequired: cookieConsentRequired ?? true,
        updatedAt: new Date(),
      },
      update: {
        gdprMode: gdprMode ?? false,
        dataRetentionDays: validRetentionDays,
        anonymizeScans: anonymizeScans ?? false,
        allowDataExport: allowDataExport ?? true,
        allowDataDeletion: allowDataDeletion ?? true,
        cookieConsentRequired: cookieConsentRequired ?? true,
        updatedAt: new Date(),
      },
    });

    // Log the action
    await (prisma as any).auditLog.create({
      data: {
        userId: user.id,
        action: 'UPDATE',
        entityType: 'ComplianceSettings',
        entityId: settings.id,
        details: {
          gdprMode,
          anonymizeScans,
          dataRetentionDays: validRetentionDays,
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error saving compliance settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
