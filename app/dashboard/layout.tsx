// app/dashboard/layout.tsx
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardShell } from "@/components/shared/layout/dashboard/DashboardShell";
import { UserRole } from "@/types/types";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <AuthGuard allowedRoles={[UserRole.VENDOR]}>
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
