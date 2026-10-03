"use client";

import { CircleAlert, Truck } from "lucide-react";
import { toast } from "sonner";

import { DeliverySettingsForm } from "@/components/shared/DeliverySettingsForm";
import { DeliverySettingsFormSkeleton } from "@/components/shared/DeliverySettingsFormSkeleton";
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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center gap-4 rounded-2xl bg-linear-to-br from-accent via-accent/60 to-transparent p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-orange-400 shadow-sm dark:ring-1 dark:ring-white/15">
          <Truck aria-hidden="true" className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Delivery settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Set the days, time windows, and fee employees see when ordering
            from you.
          </p>
        </div>
      </div>

      {isPending && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
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
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
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
