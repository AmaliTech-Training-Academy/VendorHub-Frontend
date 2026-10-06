import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchOrders, placeOrder, updateOrderStatus } from "@/lib/api/orders";
import type { Order, OrderStatus, PlaceOrderInput } from "@/types/order";

/** Keyed by the logged-in user so two accounts on one browser never share a cache. */
export function ordersQueryKey(userId: string) {
  return ["orders", userId] as const;
}

/**
 * The logged-in user's orders: a vendor's incoming orders or an employee's
 * history (the backend scopes the list by token). Polls so new orders and
 * status changes show up without a refresh; polling pauses in background tabs.
 */
export function useOrders(userId: string) {
  return useQuery({
    queryKey: ordersQueryKey(userId),
    queryFn: fetchOrders,
    enabled: Boolean(userId),
    refetchInterval: 20_000,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PlaceOrderInput) => placeOrder(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

/** Moves an order to a new status, updating the list optimistically. */
export function useUpdateOrderStatus(userId: string) {
  const queryClient = useQueryClient();
  const queryKey = ordersQueryKey(userId);

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      updateOrderStatus(orderId, status),
    onMutate: async ({ orderId, status }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Order[]>(queryKey);
      queryClient.setQueryData<Order[]>(queryKey, (orders) =>
        orders?.map((order) => (order.id === orderId ? { ...order, status } : order)),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}
