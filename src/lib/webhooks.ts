import crypto from 'crypto';
import { prisma } from './prisma';

// Webhook event types
export const WEBHOOK_EVENTS = {
  QR_CREATED: 'qr.created',
  QR_UPDATED: 'qr.updated',
  QR_DELETED: 'qr.deleted',
  QR_SCANNED: 'qr.scanned',
  CAMPAIGN_CREATED: 'campaign.created',
  CAMPAIGN_UPDATED: 'campaign.updated',
  CAMPAIGN_DELETED: 'campaign.deleted',
} as const;

export type WebhookEvent = typeof WEBHOOK_EVENTS[keyof typeof WEBHOOK_EVENTS];

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: any;
  userId: string;
}

// Generate HMAC signature for webhook payload
export function generateWebhookSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateWebhookSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Send webhook with retry logic
export async function sendWebhook(
  webhookId: string,
  event: WebhookEvent,
  data: any,
  attempt: number = 1
): Promise<void> {
  const webhook = await prisma.webhook.findUnique({
    where: { id: webhookId },
  });

  if (!webhook || !webhook.active) {
    console.log(`Webhook ${webhookId} is inactive or not found`);
    return;
  }

  // Check if webhook subscribes to this event
  if (!webhook.events.includes(event)) {
    console.log(`Webhook ${webhookId} not subscribed to event ${event}`);
    return;
  }

  const payload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
    userId: webhook.userId,
  };

  const payloadString = JSON.stringify(payload);
  const signature = generateWebhookSignature(payloadString, webhook.secret);

  let success = false;
  let statusCode: number | null = null;
  let response: any = null;
  let error: string | null = null;

  try {
    const fetchResponse = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': event,
        'User-Agent': 'QRStudio-Webhooks/1.0',
      },
      body: payloadString,
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    statusCode = fetchResponse.status;
    success = fetchResponse.ok;

    try {
      response = await fetchResponse.json();
    } catch {
      response = await fetchResponse.text();
    }

    // Update webhook last used time and reset failure count on success
    if (success) {
      await prisma.webhook.update({
        where: { id: webhookId },
        data: {
          lastUsedAt: new Date(),
          failureCount: 0,
        },
      });
    } else {
      error = `HTTP ${statusCode}: ${JSON.stringify(response)}`;
      await handleWebhookFailure(webhookId, attempt);
    }
  } catch (err: any) {
    error = err.message || 'Unknown error';
    await handleWebhookFailure(webhookId, attempt);
  }

  // Log webhook delivery attempt
  await prisma.webhookLog.create({
    data: {
      webhookId,
      event,
      payload: payload as any,
      response,
      statusCode,
      success,
      attempt,
      error,
    },
  });

  // Retry with exponential backoff if failed and not max attempts
  if (!success && attempt < 3) {
    const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
    setTimeout(() => {
      sendWebhook(webhookId, event, data, attempt + 1);
    }, delay);
  }
}

// Handle webhook failure
async function handleWebhookFailure(webhookId: string, attempt: number): Promise<void> {
  const webhook = await prisma.webhook.findUnique({
    where: { id: webhookId },
  });

  if (!webhook) return;

  const newFailureCount = webhook.failureCount + 1;

  // Deactivate webhook after 10 consecutive failures
  if (newFailureCount >= 10) {
    await prisma.webhook.update({
      where: { id: webhookId },
      data: {
        active: false,
        failureCount: newFailureCount,
      },
    });
    console.log(`Webhook ${webhookId} deactivated after ${newFailureCount} failures`);
  } else {
    await prisma.webhook.update({
      where: { id: webhookId },
      data: {
        failureCount: newFailureCount,
      },
    });
  }
}

// Trigger webhook for all user's webhooks
export async function triggerWebhooks(
  userId: string,
  event: WebhookEvent,
  data: any
): Promise<void> {
  const webhooks = await prisma.webhook.findMany({
    where: {
      userId,
      active: true,
      events: {
        has: event,
      },
    },
  });

  // Send webhooks in parallel
  await Promise.allSettled(
    webhooks.map((webhook) => sendWebhook(webhook.id, event, data))
  );
}

// Generate a random webhook secret
export function generateWebhookSecret(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Test webhook delivery
export async function testWebhook(webhookId: string): Promise<{
  success: boolean;
  statusCode?: number;
  response?: any;
  error?: string;
}> {
  const webhook = await prisma.webhook.findUnique({
    where: { id: webhookId },
  });

  if (!webhook) {
    return { success: false, error: 'Webhook not found' };
  }

  const payload: WebhookPayload = {
    event: 'qr.created' as WebhookEvent,
    timestamp: new Date().toISOString(),
    data: {
      test: true,
      message: 'This is a test webhook delivery',
    },
    userId: webhook.userId,
  };

  const payloadString = JSON.stringify(payload);
  const signature = generateWebhookSignature(payloadString, webhook.secret);

  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': 'qr.created',
        'User-Agent': 'QRStudio-Webhooks/1.0',
      },
      body: payloadString,
      signal: AbortSignal.timeout(10000),
    });

    const responseData = await response.text();

    // Log test
    await prisma.webhookLog.create({
      data: {
        webhookId,
        event: 'qr.created',
        payload: payload as any,
        response: responseData,
        statusCode: response.status,
        success: response.ok,
        attempt: 1,
      },
    });

    return {
      success: response.ok,
      statusCode: response.status,
      response: responseData,
    };
  } catch (err: any) {
    await prisma.webhookLog.create({
      data: {
        webhookId,
        event: 'qr.created',
        payload: payload as any,
        statusCode: null,
        success: false,
        attempt: 1,
        error: err.message,
      },
    });

    return {
      success: false,
      error: err.message,
    };
  }
}
