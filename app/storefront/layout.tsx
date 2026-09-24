import { AuthGuard } from "@/components/auth/AuthGuard";

export default function StorefrontLayout({
  children,
}: LayoutProps<"/storefront">) {
  return <AuthGuard allowedRoles={["EMPLOYEE"]}>{children}</AuthGuard>;
}
