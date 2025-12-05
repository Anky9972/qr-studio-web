import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const leadGateSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  fields: z.any(), // JSON field
  redirectUrl: z.string().url(),
  submitText: z.string().default('Submit'),
  theme: z.object({
    primaryColor: z.string(),
    backgroundColor: z.string(),
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
        userId: (session.user as any).id,
        ...validatedData,
      },
    });

    return NextResponse.json(leadGate, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating lead gate:', error);
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
