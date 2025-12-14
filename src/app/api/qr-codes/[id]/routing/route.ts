import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { RoutingCondition } from '@/types/routing';
import crypto from 'crypto';

// GET /api/qr-codes/[id]/routing - Get routing rules for a QR code
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
        RoutingRule: {
          orderBy: { priority: 'desc' },
        },
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json({ rules: qrCode.RoutingRule });
  } catch (error: any) {
    console.error('Error fetching routing rules:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/qr-codes/[id]/routing - Create a routing rule
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
    const { type, condition, destination, priority = 0 } = body;

    // Validate input
    if (!type || !condition || !destination) {
      return NextResponse.json(
        { error: 'type, condition, and destination are required' },
        { status: 400 }
      );
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

    // Create routing rule
    const rule = await prisma.routingRule.create({
      data: {
        id: crypto.randomUUID(),
        qrCodeId: id,
        type,
        condition: condition as any,
        destination,
        priority,
        active: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating routing rule:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
