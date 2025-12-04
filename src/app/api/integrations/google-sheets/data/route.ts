/**
 * Google Sheets Integration - Data Endpoint
 * GET: Fetch data from a specific sheet/range
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { extractSpreadsheetId, getSheetData, parseSheetData } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const urlOrId = searchParams.get('url') || searchParams.get('id');
    const sheetName = searchParams.get('sheet') || 'Sheet1';
    const rangeParam = searchParams.get('range');

    if (!urlOrId) {
      return NextResponse.json(
        { error: 'Missing spreadsheet URL or ID' },
        { status: 400 }
      );
    }

    const spreadsheetId = extractSpreadsheetId(urlOrId);

    // Build range (e.g., "Sheet1!A1:Z1000")
    const range = rangeParam || `${sheetName}!A1:Z1000`;

    // Fetch data
    const data = await getSheetData(spreadsheetId, range);

    // Parse data with headers
    const parsed = parseSheetData(data);

    return NextResponse.json({
      success: true,
      data: {
        raw: data.values,
        parsed,
        rowCount: data.values.length,
        columnCount: data.values[0]?.length || 0,
      },
    });
  } catch (error: any) {
    console.error('Google Sheets data error:', error);

    if (error.message === 'Invalid Google Sheets URL or ID') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error.message === 'Not authenticated with Google') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error.code === 403) {
      return NextResponse.json(
        { error: 'Access denied. Please grant permission to access this spreadsheet.' },
        { status: 403 }
      );
    }

    if (error.code === 404) {
      return NextResponse.json(
        { error: 'Spreadsheet not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch spreadsheet data' },
      { status: 500 }
    );
  }
}
