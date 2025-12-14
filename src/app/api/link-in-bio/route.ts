import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createId } from '@paralleldrive/cuid2';

const linkInBioSchema = z.object({
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  profileImage: z.string().url('Profile image must be a valid URL').optional().or(z.literal('')),
  links: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Link title is required'),
    url: z.string().url('Link must be a valid URL'),
    icon: z.string().optional(),
    visible: z.boolean(),
  })),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url('Social link must be a valid URL'),
    visible: z.boolean(),
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
  published: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('[Link-in-Bio POST] Received data:', JSON.stringify(body, null, 2));
    const validatedData = linkInBioSchema.parse(body);
    console.log('[Link-in-Bio POST] Validation passed');

    // Check if slug already exists
    const existing = await prisma.linkInBio.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already taken' },
        { status: 400 }
      );
    }

    const linkInBio = await prisma.linkInBio.create({
      data: {
        id: createId(),
        userId: (session.user as any).id,
        ...validatedData,
      },
    });

    return NextResponse.json(linkInBio, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Link-in-Bio POST] Validation error:', JSON.stringify(error.issues, null, 2));
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
    console.error('[Link-in-Bio POST] Error creating Link in Bio:', error);
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

    const linkInBios = await prisma.linkInBio.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(linkInBios);
  } catch (error) {
    console.error('Error fetching Link in Bios:', error);
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
    const existing = await prisma.linkInBio.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (existing.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const validatedData = linkInBioSchema.parse(body);

    const updated = await prisma.linkInBio.update({
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
    console.error('[Link-in-Bio PATCH] Error updating:', error);
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
    const linkInBio = await prisma.linkInBio.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!linkInBio) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (linkInBio.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.linkInBio.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Link in Bio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
