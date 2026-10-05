"use client";

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
    <div className="w-full max-w-none space-y-8">
      <header className="flex flex-col gap-2 border-b border-border pb-5">
        <p className="text-sm font-medium text-primary">Vendor workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight text-blue-950">
          Store profile
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Keep your store identity and storefront details together in one place.
        </p>
      </header>

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
