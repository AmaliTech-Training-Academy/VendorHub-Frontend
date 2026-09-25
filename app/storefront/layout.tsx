"use client";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { FloatingCart } from "@/components/shared/layout/storefront/FloatingCart";
import { StorefrontNav } from "@/components/shared/layout/storefront/StorefrontNav";

export default function StorefrontLayout({
  children,
}: LayoutProps<"/storefront">) {
  return (
    <AuthGuard allowedRoles={["EMPLOYEE"]}>
      <>
        <StorefrontNav />
        <main className="w-full md:max-w-7xl flex justify-start px-15">
          {children}
        </main>
        <FloatingCart />
      </>
    </AuthGuard>
  );
}
