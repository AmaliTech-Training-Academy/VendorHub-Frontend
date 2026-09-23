import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return <AuthGuard allowedRoles={["VENDOR"]}>{children}</AuthGuard>;
}
