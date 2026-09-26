"use client";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { FloatingCart } from "@/components/shared/layout/storefront/FloatingCart";
import { StorefrontNav } from "@/components/shared/layout/storefront/StorefrontNav";

export default function StorefrontLayout({
  children,
}: LayoutProps<"/storefront">) {
  return (
    <AuthGuard allowedRoles={["EMPLOYEE"]}>
      <div className="flex  flex-col space-y-30  md:space-y-25 mad:p-4 ">
        <StorefrontNav />
        <main className="mx-auto flex w-full justify-center md:max-w-7xl">
          {children}
        </main>
        <FloatingCart />
      </div>
    </AuthGuard>
  );
}
