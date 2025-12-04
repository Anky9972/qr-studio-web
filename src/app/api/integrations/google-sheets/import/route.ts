/**
 * Google Sheets Integration - Import Endpoint
 * POST: Import QR codes from Google Sheets
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  extractSpreadsheetId,
  getSheetData,
  parseSheetData,
  validateColumnMapping,
  mapSheetRowsToQRData,
  type ColumnMapping,
} from '@/lib/googleSheets';
import { prisma } from '@/lib/prisma';
import { getPlanLimits } from '@/lib/plan-limits';

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
    const { url, sheet, mapping, options } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Missing spreadsheet URL' },
        { status: 400 }
      );
    }

    if (!mapping || !mapping.content) {
      return NextResponse.json(
        { error: 'Missing column mapping. At least "content" field is required.' },
        { status: 400 }
      );
    }

    const spreadsheetId = extractSpreadsheetId(url);
    const sheetName = sheet || 'Sheet1';
    const range = `${sheetName}!A1:Z10000`;

    // Fetch data
    const data = await getSheetData(spreadsheetId, range);
    const parsed = parseSheetData(data);

    // Validate mapping
    const validation = validateColumnMapping(
      mapping as ColumnMapping,
      parsed.headers,
      ['content']
    );

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid column mapping', details: validation.errors },
        { status: 400 }
      );
    }

    // Map rows to QR data
    const qrDataList = mapSheetRowsToQRData(parsed.rows, mapping as ColumnMapping);

    if (qrDataList.length === 0) {
      return NextResponse.json(
        { error: 'No valid data found in the spreadsheet' },
        { status: 400 }
      );
    }

    // Check plan limits
    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user can create this many QR codes
    const currentCount = await prisma.qRCode.count({
      where: { userId },
    });

    const planLimits = getPlanLimits(user.plan);
    const maxQrCodes = planLimits.qrCodes;
    const remainingCapacity = maxQrCodes - currentCount;

    if (remainingCapacity < qrDataList.length) {
      return NextResponse.json(
        {
          error: 'Plan limit exceeded',
          message: `Your plan allows ${maxQrCodes} QR codes. You have ${currentCount} and are trying to import ${qrDataList.length}, but only ${remainingCapacity} slots remain.`,
        },
        { status: 403 }
      );
    }

    // Create QR codes
    const created = [];
    const errors = [];

    for (const qrData of qrDataList) {
      try {
        const qrCode = await prisma.qRCode.create({
          data: {
            userId,
            name: qrData.name || `Sheet Import - ${qrData.content.substring(0, 20)}`,
            content: qrData.content,
            type: qrData.type || 'url',
            qrType: qrData.type || 'url',
            foreground: qrData.color || '#000000',
            background: qrData.bgColor || '#FFFFFF',
            logo: qrData.logo || null,
            errorLevel: qrData.errorCorrection || 'M',
            size: qrData.size || 512,
          },
        });

        created.push(qrCode);
      } catch (error: any) {
        console.error('Error creating QR code:', error);
        errors.push({
          content: qrData.content,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      imported: created.length,
      errors: errors.length,
      details: {
        created: created.map((qr) => ({ id: qr.id, name: qr.name })),
        errors,
      },
    });
  } catch (error: any) {
    console.error('Google Sheets import error:', error);

    if (error.message === 'Invalid Google Sheets URL or ID') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error.message === 'Not authenticated with Google') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error.code === 403) {
      return NextResponse.json(
        { error: 'Access denied to spreadsheet' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to import from Google Sheets' },
      { status: 500 }
    );
  }
}
