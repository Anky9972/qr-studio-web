import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const digitalMenuSchema = z.object({
  slug: z.string().min(3).max(50),
  title: z.string().min(1),
  description: z.string().optional(),
  logo: z.string().optional(),
  coverImage: z.string().optional(),
  type: z.enum(['menu', 'gallery', 'portfolio']),
  categories: z.any(), // JSON field
  theme: z.object({
    primaryColor: z.string(),
    backgroundColor: z.string(),
    fontFamily: z.string(),
  }).optional(),
  settings: z.object({
    currency: z.string(),
    showPrices: z.boolean(),
    showImages: z.boolean(),
  }).optional(),
  published: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = digitalMenuSchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.digitalMenu.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already taken' },
        { status: 400 }
      );
    }

    const digitalMenu = await prisma.digitalMenu.create({
      data: {
        userId: (session.user as any).id,
        ...validatedData,
      },
    });

    return NextResponse.json(digitalMenu, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating digital menu:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const menus = await prisma.digitalMenu.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error fetching digital menus:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
