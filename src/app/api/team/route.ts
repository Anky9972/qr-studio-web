import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/team - Get team members
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Get user's team
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        teamMembers: {
          include: {
            team: {
              include: {
                members: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user?.teamMembers || user.teamMembers.length === 0) {
      return NextResponse.json({ members: [] });
    }

    const team = user.teamMembers[0].team;
    const members = team.members.map((member: any) => ({
      id: member.id,
      name: member.user.name || member.user.email,
      email: member.user.email,
      role: member.role,
      avatar: member.user.image,
      joinedAt: member.createdAt.toISOString(),
      lastActive: member.updatedAt.toISOString(),
      status: 'active',
    }));

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Get team members error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
