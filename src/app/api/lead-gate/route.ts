import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createId } from '@paralleldrive/cuid2';

const leadGateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  fields: z.any(), // JSON field
  redirectUrl: z.string().url('Redirect URL must be a valid URL'),
  submitText: z.string().min(1, 'Submit text is required').default('Submit'),
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
    const validatedData = leadGateSchema.parse(body);

    const leadGate = await prisma.leadGate.create({
      data: {
        id: createId(),
        userId: (session.user as any).id,
        ...validatedData,
      },
    });

    return NextResponse.json(leadGate, { status: 201 });
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
    console.error('Error creating Lead Gate:', error);
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

    const leadGates = await prisma.leadGate.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(leadGates);
  } catch (error) {
    console.error('Error fetching lead gates:', error);
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
    const existing = await prisma.leadGate.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (existing.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const validatedData = leadGateSchema.parse(body);

    const updated = await prisma.leadGate.update({
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
    console.error('[Lead Gate PATCH] Error updating:', error);
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
    const leadGate = await prisma.leadGate.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!leadGate) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (leadGate.userId !== (session.user as any).id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.leadGate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Lead Gate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
