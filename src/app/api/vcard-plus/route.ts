import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const vCardPlusSchema = z.object({
  slug: z.string().min(3).max(50),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  profilePhoto: z.string().optional(),
  coverPhoto: z.string().optional(),
  bio: z.string().optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  customFields: z.record(z.string(), z.string()).optional(),
  theme: z.object({
    primaryColor: z.string(),
    backgroundColor: z.string(),
  }).optional(),
  downloadEnabled: z.boolean().default(true),
  published: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = vCardPlusSchema.parse(body);

    // Check if slug already exists
    const existing = await prisma.vCardPlus.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already taken' },
        { status: 400 }
      );
    }

    const vCardPlus = await prisma.vCardPlus.create({
      data: {
        userId: (session.user as any).id,
        ...validatedData,
      },
    });

    return NextResponse.json(vCardPlus, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating vCard Plus:', error);
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

    const vCards = await prisma.vCardPlus.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(vCards);
  } catch (error) {
    console.error('Error fetching vCards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
