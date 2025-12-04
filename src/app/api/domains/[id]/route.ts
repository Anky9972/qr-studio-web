import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { deleteCustomDomain } from '@/lib/domainManager';

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
