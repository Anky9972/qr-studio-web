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
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch audit logs for this user
    const logs = await (prisma as any).auditLog.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await (prisma as any).auditLog.count({
      where: { userId: user.id },
    });

    return NextResponse.json({ logs, total });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
