import { ClientLayout } from '@/components/layout/ClientLayout';

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
