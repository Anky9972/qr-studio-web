'use client';

import { SessionProvider } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEffect } from 'react';

export default function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force dark mode permanently
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <SessionProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SessionProvider>
  );
}
