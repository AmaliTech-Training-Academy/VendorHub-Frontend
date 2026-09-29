"use client";

import { CircleAlert } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DeliverySettingsForm } from "@/components/shared/DeliverySettingsForm";
import { DeliverySettingsFormSkeleton } from "@/components/shared/DeliverySettingsFormSkeleton";
import { useDeliverySettings } from "@/hooks/useDeliverySettings";
import { useUpdateDeliverySettings } from "@/hooks/useUpdateDeliverySettings";
import { MOCK_VENDOR_ID } from "@/lib/constants";
import type { DeliverySettingsFormValues } from "@/types/deliverySettings";

export default function DeliverySettingsPage() {
  const vendorId = MOCK_VENDOR_ID;
  const { data: settings, isPending, isError } = useDeliverySettings(vendorId);
  const updateSettings = useUpdateDeliverySettings(vendorId);

  function handleSubmit(values: DeliverySettingsFormValues) {
    updateSettings.mutate(values, {
      onSuccess: () => toast.success("Delivery settings saved"),
    });
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Delivery settings</h1>
        <p className="text-sm text-muted-foreground">
          Set the days, time windows, and fee employees see when ordering from
          you.
        </p>
      </div>

      {isPending && <DeliverySettingsFormSkeleton />}

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
        <DeliverySettingsForm
          defaultValues={settings}
          isSubmitting={updateSettings.isPending}
          submitError={updateSettings.error?.message}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
