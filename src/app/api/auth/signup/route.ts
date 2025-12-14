import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        plan: 'free',
        role: 'user',
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)

    // Log specific error details for debugging
    if (error.code) {
      console.error('Error code:', error.code)
    }
    if (error.meta) {
      console.error('Error meta:', error.meta)
    }

    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    if (error.code === 'P2021') {
      return NextResponse.json(
        { error: 'Database table does not exist. Please run migrations.' },
        { status: 503 }
      )
    }

    // Database connection errors
    if (error.message?.includes('Can\'t reach database') ||
      error.message?.includes('Connection') ||
      error.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection failed. Please check DATABASE_URL configuration.' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    )
  }
}
