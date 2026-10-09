"use client";

import { Store } from "lucide-react";
import { toast } from "sonner";


import { DashboardPageHeader } from "@/components/shared/layout/dashboard/DashboardPageHeader";
import { DeliveryDetailsCard } from "@/components/shared/layout/dashboard/DeliveryDetailsCard";
import { StoreIdentityCard } from "@/components/shared/layout/dashboard/StoreIdentityCard";
import { VendorProfileForm } from "@/components/shared/layout/dashboard/VendorProfileForm";
import { useDeliverySettings } from "@/hooks/useDeliverySettings";
import { useVendorProfile } from "@/hooks/useVendorProfile";
import { useAuthStore } from "@/store/useAuthStore";

const HEADER = {
  title: "Store profile",
  description:
    "Keep your store identity and storefront details together in one place.",
  icon: Store,
};

export default function VendorProfilePage() {
  // if (!VENDOR_PROFILE_ENABLED) {
  //   return (
  //     <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
  //       <DashboardPageHeader {...HEADER} />
  //       <EmptyState
  //         icon={Store}
  //         title="Store profile is coming soon"
  //         description="Editing your address, phone, slogans and storefront image will be available here shortly."
  //       />
  //     </div>
  //   );
  // }

  return <VendorProfileEditor />;
}

function VendorProfileEditor() {
  const authEmail = useAuthStore((state) => state.email);
  const authName = useAuthStore((state) => state.displayName);
  const vendorId = useAuthStore((state) => state.userId)?.toString() || null;
  const profileForm = useVendorProfile({
    onSuccess: () => toast.success("Profile updated"),
    onError: (message) => toast.error(message),
  });

  const { data: deliverySettings, isPending: isDeliveryPending } =
    useDeliverySettings(vendorId);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <DashboardPageHeader {...HEADER} />

      <div className="grid min-w-0 grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <VendorProfileForm form={profileForm} />

        <aside className="flex min-w-0 flex-col gap-6">
          <StoreIdentityCard
            vendorId={vendorId}
            name={authName}
            email={authEmail}
          />
          <DeliveryDetailsCard
            vendor={deliverySettings}
            isPending={isDeliveryPending}
          />
        </aside>
      </div>
    </div>
  );
}
