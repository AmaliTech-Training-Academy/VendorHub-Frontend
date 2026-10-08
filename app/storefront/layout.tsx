"use client";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { StorefrontNav } from "@/components/shared/layout/storefront/StorefrontNav";
import { useCartHydration } from "@/hooks/useCartHydration";

export default function StorefrontLayout({
  children,
}: LayoutProps<"/storefront">) {
  useCartHydration();

  return (
    <AuthGuard allowedRoles={["EMPLOYEE"]}>
      <div className="flex  flex-col space-y-6  md:space-y-0 ">
        <StorefrontNav />
        <main className="mx-auto flex w-full justify-center md:max-w-[90%]">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
