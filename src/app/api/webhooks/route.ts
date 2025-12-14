import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { generateWebhookSecret } from '@/lib/webhooks';
import { z } from 'zod';

const webhookSchema = z.object({
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).min(1, 'At least one event must be selected'),
});

// GET /api/webhooks - List user's webhooks
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const webhooks = await prisma.webhook.findMany({
      where: { userId },
      include: {
        _count: {
          select: { WebhookLog: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ webhooks });
  } catch (error) {
    console.error('Get webhooks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhooks' },
      { status: 500 }
    );
  }
}

// POST /api/webhooks - Create new webhook
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    // Validate request
    const validation = webhookSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { url, events } = validation.data;

    // Check plan limits (webhooks available for PRO+ users)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.plan === 'FREE' || user?.plan === 'free') {
      return NextResponse.json(
        { error: 'Webhooks are only available for PRO and BUSINESS plans' },
        { status: 403 }
      );
    }

    // Count existing webhooks
    const webhookCount = await prisma.webhook.count({
      where: { userId },
    });

    // Limit: PRO = 3 webhooks, BUSINESS = 10 webhooks
    const limit = user?.plan === 'PRO' || user?.plan === 'pro' ? 3 : 10;
    if (webhookCount >= limit) {
      return NextResponse.json(
        {
          error: `You've reached your limit of ${limit} webhooks`,
          limit,
          current: webhookCount,
        },
        { status: 403 }
      );
    }

    // Generate webhook secret
    const secret = generateWebhookSecret();

    // Create webhook
    const webhook = await prisma.webhook.create({
      data: {
        userId,
        url,
        events,
        secret,
      },
    });

    return NextResponse.json(
      {
        webhook,
        message: 'Webhook created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to create webhook' },
      { status: 500 }
    );
  }
}
