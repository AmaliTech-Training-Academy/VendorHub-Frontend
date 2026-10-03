import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deliverySettingsQueryKey } from "@/hooks/deliverySettingsQueries";
import { updateDeliverySettings } from "@/lib/api/vendors";
import type { DeliverySettingsFormValues } from "@/types/deliverySettings";

export function useUpdateDeliverySettings(vendorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeliverySettingsFormValues) => updateDeliverySettings(input),
    onSuccess: () => {
      // The dashboard's own settings view...
      void queryClient.invalidateQueries({ queryKey: deliverySettingsQueryKey(vendorId) });
      // ...and every place the storefront reads this vendor's public data,
      // so the change appears there immediately too.
      void queryClient.invalidateQueries({ queryKey: ["vendors", vendorId] });
      void queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}
