'use client'

import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import CookieConsentBanner from "@/components/CookieConsent";
import { Toaster } from 'sonner';
import { useEffect } from 'react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force dark mode permanently
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsentBanner />
        <Toaster position="bottom-right" theme="dark" richColors />
      </div>
    </SessionProvider>
  )
}
