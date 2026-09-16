import { useQuery } from "@tanstack/react-query";
import { fetchDeliveryWindows } from "@/lib/api/deliveryWindows";

export function useDeliveryWindows() {
  return useQuery({
    queryKey: ["deliveryWindows"],
    queryFn: fetchDeliveryWindows,
  });
}
