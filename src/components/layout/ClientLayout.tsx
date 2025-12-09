'use client'

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import CookieConsentBanner from "@/components/CookieConsent";

import { Toaster } from 'sonner';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsentBanner />
          <Toaster position="bottom-right" theme="dark" richColors />
        </div>
      </ThemeProvider>
    </SessionProvider>
  )
}
