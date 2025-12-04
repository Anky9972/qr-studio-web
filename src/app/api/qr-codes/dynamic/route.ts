import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      destination,
      qrType = 'url',
      size = 512,
      foreground = '#000000',
      background = '#FFFFFF',
      password,
      expiresAt,
      design,
    } = body;

    if (!destination) {
      return NextResponse.json({ error: 'Destination URL is required' }, { status: 400 });
    }

    // Generate short code
    const shortCode = nanoid(8);
    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/r/${shortCode}`;

    // Generate QR code pointing to short URL
    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, {
      width: size,
      color: {
        dark: foreground,
        light: background,
      },
      errorCorrectionLevel: 'M',
    });

    // Create dynamic QR code in database
    const qrCode = await prisma.qRCode.create({
      data: {
        userId: (session.user as any).id,
        name: name || 'Dynamic QR Code',
        type: 'dynamic',
        content: qrCodeDataUrl,
        qrType,
        size,
        foreground,
        background,
        shortUrl: shortCode,
        destination,
        password: password || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        design: design || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: qrCode.id,
        shortUrl,
        fullUrl: `${process.env.NEXT_PUBLIC_APP_URL}/r/${shortCode}`,
        qrCode: qrCodeDataUrl,
      },
    });
  } catch (error: any) {
    console.error('Error creating dynamic QR code:', error);
    return NextResponse.json(
      { error: 'Failed to create dynamic QR code', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const skip = (page - 1) * limit;

    const [qrCodes, total] = await Promise.all([
      prisma.qRCode.findMany({
        where: {
          userId: (session.user as any).id,
          type: 'dynamic',
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { scans: true },
          },
        },
      }),
      prisma.qRCode.count({
        where: {
          userId: (session.user as any).id,
          type: 'dynamic',
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        qrCodes: qrCodes.map((qr: any) => ({
          id: qr.id,
          name: qr.name,
          shortUrl: qr.shortUrl,
          fullUrl: `${process.env.NEXT_PUBLIC_APP_URL}/r/${qr.shortUrl}`,
          destination: qr.destination,
          scanCount: qr._count.scans,
          expiresAt: qr.expiresAt,
          createdAt: qr.createdAt,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching dynamic QR codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dynamic QR codes', details: error.message },
      { status: 500 }
    );
  }
}
