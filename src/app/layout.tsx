import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "QR Studio - Professional QR Code Generator & Manager | Free QR Scanner",
    template: "%s | QR Studio"
  },
  description: "Create stunning QR codes in seconds with QR Studio. Professional QR code generator with custom designs, logo embedding, analytics tracking, bulk creation, and team collaboration. Free QR scanner with advanced features.",
  keywords: [
    "QR code generator", 
    "QR code creator", 
    "QR code maker", 
    "free QR code", 
    "custom QR code",
    "QR code with logo", 
    "QR code scanner", 
    "QR analytics", 
    "bulk QR generation",
    "dynamic QR code",
    "QR code tracking",
    "QR code management",
    "vCard QR code",
    "WiFi QR code",
    "URL QR code",
    "QR code API",
    "business QR code",
    "marketing QR code",
    "campaign QR code",
    "QR code design"
  ],
  authors: [{ name: "QR Studio Team" }],
  creator: "QR Studio",
  publisher: "QR Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "QR Studio - Professional QR Code Generator & Manager",
    description: "Create stunning QR codes in seconds. Professional QR code generator with custom designs, logo embedding, analytics tracking, and team collaboration.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "QR Studio",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "QR Studio - Professional QR Code Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Studio - Professional QR Code Generator",
    description: "Create stunning QR codes in seconds. Professional QR code generator with custom designs and analytics.",
    images: ["/images/og-image.png"],
    creator: "@qrstudio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en',
      'es-ES': '/es',
      'fr-FR': '/fr',
      'de-DE': '/de',
      'pt-PT': '/pt',
    },
  },
  category: 'technology',
  classification: 'Business Software',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
