import { Metadata } from 'next'
import HomePageClient from './page.client'
import { ClientLayout } from '@/components/layout/ClientLayout'

export const metadata: Metadata = {
  title: "Free QR Code Generator & Scanner - Create Custom QR Codes Online",
  description: "Create professional QR codes in seconds. Free QR code generator with logo embedding, custom colors, analytics tracking, and bulk generation. Perfect for business, marketing, and personal use.",
  keywords: [
    "free qr code generator",
    "create qr code online",
    "qr code maker free",
    "custom qr code",
    "qr code with logo free",
    "dynamic qr code generator",
    "bulk qr code generator",
    "qr code analytics",
    "business qr code",
    "marketing qr code"
  ],
  openGraph: {
    title: "Free QR Code Generator - Create Custom QR Codes in Seconds",
    description: "Professional QR code generator with custom designs, logo embedding, and analytics. Create unlimited QR codes for free.",
    type: "website",
    images: [
      {
        url: "/images/og-home.png",
        width: 1200,
        height: 630,
        alt: "QR Studio - Free QR Code Generator",
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
}

export default function HomePage() {
  return (
    <ClientLayout>
      <HomePageClient />
    </ClientLayout>
  )
}
