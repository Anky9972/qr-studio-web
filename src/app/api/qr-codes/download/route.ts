import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { format = 'png', qrCodeIds } = body;

    if (!qrCodeIds || !Array.isArray(qrCodeIds) || qrCodeIds.length === 0) {
      return NextResponse.json(
        { error: 'QR code IDs are required' },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;

    // Fetch QR codes
    const qrCodes = await prisma.qRCode.findMany({
      where: {
        id: { in: qrCodeIds },
        userId,
      },
    });

    if (qrCodes.length === 0) {
      return NextResponse.json(
        { error: 'No QR codes found' },
        { status: 404 }
      );
    }

    // Single file download
    if (qrCodes.length === 1) {
      const qr = qrCodes[0];
      let buffer: Buffer;
      let contentType: string;
      let filename: string;

      if (format === 'svg') {
        const svgString = await QRCode.toString(qr.content, {
          type: 'svg',
          width: qr.size,
          color: {
            dark: qr.foreground,
            light: qr.background,
          },
        });
        buffer = Buffer.from(svgString, 'utf-8');
        contentType = 'image/svg+xml';
        filename = `${qr.name || 'qrcode'}.svg`;
      } else {
        const dataUrl = await QRCode.toDataURL(qr.content, {
          width: qr.size,
          color: {
            dark: qr.foreground,
            light: qr.background,
          },
        });
        const base64Data = dataUrl.split(',')[1];
        buffer = Buffer.from(base64Data, 'base64');
        contentType = 'image/png';
        filename = `${qr.name || 'qrcode'}.png`;
      }

      return new NextResponse(buffer as any, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    // Multiple files - create ZIP
    const zip = new JSZip();

    for (const qr of qrCodes) {
      try {
        if (format === 'svg') {
          const svgString = await QRCode.toString(qr.content, {
            type: 'svg',
            width: qr.size,
            color: {
              dark: qr.foreground,
              light: qr.background,
            },
          });
          zip.file(`${qr.name || qr.id}.svg`, svgString);
        } else {
          const dataUrl = await QRCode.toDataURL(qr.content, {
            width: qr.size,
            color: {
              dark: qr.foreground,
              light: qr.background,
            },
          });
          const base64Data = dataUrl.split(',')[1];
          zip.file(`${qr.name || qr.id}.png`, base64Data, { base64: true });
        }
      } catch (err) {
        console.error(`Failed to generate QR for ${qr.id}:`, err);
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(zipBuffer as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="qr-codes-${Date.now()}.zip"`,
      },
    });
  } catch (error: any) {
    console.error('Error downloading QR codes:', error);
    return NextResponse.json(
      { error: 'Failed to download QR codes', details: error.message },
      { status: 500 }
    );
  }
}
