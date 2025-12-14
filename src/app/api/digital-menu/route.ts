import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createId } from '@paralleldrive/cuid2';

const digitalMenuSchema = z.object({
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  logo: z.string().url('Logo must be a valid URL').optional().or(z.literal('')),
  coverImage: z.string().url('Cover image must be a valid URL').optional().or(z.literal('')),
  type: z.enum(['menu', 'gallery', 'portfolio'], { message: 'Type must be menu, gallery, or portfolio' }),
  categories: z.any(), // JSON field
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
        id: createId(),
        userId: (session.user as any).id,
        ...validatedData,
      },
    });

    return NextResponse.json(digitalMenu, { status: 201 });
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
    console.error('Error creating Digital Menu:', error);
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
    const existing = await prisma.digitalMenu.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (existing.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const validatedData = digitalMenuSchema.parse(body);

    const updated = await prisma.digitalMenu.update({
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
    console.error('[Digital Menu PATCH] Error updating:', error);
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
    const digitalMenu = await prisma.digitalMenu.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!digitalMenu) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (digitalMenu.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.digitalMenu.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Digital Menu:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
