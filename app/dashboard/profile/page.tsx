"use client";

import { Store } from "lucide-react";
import { toast } from "sonner";

import { DashboardPageHeader } from "@/components/shared/layout/dashboard/DashboardPageHeader";
import { DeliveryDetailsCard } from "@/components/shared/layout/dashboard/DeliveryDetailsCard";
import { StoreIdentityCard } from "@/components/shared/layout/dashboard/StoreIdentityCard";
import { VendorProfileForm } from "@/components/shared/layout/dashboard/VendorProfileForm";
import { useVendorProfile } from "@/hooks/useVendorProfile";
import { useAuthStore } from "@/store/useAuthStore";

export default function VendorProfilePage() {
  const authEmail = useAuthStore((state) => state.email);
  const profileForm = useVendorProfile({
    onSuccess: () => toast.success("Profile updated"),
    onError: (message) => toast.error(message),
  });
  const { profile, isProfilePending, isProfileError } = profileForm;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <DashboardPageHeader
        title="Store profile"
        description="Keep your store identity and storefront details together in one place."
        icon={Store}
      />

      <div className="grid min-w-0 grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <VendorProfileForm form={profileForm} />

        <aside className="flex min-w-0 flex-col gap-6">
          <StoreIdentityCard
            vendor={profile}
            email={profile?.email ?? authEmail}
            isPending={isProfilePending}
            isError={isProfileError}
          />
          <DeliveryDetailsCard vendor={profile} isPending={isProfilePending} />
        </aside>
      </div>
    </div>
  );
}
