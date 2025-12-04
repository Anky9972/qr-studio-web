import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code Use Cases | Industry Solutions & Examples | QR Studio',
  description: 'Discover how businesses across 8+ industries use QR codes for restaurants, retail, real estate, events, education, healthcare, manufacturing, and marketing campaigns. Real case studies and success stories.',
  keywords: [
    'QR code use cases',
    'QR code examples',
    'QR code applications',
    'industry QR codes',
    'restaurant QR codes',
    'retail QR codes',
    'real estate QR codes',
    'event QR codes',
    'QR code success stories',
    'business QR codes'
  ],
  openGraph: {
    title: 'QR Code Use Cases | Industry Solutions | QR Studio',
    description: 'Real-world QR code examples across 8+ industries with proven results.',
    type: 'website',
    images: [
      {
        url: '/images/og-use-cases.jpg',
        width: 1200,
        height: 630,
        alt: 'QR Studio Use Cases'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Use Cases | QR Studio',
    description: 'See how businesses use QR codes across industries',
    images: ['/images/og-use-cases.jpg']
  }
};

export default function UseCasesLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
