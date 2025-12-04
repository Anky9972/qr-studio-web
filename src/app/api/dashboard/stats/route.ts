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

    // Get current month start date
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Fetch stats in parallel
    const [
      totalQRCodes,
      qrCodesThisMonth,
      totalScans,
      scansThisMonth,
      dynamicQRCodes,
      activeCampaigns,
    ] = await Promise.all([
      prisma.qRCode.count({
        where: { userId },
      }),
      prisma.qRCode.count({
        where: {
          userId,
          createdAt: {
            gte: monthStart,
          },
        },
      }),
      prisma.scan.count({
        where: {
          qrCode: {
            userId,
          },
        },
      }),
      prisma.scan.count({
        where: {
          qrCode: {
            userId,
          },
          scannedAt: {
            gte: monthStart,
          },
        },
      }),
      prisma.qRCode.count({
        where: {
          userId,
          type: 'dynamic',
        },
      }),
      prisma.campaign.count({
        where: { userId },
      }),
    ])

    return NextResponse.json({
      totalQRCodes,
      totalScans,
      qrCodesThisMonth,
      scansThisMonth,
      dynamicQRCodes,
      activeCampaigns,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
