import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createId } from '@paralleldrive/cuid2';

const vCardPlusSchema = z.object({
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().url('Website must be a valid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  profilePhoto: z.string().optional(),
  coverPhoto: z.string().optional(),
  bio: z.string().optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  customFields: z.array(z.object({
    id: z.string(),
    label: z.string(),
    value: z.string(),
  })).optional(),
  theme: z.object({
    backgroundColor: z.string(),
    primaryColor: z.string(),
    textColor: z.string(),
    backgroundType: z.enum(['solid', 'gradient', 'image', 'pattern']).optional(),
    backgroundGradient: z.string().optional(),
    backgroundImage: z.string().optional(),
    buttonStyle: z.enum(['rounded', 'pill', 'square', 'soft']).optional(),
    cardStyle: z.enum(['glass', 'solid', 'outline', 'none']).optional(),
    fontFamily: z.string(),
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
        id: createId(),
        userId: (session.user as any).id,
        ...validatedData,
      },
    });

    return NextResponse.json(vCardPlus, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      const fieldName = firstError.path.join('.');
      return NextResponse.json(
        { 
          error: firstError.message || 'Validation failed',
          field: fieldName,
          details: error.issues 
        },
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

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await req.json();

    // Verify ownership
    const existing = await prisma.vCardPlus.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (existing.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const validatedData = vCardPlusSchema.parse(body);

    const updated = await prisma.vCardPlus.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      const fieldName = firstError.path.join('.');
      return NextResponse.json(
        { 
          error: firstError.message || 'Validation failed',
          field: fieldName,
          details: error.issues 
        },
        { status: 400 }
      );
    }
    console.error('[vCard-Plus PATCH] Error updating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Verify ownership before deleting
    const vCard = await prisma.vCardPlus.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!vCard) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (vCard.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.vCardPlus.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vCard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
