import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/qr-codes/[id] - Get single QR code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { id } = await params
    const qrCode = await prisma.qRCode.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        Campaign: true,
        _count: {
          select: { Scan: true },
        },
      },
    })

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    return NextResponse.json(qrCode)
  } catch (error) {
    console.error('Get QR code error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch QR code' },
      { status: 500 }
    )
  }
}

// PATCH /api/qr-codes/[id] - Update QR code
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const { id } = await params

    // Verify ownership
    const existing = await prisma.qRCode.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    const qrCode = await prisma.qRCode.update({
      where: { id },
      data: {
        ...body,
        ...(body.expiresAt && { expiresAt: new Date(body.expiresAt) }),
      },
      include: {
        Campaign: true,
      },
    })

    return NextResponse.json(qrCode)
  } catch (error) {
    console.error('Update QR code error:', error)
    return NextResponse.json(
      { error: 'Failed to update QR code' },
      { status: 500 }
    )
  }
}

// DELETE /api/qr-codes/[id] - Delete QR code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { id } = await params

    // Verify ownership
    const existing = await prisma.qRCode.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existing) {
      return NextResponse.json({ error: 'QR code not found' }, { status: 404 })
    }

    await prisma.qRCode.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete QR code error:', error)
    return NextResponse.json(
      { error: 'Failed to delete QR code' },
      { status: 500 }
    )
  }
}
