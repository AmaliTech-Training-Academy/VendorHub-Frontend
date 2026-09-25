import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrdersByEmployee, fetchOrdersByVendor, placeOrder } from "@/lib/api/orders-mock";
import type { PlaceOrderInput } from "@/types/order";

export function ordersQueryKey(vendorId: string) {
  return ["orders", vendorId] as const;
}

export function employeeOrdersQueryKey(employeeId: string) {
  return ["orders", "employee", employeeId] as const;
}

/** Powers the vendor's incoming orders dashboard. */
export function useVendorOrders(vendorId: string) {
  return useQuery({
    queryKey: ordersQueryKey(vendorId),
    queryFn: () => fetchOrdersByVendor(vendorId),
    enabled: Boolean(vendorId),
  });
}

/**
 * Powers the employee's order history page. Polls so status changes (e.g. a
 * vendor marking an order ready for collection) show up without a manual
 * refresh; refetchIntervalInBackground defaults to false, so polling pauses
 * once the tab isn't visible.
 */
export function useEmployeeOrders(employeeId: string) {
  return useQuery({
    queryKey: employeeOrdersQueryKey(employeeId),
    queryFn: () => fetchOrdersByEmployee(employeeId),
    enabled: Boolean(employeeId),
    refetchInterval: 20_000,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PlaceOrderInput) => placeOrder(input),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ordersQueryKey(order.vendorId) });
      queryClient.invalidateQueries({
        queryKey: employeeOrdersQueryKey(order.employeeId),
      });
    },
  });
}
