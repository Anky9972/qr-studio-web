import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    // Get user with last login info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        lastLoginAt: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get stats since last login
    const lastLogin = user.lastLoginAt || user.createdAt
    const now = new Date()

    const [newScans, newQRCodes] = await Promise.all([
      prisma.scan.count({
        where: {
          qrCode: {
            userId,
          },
          scannedAt: {
            gte: lastLogin,
          },
        },
      }),
      prisma.qRCode.count({
        where: {
          userId,
          createdAt: {
            gte: lastLogin,
          },
        },
      }),
    ])

    return NextResponse.json({
      lastLoginAt: user.lastLoginAt,
      newScans,
      newQRCodes,
      daysSinceLastLogin: user.lastLoginAt 
        ? Math.floor((now.getTime() - new Date(user.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0,
    })
  } catch (error) {
    console.error('Login info error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch login info' },
      { status: 500 }
    )
  }
}

// Update last login timestamp
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id

    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update login error:', error)
    return NextResponse.json(
      { error: 'Failed to update login time' },
      { status: 500 }
    )
  }
}
