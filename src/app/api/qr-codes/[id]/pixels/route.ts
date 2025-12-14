import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { validatePixelConfig } from '@/lib/pixelManager';
import crypto from 'crypto';

// GET /api/qr-codes/[id]/pixels - Get pixel configs for a QR code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const qrCode = await prisma.qRCode.findFirst({
      where: {
        id,
        User: { email: session.user.email },
      },
      include: {
        PixelConfig: true,
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json({ pixels: qrCode.PixelConfig });
  } catch (error: any) {
    console.error('Error fetching pixel configs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/qr-codes/[id]/pixels - Add a pixel to QR code
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { provider, pixelId, events = [], delayRedirect = 1000, scriptContent } = body;

    // Validate pixel config
    const validation = validatePixelConfig({ provider, pixelId, events, delayRedirect, scriptContent });
    if (!validation.valid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    // Verify ownership
    const qrCode = await prisma.qRCode.findFirst({
      where: {
        id,
        User: { email: session.user.email },
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Create pixel config
    const pixel = await prisma.pixelConfig.create({
      data: {
        id: crypto.randomUUID(),
        qrCodeId: id,
        provider,
        pixelId,
        events,
        delayRedirect,
        scriptContent: scriptContent || null,
        active: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ pixel }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating pixel config:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
