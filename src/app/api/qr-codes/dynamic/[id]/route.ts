import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const qrCode = await prisma.qRCode.findFirst({
      where: {
        id,
        userId: (session.user as any).id,
        type: 'dynamic',
      },
      include: {
        _count: {
          select: { Scan: true },
        },
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: qrCode.id,
        name: qrCode.name,
        shortUrl: qrCode.shortUrl,
        fullUrl: `${process.env.NEXT_PUBLIC_APP_URL}/r/${qrCode.shortUrl}`,
        destination: qrCode.destination,
        password: !!qrCode.password,
        expiresAt: qrCode.expiresAt,
        scanCount: qrCode._count.Scan,
        qrCode: qrCode.content,
        design: qrCode.design,
        createdAt: qrCode.createdAt,
        updatedAt: qrCode.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error fetching dynamic QR code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR code', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, destination, password, expiresAt } = body;
    const { id } = await params;

    // Verify ownership
    const existing = await prisma.qRCode.findFirst({
      where: {
        id,
        userId: (session.user as any).id,
        type: 'dynamic',
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    // Update QR code
    const updated = await prisma.qRCode.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        destination: destination !== undefined ? destination : undefined,
        password: password !== undefined ? (password || null) : undefined,
        expiresAt: expiresAt !== undefined ? (expiresAt ? new Date(expiresAt) : null) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Dynamic QR code updated successfully',
      data: {
        id: updated.id,
        name: updated.name,
        destination: updated.destination,
        expiresAt: updated.expiresAt,
      },
    });
  } catch (error: any) {
    console.error('Error updating dynamic QR code:', error);
    return NextResponse.json(
      { error: 'Failed to update QR code', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership and delete
    const deleted = await prisma.qRCode.deleteMany({
      where: {
        id,
        userId: (session.user as any).id,
        type: 'dynamic',
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Dynamic QR code deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting dynamic QR code:', error);
    return NextResponse.json(
      { error: 'Failed to delete QR code', details: error.message },
      { status: 500 }
    );
  }
}
