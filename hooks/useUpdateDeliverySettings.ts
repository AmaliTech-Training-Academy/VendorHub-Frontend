import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deliverySettingsQueryKey } from "@/hooks/deliverySettingsQueries";
import { updateDeliverySettings } from "@/lib/api/vendors-mock";
import type { DeliverySettingsInput } from "@/types/deliverySettings";

export function useUpdateDeliverySettings(vendorId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeliverySettingsInput) =>
      updateDeliverySettings(vendorId, input),
    onSuccess: () => {
      // The dashboard's own settings view...
      queryClient.invalidateQueries({ queryKey: deliverySettingsQueryKey(vendorId) });
      // ...and every place the storefront reads this vendor's public data,
      // so the change appears there immediately too.
      queryClient.invalidateQueries({ queryKey: ["vendors", vendorId] });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
    },
  });
}
