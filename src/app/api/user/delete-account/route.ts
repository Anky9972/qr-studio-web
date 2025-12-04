import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * DELETE /api/user/delete-account
 * 
 * GDPR Right to Erasure (Right to be Forgotten)
 * 
 * Permanently deletes user account and all associated data
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check for active paid plan
    if (user.plan !== 'FREE' && user.planExpiry && user.planExpiry > new Date()) {
      return NextResponse.json(
        {
          error: 'Cannot delete account with active subscription',
          message: 'Please cancel your subscription or wait for it to expire before deleting your account.'
        },
        { status: 400 }
      );
    }

    // Begin deletion process
    // Delete in order to respect foreign key constraints

    // 1. Delete webhook logs
    const webhooks = await prisma.webhook.findMany({
      where: { userId: user.id }
    });
    
    for (const webhook of webhooks) {
      await prisma.webhookLog.deleteMany({
        where: { webhookId: webhook.id }
      });
    }

    // 2. Delete webhooks
    await prisma.webhook.deleteMany({
      where: { userId: user.id }
    });

    // 3. Delete API keys
    await prisma.apiKey.deleteMany({
      where: { userId: user.id }
    });

    // 4. Delete QR code scans
    const qrCodes = await prisma.qRCode.findMany({
      where: { userId: user.id },
      select: { id: true }
    });

    for (const qr of qrCodes) {
      await prisma.scan.deleteMany({
        where: { qrCodeId: qr.id }
      });
    }

    // 5. Delete QR codes
    await prisma.qRCode.deleteMany({
      where: { userId: user.id }
    });

    // 6. Delete team memberships
    await prisma.teamMember.deleteMany({
      where: { userId: user.id }
    });

    // 7. Delete user sessions and accounts
    await prisma.session.deleteMany({
      where: { userId: user.id }
    });

    await prisma.account.deleteMany({
      where: { userId: user.id }
    });

    // 8. Finally, delete the user
    await prisma.user.delete({
      where: { id: user.id }
    });

    // Log deletion for compliance
    console.log(`[GDPR] User account deleted: ${user.id} (${user.email}) at ${new Date().toISOString()}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Your account has been permanently deleted',
        deletedAt: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete account',
        message: 'An error occurred while deleting your account. Please contact support.'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/delete-account
 * 
 * Check account deletion eligibility
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { confirmEmail } = body;

    if (confirmEmail !== session.user.email) {
      return NextResponse.json(
        { error: 'Email confirmation does not match' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Count related data
    const qrCodeCount = await prisma.qRCode.count({
      where: { userId: user.id }
    });

    const teamCount = await prisma.teamMember.count({
      where: { userId: user.id }
    });

    const hasActivePlan = user.plan !== 'FREE' && user.planExpiry && user.planExpiry > new Date();

    return NextResponse.json({
      canDelete: !hasActivePlan,
      hasActivePlan,
      qrCodeCount,
      teamCount,
      warning: hasActivePlan
        ? 'You must cancel your active subscription before deleting your account'
        : 'This action is permanent and cannot be undone. All your QR codes and data will be deleted.'
    });
  } catch (error) {
    console.error('Account deletion check error:', error);
    return NextResponse.json(
      { error: 'Failed to check account status' },
      { status: 500 }
    );
  }
}
