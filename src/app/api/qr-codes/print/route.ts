import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import QRCode from 'qrcode';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      qrCodeId,
      format = 'png',
      size = 1024,
      dpi = 300,
      includeText = false,
      text,
      backgroundColor = '#FFFFFF',
      padding = 20,
    } = body;

    if (!qrCodeId) {
      return NextResponse.json(
        { error: 'QR code ID required' },
        { status: 400 }
      );
    }

    const userId = (session.user as any).id;

    // Fetch QR code
    const qrCode = await prisma.qRCode.findFirst({
      where: {
        id: qrCodeId,
        userId,
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 });
    }

    let buffer: Buffer;
    let contentType: string;
    let filename: string;

    if (format === 'pdf') {
      // Generate high-resolution PDF for print
      buffer = await generatePrintPDF(qrCode, {
        size,
        includeText,
        text: text || qrCode.name || qrCode.shortUrl,
        backgroundColor,
        padding,
      });
      contentType = 'application/pdf';
      filename = `${qrCode.name || 'qrcode'}-print.pdf`;
    } else if (format === 'svg') {
      // Generate SVG (vector format)
      const svgString = await QRCode.toString(qrCode.content, {
        type: 'svg',
        width: size,
        color: {
          dark: qrCode.foreground,
          light: qrCode.background,
        },
        errorCorrectionLevel: qrCode.errorLevel as any,
      });
      buffer = Buffer.from(svgString, 'utf-8');
      contentType = 'image/svg+xml';
      filename = `${qrCode.name || 'qrcode'}.svg`;
    } else {
      // Generate high-resolution PNG
      const dataUrl = await QRCode.toDataURL(qrCode.content, {
        width: size,
        color: {
          dark: qrCode.foreground,
          light: qrCode.background,
        },
        errorCorrectionLevel: qrCode.errorLevel as any,
      });
      const base64Data = dataUrl.split(',')[1];
      buffer = Buffer.from(base64Data, 'base64');
      contentType = 'image/png';
      filename = `${qrCode.name || 'qrcode'}-${size}px.png`;
    }

    return new NextResponse(buffer as any, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Print export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate print file' },
      { status: 500 }
    );
  }
}

/**
 * Generate print-ready PDF with QR code
 */
async function generatePrintPDF(
  qrCode: any,
  options: {
    size: number;
    includeText: boolean;
    text?: string;
    backgroundColor: string;
    padding: number;
  }
): Promise<Buffer> {
  try {
    // Generate QR code as PNG
    const qrDataUrl = await QRCode.toDataURL(qrCode.content, {
      width: options.size,
      color: {
        dark: qrCode.foreground,
        light: qrCode.background,
      },
      errorCorrectionLevel: qrCode.errorLevel as any,
    });

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    
    // Calculate page size (A4 or custom based on QR size)
    const qrSizeInches = options.size / 96; // 96 DPI to inches
    const pageWidth = Math.max(qrSizeInches + 2, 8.5) * 72; // Add 2 inch margin, min letter size
    const pageHeight = Math.max(qrSizeInches + 3, 11) * 72;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Add background color
    const bgColor = hexToRgb(options.backgroundColor);
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
      color: rgb(bgColor.r / 255, bgColor.g / 255, bgColor.b / 255),
    });

    // Embed QR code image
    const qrImage = await pdfDoc.embedPng(qrDataUrl);
    const qrDims = qrImage.scale(1);

    // Center QR code on page
    const qrX = (pageWidth - qrDims.width) / 2;
    const qrY = options.includeText
      ? (pageHeight - qrDims.height) / 2 + 50
      : (pageHeight - qrDims.height) / 2;

    page.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrDims.width,
      height: qrDims.height,
    });

    // Add text if requested
    if (options.includeText && options.text) {
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 24;
      const textWidth = font.widthOfTextAtSize(options.text, fontSize);
      const textX = (pageWidth - textWidth) / 2;
      const textY = qrY - 60;

      page.drawText(options.text, {
        x: textX,
        y: textY,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }

    // Add print marks (optional - for professional printing)
    // Crop marks at corners
    const markLength = 20;
    const markColor = rgb(0, 0, 0);

    // Top-left
    page.drawLine({
      start: { x: options.padding - markLength, y: pageHeight - options.padding },
      end: { x: options.padding, y: pageHeight - options.padding },
      thickness: 0.5,
      color: markColor,
    });
    page.drawLine({
      start: { x: options.padding, y: pageHeight - options.padding + markLength },
      end: { x: options.padding, y: pageHeight - options.padding },
      thickness: 0.5,
      color: markColor,
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}
