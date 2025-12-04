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
  title: "QR Studio - Professional QR Code Generator & Scanner",
  description: "Create, scan, and manage QR codes with professional-grade tools. Generate custom QR codes with logos, track scans, and collaborate with your team.",
  keywords: ["QR code generator", "QR code scanner", "custom QR codes", "QR analytics", "bulk QR generation"],
  authors: [{ name: "QR Studio Team" }],
  openGraph: {
    title: "QR Studio - Professional QR Code Generator & Scanner",
    description: "Create, scan, and manage QR codes with professional-grade tools",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Studio",
    description: "Professional QR Code Generator & Scanner",
  },
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
