import { Metadata } from 'next';
import { StructuredData, createBreadcrumbs } from '@/components/StructuredData';
import UseCasesClient from './UseCasesClient';

export const metadata: Metadata = {
  title: 'QR Code Use Cases by Industry | QR Studio',
  description: 'Discover how restaurants, retailers, healthcare, events, education, and more use QR codes to drive results. Real case studies and industry solutions.',
  keywords: [
    'qr code for restaurant',
    'qr code for retail',
    'qr code for events',
    'qr code for healthcare',
    'qr code for education',
    'qr code use cases',
    'qr code marketing',
    'dynamic qr code business',
  ],
  openGraph: {
    title: 'QR Code Use Cases by Industry | QR Studio',
    description: 'See how 10,000+ businesses across 8 industries use QR codes to enhance customer experiences and drive measurable results.',
    images: [{ url: '/use-cases/opengraph-image', width: 1200, height: 630, alt: 'QR Code Use Cases by Industry' }],
  },
  alternates: {
    canonical: '/use-cases',
  },
};

export default function UseCasesPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Use Cases', url: '/use-cases' },
  ];

  return (
    <>
      <StructuredData type="BreadcrumbList" data={{ items: createBreadcrumbs(breadcrumbs) }} />
      <UseCasesClient />
    </>
  );
}

