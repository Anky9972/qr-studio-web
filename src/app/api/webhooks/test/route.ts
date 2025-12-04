import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST /api/webhooks/test - Test a webhook URL
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { url, event = 'qr.bulk.completed', payload = {} } = body;

    if (!url) {
      return NextResponse.json({ error: 'Webhook URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== 'https:') {
        return NextResponse.json(
          { error: 'Webhook URL must use HTTPS', success: false },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid webhook URL format', success: false },
        { status: 400 }
      );
    }

    // Send test payload to webhook
    const testPayload = {
      event,
      timestamp: new Date().toISOString(),
      data: {
        test: true,
        userId: (session.user as any).id,
        userEmail: session.user.email,
        ...payload,
      },
    };

    try {
      const webhookResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'QR-Studio-Webhook/1.0',
        },
        body: JSON.stringify(testPayload),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (webhookResponse.ok) {
        return NextResponse.json({
          success: true,
          message: `Webhook test successful! Status: ${webhookResponse.status}`,
          statusCode: webhookResponse.status,
        });
      } else {
        const errorText = await webhookResponse.text().catch(() => 'Unknown error');
        return NextResponse.json({
          success: false,
          message: `Webhook returned error status ${webhookResponse.status}`,
          statusCode: webhookResponse.status,
          error: errorText.substring(0, 200), // Limit error message length
        });
      }
    } catch (error: any) {
      console.error('Webhook test error:', error);
      
      let errorMessage = 'Failed to connect to webhook';
      if (error.name === 'AbortError') {
        errorMessage = 'Webhook request timed out (10s)';
      } else if (error.cause?.code === 'ENOTFOUND') {
        errorMessage = 'Webhook URL not found (DNS error)';
      } else if (error.cause?.code === 'ECONNREFUSED') {
        errorMessage = 'Connection refused by webhook endpoint';
      }

      return NextResponse.json({
        success: false,
        message: errorMessage,
        error: error.message,
      });
    }
  } catch (error) {
    console.error('Webhook test handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
