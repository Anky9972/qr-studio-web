import { ClientLayout } from "@/components/layout/ClientLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
