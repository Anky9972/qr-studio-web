import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const linkInBioSchema = z.object({
  slug: z.string().min(3).max(50),
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  profileImage: z.string().optional(),
  links: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    icon: z.string().optional(),
    visible: z.boolean(),
  })),
  socialLinks: z.record(z.string(), z.string()).optional(),
  theme: z.object({
    backgroundColor: z.string(),
    buttonColor: z.string(),
    buttonTextColor: z.string(),
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
    const validatedData = linkInBioSchema.parse(body);

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
        userId: (session.user as any).id,
        ...validatedData,
      },
    });

    return NextResponse.json(linkInBio, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating Link in Bio:', error);
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
