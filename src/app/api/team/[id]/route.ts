import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// PATCH /api/team/[id] - Update team member role
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = await params;
    const { role } = await request.json();

    // Validate role
    if (!['ADMIN', 'EDITOR', 'VIEWER'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if user is admin
    const userMembership = await prisma.teamMember.findFirst({
      where: {
        userId,
        role: 'ADMIN',
      },
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: 'Only admins can change roles' },
        { status: 403 }
      );
    }

    // Update member role
    await prisma.teamMember.update({
      where: { id },
      data: { role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update team member error:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE /api/team/[id] - Remove team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { id } = await params;

    // Check if user is admin
    const userMembership = await prisma.teamMember.findFirst({
      where: {
        userId,
        role: 'ADMIN',
      },
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: 'Only admins can remove members' },
        { status: 403 }
      );
    }

    // Don't allow removing the last admin
    const member = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            members: {
              where: { role: 'ADMIN' },
            },
          },
        },
      },
    });

    if (member?.role === 'ADMIN' && member.team.members.length === 1) {
      return NextResponse.json(
        { error: 'Cannot remove the last admin' },
        { status: 400 }
      );
    }

    // Remove member
    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove team member error:', error);
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
}
