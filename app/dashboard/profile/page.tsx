"use client";

import { Store } from "lucide-react";
import { DashboardPageHeader } from "@/components/shared/layout/dashboard/DashboardPageHeader";
import { DeliveryDetailsCard } from "@/components/shared/layout/dashboard/DeliveryDetailsCard";
import { StoreIdentityCard } from "@/components/shared/layout/dashboard/StoreIdentityCard";
import { VendorProfileForm } from "@/components/shared/layout/dashboard/VendorProfileForm";
import { useVendor } from "@/hooks/useVendors";
import { useAuthStore } from "@/store/useAuthStore";

export default function VendorProfilePage() {
  const userId = useAuthStore((state) => state.userId);
  const email = useAuthStore((state) => state.email);
  const {
    data: vendor,
    isPending,
    isError,
  } = useVendor(userId === null ? "" : String(userId));

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <DashboardPageHeader
        title="Store profile"
        description="Keep your store identity and storefront details together in one place."
        icon={Store}
      />

      <div className="grid min-w-0 grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <VendorProfileForm />

        <aside className="flex min-w-0 flex-col gap-6">
          <StoreIdentityCard
            vendor={vendor}
            email={email}
            isPending={isPending}
            isError={isError}
          />
          <DeliveryDetailsCard vendor={vendor} isPending={isPending} />
        </aside>
      </div>
    </div>
  );
}
