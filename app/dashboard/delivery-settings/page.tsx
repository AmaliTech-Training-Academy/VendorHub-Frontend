"use client";

import { CircleAlert, Truck } from "lucide-react";
import { toast } from "sonner";

import { DeliverySettingsForm } from "@/components/shared/DeliverySettingsForm";
import { DeliverySettingsFormSkeleton } from "@/components/shared/DeliverySettingsFormSkeleton";
import { DashboardPageHeader } from "@/components/shared/layout/dashboard/DashboardPageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDeliverySettings } from "@/hooks/useDeliverySettings";
import { useUpdateDeliverySettings } from "@/hooks/useUpdateDeliverySettings";
import { useVendorId } from "@/hooks/useVendorId";
import type { DeliverySettingsFormValues } from "@/types/deliverySettings";

export default function DeliverySettingsPage() {
  const vendorId = useVendorId();
  const { data: settings, isPending, isError } = useDeliverySettings(vendorId);
  const updateSettings = useUpdateDeliverySettings(vendorId);

  function handleSubmit(values: DeliverySettingsFormValues) {
    updateSettings.mutate(values, {
      onSuccess: () => toast.success("Delivery settings saved"),
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <DashboardPageHeader
        title="Delivery settings"
        description="Set the days, time windows, and fee employees see when ordering from you."
        icon={Truck}
      />

      {isPending && (
        <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-5 sm:p-6">
          <DeliverySettingsFormSkeleton />
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Unable to load delivery settings</AlertTitle>
          <AlertDescription>
            Something went wrong loading your delivery settings. Please try
            again.
          </AlertDescription>
        </Alert>
      )}

      {settings && (
        <div className="w-full max-w-7xl rounded-lg border border-border bg-card p-5 sm:p-6">
          <DeliverySettingsForm
            defaultValues={settings}
            isSubmitting={updateSettings.isPending}
            submitError={updateSettings.error?.message}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}
