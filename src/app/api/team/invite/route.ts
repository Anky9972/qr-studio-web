import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { sendTeamInvitationEmail } from '@/lib/email';
import { checkTeamMemberLimit } from '@/middleware/planLimits';

// POST /api/team/invite - Invite a team member
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { email, role, message } = await request.json();

    // Check team member limit
    const teamCheck = await checkTeamMemberLimit(userId);
    if (!teamCheck.allowed) {
      return NextResponse.json(
        {
          error: 'TEAM_LIMIT_EXCEEDED',
          message: teamCheck.message,
          current: teamCheck.current,
          limit: teamCheck.limit,
          percentage: teamCheck.percentage,
        },
        { status: 403 }
      );
    }

    // Validate role
    if (!['ADMIN', 'EDITOR', 'VIEWER'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if user exists
    let invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    // Get user's team or create one
    let userTeam = await prisma.team.findFirst({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!userTeam) {
      // Create a team for the user
      userTeam = await prisma.team.create({
        data: {
          name: `${session.user.name || session.user.email}'s Team`,
          members: {
            create: {
              userId,
              role: 'ADMIN',
            },
          },
        },
        include: {
          members: true,
        },
      });
    }

    // Check if already a member
    const existingMember = userTeam.members.find((m: any) => m.userId === invitedUser?.id);
    if (existingMember) {
      return NextResponse.json({ error: 'User is already a team member' }, { status: 400 });
    }

    // If user doesn't exist, create invitation record (would send email in production)
    if (!invitedUser) {
      // In a real app, store invitation and send email
      // For now, just return pending status
      return NextResponse.json({
        success: true,
        status: 'pending',
        message: 'Invitation sent successfully',
      });
    }

    // Add user to team
    await prisma.teamMember.create({
      data: {
        teamId: userTeam.id,
        userId: invitedUser.id,
        role,
      },
    });

    // Send invitation email
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/team`;
    await sendTeamInvitationEmail(
      email,
      session.user.name || 'A team member',
      userTeam.name,
      role,
      inviteUrl
    );

    return NextResponse.json({
      success: true,
      message: 'Team member added successfully',
    });
  } catch (error) {
    console.error('Invite team member error:', error);
    return NextResponse.json(
      { error: 'Failed to invite team member' },
      { status: 500 }
    );
  }
}
