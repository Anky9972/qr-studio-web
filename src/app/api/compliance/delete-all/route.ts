import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
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

    // Log the deletion before we delete everything
    await (prisma as any).auditLog.create({
      data: {
        userId: user.id,
        action: 'DELETE',
        entityType: 'User',
        entityId: user.id,
        details: {
          reason: 'User requested complete data deletion',
          timestamp: new Date().toISOString(),
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    });

    // Delete all user data (Prisma cascade will handle relations)
    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({ 
      success: true, 
      message: 'All data deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user data:', error);
    return NextResponse.json(
      { error: 'Failed to delete data' },
      { status: 500 }
    );
  }
}
