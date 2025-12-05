import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QR Studio - Professional QR Code Generator',
    short_name: 'QR Studio',
    description: 'Create stunning QR codes in seconds with professional features',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6366f1',
    orientation: 'portrait-primary',
    scope: '/',
    categories: ['business', 'productivity', 'utilities'],
    lang: 'en-US',
    dir: 'ltr',
    icons: [
      {
        src: '/images/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/images/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/images/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
      },
      {
        src: '/images/screenshot-narrow.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],
    shortcuts: [
      {
        name: 'Create QR Code',
        short_name: 'Create',
        description: 'Create a new QR code',
        url: '/dashboard/qr-codes?action=create',
        icons: [{ src: '/images/icon-create.png', sizes: '96x96' }],
      },
      {
        name: 'Scan QR Code',
        short_name: 'Scan',
        description: 'Scan a QR code',
        url: '/dashboard?action=scan',
        icons: [{ src: '/images/icon-scan.png', sizes: '96x96' }],
      },
      {
        name: 'Analytics',
        short_name: 'Analytics',
        description: 'View QR code analytics',
        url: '/dashboard/analytics',
        icons: [{ src: '/images/icon-analytics.png', sizes: '96x96' }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  }
}
