import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

function generateCouponCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ offers });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      discountPercent,
      couponCode,
      validFrom,
      validUntil,
      targetPlan,
      active,
    } = body;

    if (!title || !validUntil || discountPercent === undefined) {
      return NextResponse.json(
        { error: 'Title, validUntil, and discountPercent are required' },
        { status: 400 }
      );
    }

    // Generate coupon code if not provided
    const finalCouponCode = couponCode || generateCouponCode();

    const offer = await prisma.offer.create({
      data: {
        id: `offer_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        title,
        description: description || '',
        discountPercent,
        couponCode: finalCouponCode,
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validUntil: new Date(validUntil),
        targetPlan: targetPlan || 'all',
        active: active !== undefined ? active : true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    console.error('Error creating offer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
