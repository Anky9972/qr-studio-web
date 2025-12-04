import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { testWebhook as testWebhookDelivery } from '@/lib/webhooks';

// POST /api/webhooks/[id]/test - Test webhook delivery
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: webhookId } = await params;

    const result = await testWebhookDelivery(webhookId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          statusCode: result.statusCode,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Test webhook sent successfully',
      statusCode: result.statusCode,
      response: result.response,
    });
  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to test webhook' },
      { status: 500 }
    );
  }
}
