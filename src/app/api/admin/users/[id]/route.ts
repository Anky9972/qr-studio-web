import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

async function checkAdmin(session: any) {
  if (!session?.user) {
    return { error: 'Unauthorized', status: 401 };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    return { error: 'Forbidden', status: 403 };
  }

  return null;
}

// GET single user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const adminCheck = await checkAdmin(session);
    if (adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            QRCode: true,
            TeamMember: true,
          },
        },
        QRCode: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
            _count: {
              select: { Scan: true },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const adminCheck = await checkAdmin(session);
    if (adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;
    const body = await request.json();
    const { subscription, isBanned, isAdmin, emailVerified } = body;

    const updateData: any = {};
    if (subscription !== undefined) updateData.subscription = subscription;
    // Note: isBanned field needs to be added to schema if ban functionality is required
    if (isAdmin !== undefined) updateData.isAdmin = isAdmin;
    if (emailVerified !== undefined) updateData.emailVerified = emailVerified ? new Date() : null;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        subscription: true,
        isAdmin: true,
        emailVerified: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE user account
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const adminCheck = await checkAdmin(session);
    if (adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;

    // Prevent admin from deleting themselves
    const currentUser = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? '' },
      select: { id: true },
    });

    if (currentUser?.id === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user and all related data (cascade delete should handle this)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
