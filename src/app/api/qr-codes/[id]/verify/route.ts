import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST /api/qr-codes/:id/verify - Verify password for protected QR code
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { password } = await req.json()
    const { id } = await params

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Find the QR code
    const qrCode = await prisma.qRCode.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        password: true,
        expiresAt: true,
        scanCount: true,
      },
    })

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      )
    }

    // Check if QR code is expired
    if (qrCode.expiresAt && new Date(qrCode.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This QR code has expired' },
        { status: 403 }
      )
    }

    // Check if password protection is enabled
    if (!qrCode.password) {
      return NextResponse.json(
        { error: 'This QR code is not password protected' },
        { status: 400 }
      )
    }

    // Verify password
    const isValid = await bcrypt.compare(password, qrCode.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Password is correct - increment scan count and return destination
    await prisma.qRCode.update({
      where: { id },
      data: {
        scanCount: {
          increment: 1,
        },
        lastScanned: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      destination: qrCode.content,
    })
  } catch (error) {
    console.error('Password verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
