import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { checkQRCodeLimit, checkDynamicQRCodeLimit } from '@/middleware/planLimits';
import bcrypt from 'bcryptjs';

const bulkQRSchema = z.object({
  qrCodes: z.array(
    z.object({
      name: z.string().optional(),
      type: z.enum(['static', 'dynamic']),
      content: z.string(),
      qrType: z.string(),
      size: z.number().default(512),
      foreground: z.string().default('#000000'),
      background: z.string().default('#FFFFFF'),
      logo: z.string().optional().nullable(),
      errorLevel: z.enum(['L', 'M', 'Q', 'H']).default('M'),
      pattern: z.string().default('square'),
      design: z.any().optional().nullable(),
      destination: z.string().optional().nullable(),
      password: z.string().optional().nullable(),
      expiresAt: z.string().optional().nullable(),
      campaignId: z.string().optional().nullable(),
      tags: z.array(z.string()).default([]),
    })
  ),
});

// POST /api/qr-codes/bulk - Create multiple QR codes at once
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { qrCodes } = bulkQRSchema.parse(body);

    if (qrCodes.length === 0) {
      return NextResponse.json(
        { error: 'No QR codes provided' },
        { status: 400 }
      );
    }

    if (qrCodes.length > 1000) {
      return NextResponse.json(
        { error: 'Maximum 1000 QR codes per batch' },
        { status: 400 }
      );
    }

    // Count static and dynamic QR codes
    const staticCount = qrCodes.filter((q) => q.type === 'static').length;
    const dynamicCount = qrCodes.filter((q) => q.type === 'dynamic').length;

    // Check limits
    const qrCodeCheck = await checkQRCodeLimit(userId);
    if (!qrCodeCheck.allowed) {
      return NextResponse.json(
        {
          error: 'LIMIT_EXCEEDED',
          message: qrCodeCheck.message,
          current: qrCodeCheck.current,
          limit: qrCodeCheck.limit,
        },
        { status: 403 }
      );
    }

    // Check if user can create the requested number of QR codes
    const remainingSlots = qrCodeCheck.limit - qrCodeCheck.current;
    if (qrCodes.length > remainingSlots) {
      return NextResponse.json(
        {
          error: 'LIMIT_EXCEEDED',
          message: `Can only create ${remainingSlots} more QR codes. Upgrade your plan for more.`,
          requested: qrCodes.length,
          available: remainingSlots,
        },
        { status: 403 }
      );
    }

    if (dynamicCount > 0) {
      const dynamicCheck = await checkDynamicQRCodeLimit(userId);
      if (!dynamicCheck.allowed) {
        return NextResponse.json(
          {
            error: 'DYNAMIC_LIMIT_EXCEEDED',
            message: dynamicCheck.message,
            current: dynamicCheck.current,
            limit: dynamicCheck.limit,
          },
          { status: 403 }
        );
      }

      const remainingDynamicSlots = dynamicCheck.limit - dynamicCheck.current;
      if (dynamicCount > remainingDynamicSlots) {
        return NextResponse.json(
          {
            error: 'DYNAMIC_LIMIT_EXCEEDED',
            message: `Can only create ${remainingDynamicSlots} more dynamic QR codes. Upgrade your plan for more.`,
            requested: dynamicCount,
            available: remainingDynamicSlots,
          },
          { status: 403 }
        );
      }
    }

    // Generate short codes for dynamic QR codes
    const processedQRCodes = await Promise.all(
      qrCodes.map(async (qr) => {
        let shortUrl;
        if (qr.type === 'dynamic') {
          shortUrl = generateShortCode();
          // Ensure uniqueness
          let exists = await prisma.qRCode.findUnique({
            where: { shortUrl },
          });
          while (exists) {
            shortUrl = generateShortCode();
            exists = await prisma.qRCode.findUnique({
              where: { shortUrl },
            });
          }
        }

        // Hash password if provided
        let hashedPassword = null;
        if (qr.password) {
          hashedPassword = await bcrypt.hash(qr.password, 10);
        }

        return {
          ...qr,
          userId,
          shortUrl,
          password: hashedPassword,
          expiresAt: qr.expiresAt ? new Date(qr.expiresAt) : null,
        };
      })
    );

    // Batch create using createMany
    const result = await prisma.qRCode.createMany({
      data: processedQRCodes,
      skipDuplicates: true,
    });

    // Fetch created QR codes to return with IDs
    const createdQRCodes = await prisma.qRCode.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 10000), // Created in last 10 seconds
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: qrCodes.length,
    });

    return NextResponse.json(
      {
        success: true,
        count: result.count,
        qrCodes: createdQRCodes,
        message: `Successfully created ${result.count} QR codes`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Bulk create QR codes error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create QR codes in bulk' },
      { status: 500 }
    );
  }
}

// PATCH /api/qr-codes/bulk - Update multiple QR codes at once
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { qrCodeIds, updates } = body;

    if (!Array.isArray(qrCodeIds) || qrCodeIds.length === 0) {
      return NextResponse.json(
        { error: 'QR code IDs required' },
        { status: 400 }
      );
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { error: 'Updates object required' },
        { status: 400 }
      );
    }

    // Verify ownership of all QR codes
    const qrCodes = await prisma.qRCode.findMany({
      where: {
        id: { in: qrCodeIds },
        userId,
      },
      select: { id: true },
    });

    if (qrCodes.length !== qrCodeIds.length) {
      return NextResponse.json(
        { error: 'Some QR codes not found or unauthorized' },
        { status: 403 }
      );
    }

    // Prepare update data (only allow certain fields to be bulk updated)
    const allowedUpdates: any = {};
    if (updates.campaignId !== undefined) allowedUpdates.campaignId = updates.campaignId;
    if (updates.tags !== undefined) allowedUpdates.tags = updates.tags;
    if (updates.favorite !== undefined) allowedUpdates.favorite = updates.favorite;
    if (updates.destination !== undefined) allowedUpdates.destination = updates.destination;
    if (updates.expiresAt !== undefined)
      allowedUpdates.expiresAt = updates.expiresAt ? new Date(updates.expiresAt) : null;
    if (updates.maxScans !== undefined) allowedUpdates.maxScans = updates.maxScans;

    // Perform bulk update
    const result = await prisma.qRCode.updateMany({
      where: {
        id: { in: qrCodeIds },
        userId,
      },
      data: {
        ...allowedUpdates,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Successfully updated ${result.count} QR codes`,
    });
  } catch (error) {
    console.error('Bulk update QR codes error:', error);
    return NextResponse.json(
      { error: 'Failed to update QR codes in bulk' },
      { status: 500 }
    );
  }
}

// DELETE /api/qr-codes/bulk - Delete multiple QR codes at once
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json(
        { error: 'QR code IDs required (query param: ids)' },
        { status: 400 }
      );
    }

    const qrCodeIds = idsParam.split(',');

    if (qrCodeIds.length === 0) {
      return NextResponse.json(
        { error: 'No QR code IDs provided' },
        { status: 400 }
      );
    }

    // Verify ownership and delete
    const result = await prisma.qRCode.deleteMany({
      where: {
        id: { in: qrCodeIds },
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Successfully deleted ${result.count} QR codes`,
    });
  } catch (error) {
    console.error('Bulk delete QR codes error:', error);
    return NextResponse.json(
      { error: 'Failed to delete QR codes in bulk' },
      { status: 500 }
    );
  }
}

function generateShortCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
