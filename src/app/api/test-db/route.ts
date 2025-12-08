import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test basic database connection
    await prisma.$queryRaw`SELECT 1 as result`
    
    // Test User table exists
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Database connected ✅',
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Database test failed:', error)
    
    return NextResponse.json({ 
      status: 'error',
      message: 'Database connection failed ❌',
      error: error.message,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
