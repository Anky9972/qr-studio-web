import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code Templates | Pre-Designed Templates | QR Studio',
  description: 'Browse our collection of professional QR code templates. Ready-to-use designs for business cards, WiFi, restaurants, events, and more. Start creating in seconds.',
  keywords: [
    'QR code templates',
    'QR code designs',
    'pre-made QR codes',
    'QR code examples',
    'business card QR code',
    'WiFi QR code',
    'restaurant menu QR code',
    'event QR code template',
    'free QR templates'
  ],
  openGraph: {
    title: 'QR Code Templates | QR Studio',
    description: 'Professional QR code templates ready to use',
    type: 'website',
    images: [
      {
        url: '/images/og-templates.jpg',
        width: 1200,
        height: 630,
        alt: 'QR Studio Templates'
      }
    ]
  }
};

export default function TemplatesLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
