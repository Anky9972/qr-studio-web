/**
 * Google Sheets Integration - Info Endpoint
 * GET: Fetch spreadsheet metadata
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { extractSpreadsheetId, getSpreadsheetInfo } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has Google OAuth token
    if (!(session as any).accessToken) {
      return NextResponse.json(
        { error: 'Please connect your Google account first' },
        { status: 400 }
      );
    }

    // Get spreadsheet ID from query params
    const { searchParams } = new URL(request.url);
    const urlOrId = searchParams.get('url') || searchParams.get('id');

    if (!urlOrId) {
      return NextResponse.json(
        { error: 'Missing spreadsheet URL or ID' },
        { status: 400 }
      );
    }

    // Extract spreadsheet ID
    const spreadsheetId = extractSpreadsheetId(urlOrId);

    // Fetch spreadsheet info
    const info = await getSpreadsheetInfo(spreadsheetId);

    return NextResponse.json({
      success: true,
      data: info,
    });
  } catch (error: any) {
    console.error('Google Sheets info error:', error);

    if (error.message === 'Invalid Google Sheets URL or ID') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error.message === 'Not authenticated with Google') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Google API errors
    if (error.code === 403) {
      return NextResponse.json(
        { error: 'Access denied. Please grant permission to access this spreadsheet.' },
        { status: 403 }
      );
    }

    if (error.code === 404) {
      return NextResponse.json(
        { error: 'Spreadsheet not found. Please check the URL and try again.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch spreadsheet info' },
      { status: 500 }
    );
  }
}
