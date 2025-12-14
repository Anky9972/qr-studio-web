/**
 * Google Sheets Integration - Export Endpoint
 * POST: Export QR codes or analytics to Google Sheets
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { exportToSheets, type ExportOptions } from '@/lib/googleSheets';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!(session as any).accessToken) {
      return NextResponse.json(
        { error: 'Please connect your Google account first' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { exportType, qrCodeIds, spreadsheetId, sheetName } = body;

    const userId = (session.user as any).id;

    if (exportType === 'qr-codes') {
      // Export QR codes
      let qrCodes;

      if (qrCodeIds && qrCodeIds.length > 0) {
        // Export specific QR codes
        qrCodes = await prisma.qRCode.findMany({
          where: {
            id: { in: qrCodeIds },
            userId,
          },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        // Export all QR codes
        qrCodes = await prisma.qRCode.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 10000, // Limit to 10k
        });
      }

      if (qrCodes.length === 0) {
        return NextResponse.json(
          { error: 'No QR codes found to export' },
          { status: 400 }
        );
      }

      // Prepare data for export
      const headers = [
        'ID',
        'Name',
        'Type',
        'Content',
        'Short URL',
        'Scan Count',
        'Created At',
        'Last Scanned',
      ];

      const rows = qrCodes.map((qr) => [
        qr.id,
        qr.name || '',
        qr.type,
        qr.content,
        qr.shortUrl || '',
        qr.scanCount.toString(),
        qr.createdAt.toISOString(),
        qr.lastScanned ? qr.lastScanned.toISOString() : '',
      ]);

      const options: ExportOptions = {
        spreadsheetId,
        sheetName: sheetName || 'QR Codes',
        title: 'QR Studio - QR Codes Export',
        headers,
        rows,
      };

      const resultSpreadsheetId = await exportToSheets(options);

      return NextResponse.json({
        success: true,
        spreadsheetId: resultSpreadsheetId,
        url: `https://docs.google.com/spreadsheets/d/${resultSpreadsheetId}`,
        exported: qrCodes.length,
      });
    } else if (exportType === 'analytics') {
      // Export analytics/scans
      const qrCodes = await prisma.qRCode.findMany({
        where: { userId },
        include: {
          Scan: {
            orderBy: { scannedAt: 'desc' },
            take: 10000, // Limit to 10k scans
          },
        },
      });

      const allScans = qrCodes.flatMap((qr) =>
        qr.Scan.map((scan) => ({
          ...scan,
          qrName: qr.name || 'Unnamed',
        }))
      );

      if (allScans.length === 0) {
        return NextResponse.json(
          { error: 'No analytics data found to export' },
          { status: 400 }
        );
      }

      // Prepare data
      const headers = [
        'QR Code ID',
        'QR Code Name',
        'Scan ID',
        'Scanned At',
        'Country',
        'City',
        'Device Type',
        'Browser',
        'OS',
        'IP Address',
      ];

      const rows = allScans.map((scan) => [
        scan.qrCodeId,
        scan.qrName,
        scan.id,
        scan.scannedAt.toISOString(),
        scan.country || '',
        scan.city || '',
        scan.device || '',
        scan.browser || '',
        scan.os || '',
        scan.ipAddress || '',
      ]);

      const options: ExportOptions = {
        spreadsheetId,
        sheetName: sheetName || 'Analytics',
        title: 'QR Studio - Analytics Export',
        headers,
        rows,
      };

      const resultSpreadsheetId = await exportToSheets(options);

      return NextResponse.json({
        success: true,
        spreadsheetId: resultSpreadsheetId,
        url: `https://docs.google.com/spreadsheets/d/${resultSpreadsheetId}`,
        exported: allScans.length,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid export type. Use "qr-codes" or "analytics".' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Google Sheets export error:', error);

    if (error.message === 'Not authenticated with Google') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error.code === 403) {
      return NextResponse.json(
        { error: 'Access denied to create/update spreadsheet' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to export to Google Sheets' },
      { status: 500 }
    );
  }
}
