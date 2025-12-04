import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  return NextResponse.json({
    expired: true,
    message: 'This QR code has expired and is no longer available.',
  }, { status: 410 });
}
