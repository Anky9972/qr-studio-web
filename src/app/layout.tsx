import type { Metadata } from "next";
import { getLocale } from 'next-intl/server';
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "QR Studio - Free QR Code Generator & Scanner",
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
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "QR Studio - Professional QR Code Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Studio - Free QR Code Generator & Scanner",
    description: "Create stunning QR codes in seconds. Professional QR code generator with custom designs and analytics.",
    images: ["/opengraph-image"],
    // creator: "@YOUR_HANDLE", // TODO: add when Twitter/X account is live
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
      'x-default': '/',
      'en': '/',
      'es': '/es',
      'fr': '/fr',
      'de': '/de',
      'pt': '/pt',
    },
  },
  category: 'technology',
  classification: 'Business Software',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/icon.png', type: 'image/png' },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale} suppressHydrationWarning className="dark">
      <body className={`${jakarta.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9730090335646193"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
