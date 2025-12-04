import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { checkBulkGenerationLimit } from '@/middleware/planLimits';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { batchSize } = body;

    if (!batchSize || typeof batchSize !== 'number') {
      return NextResponse.json(
        { error: 'Invalid batch size' },
        { status: 400 }
      );
    }

    // Check bulk generation limit
    const bulkCheck = await checkBulkGenerationLimit(userId, batchSize);
    
    if (!bulkCheck.allowed) {
      return NextResponse.json(
        {
          error: 'BULK_LIMIT_EXCEEDED',
          message: bulkCheck.message,
          requestedSize: bulkCheck.current,
          limit: bulkCheck.limit,
          percentage: bulkCheck.percentage,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      allowed: true,
      message: 'Bulk generation allowed',
      batchSize,
      limit: bulkCheck.limit,
    });
  } catch (error) {
    console.error('Check bulk generation error:', error);
    return NextResponse.json(
      { error: 'Failed to check bulk generation limit' },
      { status: 500 }
    );
  }
}
