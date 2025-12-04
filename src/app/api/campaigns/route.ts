import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const campaignSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
});

// GET /api/campaigns - List user's campaigns
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          _count: {
            select: { qrCodes: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.campaign.count({ where }),
    ]);

    // Get total scans for each campaign
    const campaignsWithScans = await Promise.all(
      campaigns.map(async (campaign: any) => {
        const totalScans = await prisma.scan.count({
          where: {
            qrCode: {
              campaignId: campaign.id,
            },
          },
        });

        return {
          ...campaign,
          totalScans,
        };
      })
    );

    return NextResponse.json({
      campaigns: campaignsWithScans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/campaigns - Create new campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();
    const { startDate, endDate, ...data } = campaignSchema.parse(body);

    const campaign = await prisma.campaign.create({
      data: {
        ...data,
        userId,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
      include: {
        _count: {
          select: { qrCodes: true },
        },
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error('Create campaign error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}
