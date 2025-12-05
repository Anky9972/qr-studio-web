import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const linkInBioUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  profileImage: z.string().optional(),
  links: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    icon: z.string().optional(),
    visible: z.boolean(),
  })).optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  theme: z.object({
    backgroundColor: z.string(),
    buttonColor: z.string(),
    buttonTextColor: z.string(),
    fontFamily: z.string(),
  }).optional(),
  published: z.boolean().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const linkInBio = await prisma.linkInBio.findFirst({
      where: {
        id,
        userId: (session.user as any).id,
      },
    });

    if (!linkInBio) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(linkInBio);
  } catch (error) {
    console.error('Error fetching Link in Bio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = linkInBioUpdateSchema.parse(body);

    const linkInBio = await prisma.linkInBio.updateMany({
      where: {
        id,
        userId: (session.user as any).id,
      },
      data: validatedData,
    });

    if (linkInBio.count === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = await prisma.linkInBio.findUnique({
      where: { id },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error updating Link in Bio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deleted = await prisma.linkInBio.deleteMany({
      where: {
        id,
        userId: (session.user as any).id,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Link in Bio:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
