import { ClientLayout } from '@/components/layout/ClientLayout';

export default function ExtensionLayout({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
