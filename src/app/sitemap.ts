import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/api-docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  try {
    // Get all public QR codes (if you want to expose them)
    const qrCodes = await prisma.qRCode.findMany({
      where: {
        type: 'DYNAMIC', // Only include dynamic QR codes in sitemap
      },
      select: {
        id: true,
        updatedAt: true,
      },
      take: 5000, // Limit to prevent huge sitemaps
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const qrCodePages: MetadataRoute.Sitemap = qrCodes.map((qr) => ({
      url: `${baseUrl}/qr/${qr.id}`,
      lastModified: qr.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    return [...staticPages, ...qrCodePages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages if database query fails
    return staticPages
  }
}
