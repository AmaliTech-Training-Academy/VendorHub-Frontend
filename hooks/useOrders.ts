import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrdersByVendor, placeOrder } from "@/lib/api/orders";
import type { PlaceOrderInput } from "@/types/order";

export function ordersQueryKey(vendorId: string) {
  return ["orders", vendorId] as const;
}

/** Powers the vendor's incoming orders dashboard. */
export function useVendorOrders(vendorId: string) {
  return useQuery({
    queryKey: ordersQueryKey(vendorId),
    queryFn: () => fetchOrdersByVendor(vendorId),
    enabled: Boolean(vendorId),
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PlaceOrderInput) => placeOrder(input),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKey(order.vendorId) });
    },
  });
}
