import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { title, message, type, active, targetAudience } = body;

    const announcement = await prisma.announcement.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(message !== undefined && { message }),
        ...(type !== undefined && { type }),
        ...(active !== undefined && { active }),
        ...(targetAudience !== undefined && { targetAudience }),
      },
    });

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    await prisma.announcement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
