import { Metadata } from 'next';
import { StructuredData, createBreadcrumbs } from '@/components/StructuredData';
import TemplatesClient from './TemplatesClient';

export const metadata: Metadata = {
  title: 'Free QR Code Templates - Business Cards, Menus & More | QR Studio',
  description: 'Browse 50+ free QR code templates for business cards, restaurant menus, WiFi access, events, social media and more. Start creating in seconds.',
  keywords: [
    'qr code templates',
    'free qr code templates',
    'qr code business card template',
    'restaurant menu qr code',
    'wifi qr code template',
    'event ticket qr code',
    'vcard qr code template',
  ],
  openGraph: {
    title: 'Free QR Code Templates | QR Studio',
    description: 'Start from a professional template. Business cards, menus, WiFi, events and more — all free.',
    images: [{ url: '/templates/opengraph-image', width: 1200, height: 630, alt: 'QR Code Templates Gallery' }],
  },
  alternates: {
    canonical: '/templates',
  },
};

export default function TemplatesPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Templates', url: '/templates' },
  ];

  return (
    <>
      <StructuredData type="BreadcrumbList" data={{ items: createBreadcrumbs(breadcrumbs) }} />
      <TemplatesClient />
    </>
  );
}

