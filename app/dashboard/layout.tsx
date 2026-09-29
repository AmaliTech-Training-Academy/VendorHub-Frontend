// app/dashboard/layout.tsx
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardShell } from "@/components/shared/layout/dashboard/DashboardShell";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <AuthGuard allowedRoles={["VENDOR"]}>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
