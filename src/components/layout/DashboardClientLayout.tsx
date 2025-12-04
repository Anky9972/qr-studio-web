'use client';

import { SessionProvider } from 'next-auth/react';
import { DashboardThemeProvider } from '@/components/providers/DashboardThemeProvider';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DashboardClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DashboardThemeProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </DashboardThemeProvider>
    </SessionProvider>
  );
}
