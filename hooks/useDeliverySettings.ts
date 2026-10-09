import { useQuery } from "@tanstack/react-query";

import { deliverySettingsQueryKey } from "@/hooks/deliverySettingsQueries";
import { fetchDeliverySettings } from "@/lib/api/vendors";

export function useDeliverySettings(vendorId: string | null) {
  return useQuery({
    queryKey: deliverySettingsQueryKey(vendorId),
    queryFn: () => fetchDeliverySettings(),
    enabled: Boolean(vendorId),
  });
}
