import { ClientLayout } from '@/components/layout/ClientLayout';

export default function RedirectLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
