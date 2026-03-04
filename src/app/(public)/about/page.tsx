import { Metadata } from 'next';
import { StructuredData, createBreadcrumbs } from '@/components/StructuredData';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About QR Studio - Our Mission, Team & Story',
  description: 'Learn about QR Studio — the team behind the professional QR code generator trusted by 10,000+ businesses. Our mission, values, and story.',
  openGraph: {
    title: 'About QR Studio - Our Mission, Team & Story',
    description: 'Meet the team building the most powerful QR code platform. Learn our story and mission.',
    images: [{ url: '/about/opengraph-image', width: 1200, height: 630, alt: 'About QR Studio' }],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
  ];

  return (
    <>
      <StructuredData type="BreadcrumbList" data={{ items: createBreadcrumbs(breadcrumbs) }} />
      <AboutClient />
    </>
  );
}
