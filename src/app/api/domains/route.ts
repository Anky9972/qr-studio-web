import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import {
  createCustomDomain,
  getUserDomains,
  deleteCustomDomain,
  verifyCustomDomain,
  canAddDomain,
  getDomainSetupInstructions,
} from '@/lib/domainManager';

// GET /api/domains - Get user's custom domains
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const domains = await getUserDomains(user.id);
    return NextResponse.json({ domains });
  } catch (error: any) {
    console.error('Error fetching domains:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/domains - Add a new custom domain
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user can add more domains
    const canAdd = await canAddDomain(user.id);
    if (!canAdd.allowed) {
      return NextResponse.json(
        { error: canAdd.reason, current: canAdd.current, limit: canAdd.limit },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { domain } = body;

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const result = await createCustomDomain(user.id, domain);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Get setup instructions
    const instructions = getDomainSetupInstructions(
      result.domain.domain,
      result.domain.cnameTarget,
      result.domain.verificationToken
    );

    return NextResponse.json(
      {
        domain: result.domain,
        instructions,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating domain:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/domains/[id] - Delete a custom domain
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteCustomDomain(id);

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete domain' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting domain:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
