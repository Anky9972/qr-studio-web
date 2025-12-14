'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force dark mode permanently
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
