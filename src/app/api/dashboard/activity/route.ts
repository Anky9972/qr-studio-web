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

    // Fetch recent scans with QR code details
    const recentScans = await prisma.scan.findMany({
      where: {
        QRCode: {
          userId,
        },
      },
      include: {
        QRCode: {
          select: {
            name: true,
            qrType: true,
          },
        },
      },
      orderBy: {
        scannedAt: 'desc',
      },
      take: 5,
    })

    return NextResponse.json({
      activity: recentScans.map((scan) => ({
        id: scan.id,
        type: 'scan',
        qrCodeName: scan.QRCode.name,
        qrType: scan.QRCode.qrType,
        scannedAt: scan.scannedAt,
        location: scan.city && scan.country ? `${scan.city}, ${scan.country}` : 'Unknown',
        device: scan.device || 'Unknown',
      })),
    })
  } catch (error) {
    console.error('Dashboard activity error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard activity' },
      { status: 500 }
    )
  }
}
