import { ClientLayout } from '@/components/layout/ClientLayout';

export default function GateLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
