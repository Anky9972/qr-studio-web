
import { Metadata } from 'next';
import { StructuredData, createFAQItems, createBreadcrumbs } from '@/components/StructuredData';
import { featuresFaqs } from '@/lib/data';
import FeaturesClient from './FeaturesClient';

export const metadata: Metadata = {
  title: "Features - QR Studio | Advanced QR Code Management & Analytics",
  description: "Explore QR Studio features: Dynamic QR codes, advanced analytics, custom designs, bulk generation, team collaboration, and more.",
  openGraph: {
    title: "Features - QR Studio | Advanced QR Code Management",
    description: "Discover the powerful features of QR Studio. From dynamic codes to team collaboration and detailed analytics.",
    images: ["/images/og-features.png"]
  }
};

export default function FeaturesPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Features", url: "/features" }
  ];

  return (
    <>
      <StructuredData type="BreadcrumbList" data={{ items: createBreadcrumbs(breadcrumbs) }} />
      <StructuredData type="FAQPage" data={{ questions: createFAQItems(featuresFaqs) }} />
      <FeaturesClient />
    </>
  );
}
