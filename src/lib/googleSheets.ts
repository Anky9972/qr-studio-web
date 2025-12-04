/**
 * Google Sheets Integration Library
 * Handles authentication, data fetching, and export to Google Sheets
 */

import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export interface SheetData {
  range: string;
  values: string[][];
}

export interface SheetInfo {
  id: string;
  title: string;
  sheets: {
    id: number;
    title: string;
    rowCount: number;
    columnCount: number;
  }[];
}

/**
 * Get authenticated Google Sheets API client
 */
export async function getSheetsClient() {
  const session = await getServerSession(authOptions);
  
  if (!session || !(session as any).accessToken) {
    throw new Error('Not authenticated with Google');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: (session as any).accessToken,
    refresh_token: (session as any).refreshToken,
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

/**
 * Extract spreadsheet ID from Google Sheets URL
 */
export function extractSpreadsheetId(urlOrId: string): string {
  // If it's already just an ID, return it
  if (!urlOrId.includes('/') && !urlOrId.includes(':')) {
    return urlOrId;
  }

  // Extract from URL patterns:
  // https://docs.google.com/spreadsheets/d/{ID}/edit
  const match = urlOrId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    return match[1];
  }

  throw new Error('Invalid Google Sheets URL or ID');
}

/**
 * Get spreadsheet metadata (title, sheets, etc.)
 */
export async function getSpreadsheetInfo(spreadsheetId: string): Promise<SheetInfo> {
  const sheets = await getSheetsClient();

  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'spreadsheetId,properties.title,sheets(properties(sheetId,title,gridProperties(rowCount,columnCount)))',
  });

  if (!response.data || !response.data.sheets) {
    throw new Error('Failed to fetch spreadsheet info');
  }

  return {
    id: response.data.spreadsheetId || spreadsheetId,
    title: response.data.properties?.title || 'Untitled',
    sheets: response.data.sheets.map((sheet) => ({
      id: sheet.properties?.sheetId || 0,
      title: sheet.properties?.title || 'Sheet1',
      rowCount: sheet.properties?.gridProperties?.rowCount || 0,
      columnCount: sheet.properties?.gridProperties?.columnCount || 0,
    })),
  };
}

/**
 * Fetch data from a specific range in a spreadsheet
 */
export async function getSheetData(
  spreadsheetId: string,
  range: string
): Promise<SheetData> {
  const sheets = await getSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  if (!response.data || !response.data.values) {
    return { range, values: [] };
  }

  return {
    range: response.data.range || range,
    values: response.data.values,
  };
}

/**
 * Parse sheet data with headers
 */
export interface ParsedSheetData {
  headers: string[];
  rows: Record<string, string>[];
}

export function parseSheetData(data: SheetData): ParsedSheetData {
  if (data.values.length === 0) {
    return { headers: [], rows: [] };
  }

  const [headerRow, ...dataRows] = data.values;
  const headers = headerRow.map((h) => String(h).trim());

  const rows = dataRows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] ? String(row[index]).trim() : '';
    });
    return obj;
  });

  return { headers, rows };
}

/**
 * Export data to Google Sheets
 */
export interface ExportOptions {
  spreadsheetId?: string; // If not provided, creates new spreadsheet
  sheetName?: string; // Sheet tab name (default: 'QR Codes')
  title?: string; // Spreadsheet title (for new spreadsheets)
  headers: string[];
  rows: string[][];
}

export async function exportToSheets(options: ExportOptions): Promise<string> {
  const sheets = await getSheetsClient();

  let spreadsheetId = options.spreadsheetId;

  // Create new spreadsheet if ID not provided
  if (!spreadsheetId) {
    const createResponse = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: options.title || 'QR Studio Export',
        },
        sheets: [
          {
            properties: {
              title: options.sheetName || 'QR Codes',
            },
          },
        ],
      },
    });

    spreadsheetId = createResponse.data.spreadsheetId!;
  }

  // Write data to sheet
  const range = `${options.sheetName || 'QR Codes'}!A1`;
  const values = [options.headers, ...options.rows];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values,
    },
  });

  return spreadsheetId;
}

/**
 * Validate column mapping
 */
export interface ColumnMapping {
  [qrField: string]: string; // QR field -> Sheet column header
}

export function validateColumnMapping(
  mapping: ColumnMapping,
  availableColumns: string[],
  requiredFields: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields are mapped
  for (const field of requiredFields) {
    if (!mapping[field]) {
      errors.push(`Required field "${field}" is not mapped`);
    }
  }

  // Check mapped columns exist
  for (const [field, column] of Object.entries(mapping)) {
    if (column && !availableColumns.includes(column)) {
      errors.push(`Column "${column}" does not exist in the sheet`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Map sheet rows to QR code data
 */
export interface QRCodeImportData {
  content: string;
  name?: string;
  type?: string;
  color?: string;
  bgColor?: string;
  logo?: string;
  errorCorrection?: string;
  size?: number;
  [key: string]: any;
}

export function mapSheetRowsToQRData(
  rows: Record<string, string>[],
  mapping: ColumnMapping
): QRCodeImportData[] {
  return rows
    .filter((row) => {
      // Filter out empty rows
      const contentColumn = mapping['content'];
      return contentColumn && row[contentColumn];
    })
    .map((row) => {
      const qrData: QRCodeImportData = {
        content: row[mapping['content']] || '',
      };

      // Map optional fields
      if (mapping['name'] && row[mapping['name']]) {
        qrData.name = row[mapping['name']];
      }
      if (mapping['type'] && row[mapping['type']]) {
        qrData.type = row[mapping['type']];
      }
      if (mapping['color'] && row[mapping['color']]) {
        qrData.color = row[mapping['color']];
      }
      if (mapping['bgColor'] && row[mapping['bgColor']]) {
        qrData.bgColor = row[mapping['bgColor']];
      }
      if (mapping['logo'] && row[mapping['logo']]) {
        qrData.logo = row[mapping['logo']];
      }
      if (mapping['errorCorrection'] && row[mapping['errorCorrection']]) {
        qrData.errorCorrection = row[mapping['errorCorrection']];
      }
      if (mapping['size'] && row[mapping['size']]) {
        qrData.size = parseInt(row[mapping['size']], 10);
      }

      return qrData;
    });
}
