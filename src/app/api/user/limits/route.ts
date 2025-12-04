import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserLimitsStatus } from '@/middleware/planLimits';

// GET /api/user/limits - Get user's current limits and usage
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const limitsStatus = await getUserLimitsStatus(userId);

    return NextResponse.json(limitsStatus);
  } catch (error) {
    console.error('Get user limits error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user limits' },
      { status: 500 }
    );
  }
}
