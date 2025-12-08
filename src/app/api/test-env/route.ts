import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    checks: {
      DATABASE_URL: !!process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing',
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '❌ Missing',
    },
    databaseUrlFormat: process.env.DATABASE_URL ? {
      hasSSL: process.env.DATABASE_URL.includes('sslmode=require') ? '✅' : '⚠️ Missing sslmode=require',
      protocol: process.env.DATABASE_URL.split('://')[0],
      length: process.env.DATABASE_URL.length
    } : null,
    timestamp: new Date().toISOString()
  })
}
