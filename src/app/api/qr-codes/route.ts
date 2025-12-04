import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { canCreateQRCode, getPlanLimits } from '@/lib/plan-limits'
import { checkQRCodeLimit, checkDynamicQRCodeLimit } from '@/middleware/planLimits'
import { triggerWebhooks, WEBHOOK_EVENTS } from '@/lib/webhooks'
import bcrypt from 'bcryptjs'

const qrCodeSchema = z.object({
  name: z.string().optional(),
  type: z.enum(['static', 'dynamic']),
  content: z.string(),
  qrType: z.string(),
  size: z.number().default(512),
  foreground: z.string().default('#000000'),
  background: z.string().default('#FFFFFF'),
  logo: z.string().optional().nullable(),
  errorLevel: z.enum(['L', 'M', 'Q', 'H']).default('M'),
  pattern: z.string().default('square'),
  design: z.any().optional().nullable(),
  destination: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  campaignId: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
})

// GET /api/qr-codes - List user's QR codes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type')
    const campaignId = searchParams.get('campaignId')
    const favorite = searchParams.get('favorite') === 'true'

    const skip = (page - 1) * limit

    const where: any = { userId }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (type) {
      where.type = type
    }

    if (campaignId) {
      where.campaignId = campaignId
    }

    if (favorite) {
      where.favorite = true
    }

    const [qrCodes, total] = await Promise.all([
      prisma.qRCode.findMany({
        where,
        include: {
          campaign: true,
          _count: {
            select: { scans: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.qRCode.count({ where }),
    ])

    return NextResponse.json({
      qrCodes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get QR codes error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch QR codes' },
      { status: 500 }
    )
  }
}

// POST /api/qr-codes - Create new QR code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const data = qrCodeSchema.parse(body)

    // Check QR code limit
    const qrCodeCheck = await checkQRCodeLimit(userId)
    if (!qrCodeCheck.allowed) {
      console.log('QR code limit exceeded:', qrCodeCheck)
      return NextResponse.json(
        {
          error: 'LIMIT_EXCEEDED',
          message: qrCodeCheck.message,
          current: qrCodeCheck.current,
          limit: qrCodeCheck.limit,
          percentage: qrCodeCheck.percentage,
        },
        { status: 403 }
      )
    }

    // Check dynamic QR code limit if creating dynamic
    if (data.type === 'dynamic') {
      const dynamicCheck = await checkDynamicQRCodeLimit(userId)
      if (!dynamicCheck.allowed) {
        console.log('Dynamic QR code limit exceeded:', dynamicCheck)
        return NextResponse.json(
          {
            error: 'DYNAMIC_LIMIT_EXCEEDED',
            message: dynamicCheck.message,
            current: dynamicCheck.current,
            limit: dynamicCheck.limit,
            percentage: dynamicCheck.percentage,
          },
          { status: 403 }
        )
      }
    }

    // Get user for additional info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate short URL for dynamic QR codes
    let shortUrl
    if (data.type === 'dynamic') {
      shortUrl = generateShortCode()
      while (await prisma.qRCode.findUnique({ where: { shortUrl } })) {
        shortUrl = generateShortCode()
      }
    }

    // Hash password if provided
    let hashedPassword = null
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10)
    }

    const qrCode = await prisma.qRCode.create({
      data: {
        ...data,
        userId,
        shortUrl,
        password: hashedPassword,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
      include: {
        campaign: true,
      },
    })

    // Trigger webhooks asynchronously
    triggerWebhooks(userId, WEBHOOK_EVENTS.QR_CREATED, {
      id: qrCode.id,
      name: qrCode.name,
      type: qrCode.type,
      qrType: qrCode.qrType,
      shortUrl: qrCode.shortUrl,
      createdAt: qrCode.createdAt,
    }).catch((err) => console.error('Webhook trigger error:', err));

    return NextResponse.json(qrCode, { status: 201 })
  } catch (error) {
    console.error('Create QR code error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create QR code' },
      { status: 500 }
    )
  }
}

function generateShortCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
