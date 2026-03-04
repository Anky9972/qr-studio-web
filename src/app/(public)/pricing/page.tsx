import { Metadata } from 'next';
import { StructuredData, createBreadcrumbs } from '@/components/StructuredData';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: 'Pricing - QR Studio | Free, Pro & Business Plans',
  description: 'Start free, upgrade when you need more. QR Studio plans from $0 to enterprise. Compare features, limits, and pricing for QR code creation and analytics.',
  openGraph: {
    title: 'Pricing - QR Studio | Free, Pro & Business Plans',
    description: 'Simple, transparent QR Studio pricing. Free plan available. Pro from $19/mo. No hidden fees.',
    images: [{ url: '/pricing/opengraph-image', width: 1200, height: 630, alt: 'QR Studio Pricing Plans' }],
  },
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Pricing', url: '/pricing' },
  ];

  return (
    <>
      <StructuredData type="BreadcrumbList" data={{ items: createBreadcrumbs(breadcrumbs) }} />
      <StructuredData type="Product" />
      <PricingClient />
    </>
  );
}
