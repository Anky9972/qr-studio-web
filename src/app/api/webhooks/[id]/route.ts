import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { testWebhook } from '@/lib/webhooks';
import { z } from 'zod';

const webhookUpdateSchema = z.object({
  url: z.string().url().optional(),
  events: z.array(z.string()).min(1).optional(),
  active: z.boolean().optional(),
});

// GET /api/webhooks/[id] - Get webhook details
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id: webhookId } = await params;

    const webhook = await prisma.webhook.findFirst({
      where: {
        id: webhookId,
        userId,
      },
      include: {
        WebhookLog: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        _count: {
          select: { WebhookLog: true },
        },
      },
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json({ webhook });
  } catch (error) {
    console.error('Get webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch webhook' },
      { status: 500 }
    );
  }
}

// PATCH /api/webhooks/[id] - Update webhook
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id: webhookId } = await params;
    const body = await request.json();

    // Validate request
    const validation = webhookUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Check webhook ownership
    const existing = await prisma.webhook.findFirst({
      where: {
        id: webhookId,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Update webhook
    const webhook = await prisma.webhook.update({
      where: { id: webhookId },
      data: validation.data,
    });

    return NextResponse.json({
      webhook,
      message: 'Webhook updated successfully',
    });
  } catch (error) {
    console.error('Update webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to update webhook' },
      { status: 500 }
    );
  }
}

// DELETE /api/webhooks/[id] - Delete webhook
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id: webhookId } = await params;

    // Check webhook ownership
    const webhook = await prisma.webhook.findFirst({
      where: {
        id: webhookId,
        userId,
      },
    });

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    // Delete webhook (cascade deletes logs)
    await prisma.webhook.delete({
      where: { id: webhookId },
    });

    return NextResponse.json({
      message: 'Webhook deleted successfully',
    });
  } catch (error) {
    console.error('Delete webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to delete webhook' },
      { status: 500 }
    );
  }
}
