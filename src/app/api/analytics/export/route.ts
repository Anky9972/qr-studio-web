import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { format, metrics, startDate, endDate } = body;

    // Fetch analytics data based on metrics
    const qrCodes = await prisma.qRCode.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        Scan: {
          where: {
            scannedAt: {
              gte: startDate ? new Date(startDate) : undefined,
              lte: endDate ? new Date(endDate) : undefined,
            },
          },
        },
      },
    });

    // Prepare export data
    const exportData = qrCodes.map(qr => ({
      Name: qr.name || 'Unnamed',
      Type: qr.type,
      'Total Scans': qr.Scan.length,
      'Created Date': qr.createdAt.toLocaleDateString(),
      'Short URL': qr.shortUrl || 'N/A',
    }));

    // Generate file based on format
    if (format === 'csv') {
      const csv = [
        Object.keys(exportData[0] || {}).join(','),
        ...exportData.map(row => Object.values(row).join(',')),
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="analytics-${Date.now()}.csv"`,
        },
      });
    }

    if (format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Analytics');
      
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="analytics-${Date.now()}.xlsx"`,
        },
      });
    }

    if (format === 'pdf') {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(16);
      doc.text('QR Code Analytics Report', 14, 20);
      
      // Add date range
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
      if (startDate && endDate) {
        doc.text(`Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`, 14, 36);
      }

      // Add table
      (doc as any).autoTable({
        startY: 45,
        head: [Object.keys(exportData[0] || {})],
        body: exportData.map(row => Object.values(row)),
      });

      const pdfBuffer = doc.output('arraybuffer');

      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="analytics-${Date.now()}.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });

  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export analytics', details: error.message },
      { status: 500 }
    );
  }
}
