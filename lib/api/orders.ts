import { z } from "zod";

import { apiRequest } from "@/lib/api/client";
import {
  ORDER_STATUS_WIRE,
  orderSchema,
  orderStatusUpdateSchema,
  placeOrderSchema,
} from "@/schemas/orderSchema";
import type { Order, OrderStatus, PlaceOrderInput } from "@/types/order";

const orderListSchema = z.array(orderSchema);

/**
 * POST /api/orders/ — the employee is taken from the JWT and prices, fee and
 * total are computed by the backend, so only ids, quantities and the chosen
 * window/date are sent.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const parsed = placeOrderSchema.parse(input);

  const raw = await apiRequest<unknown>("orders/", {
    method: "POST",
    body: {
      vendor_id: Number(parsed.vendorId),
      items: parsed.items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
      })),
      selected_delivery_window: parsed.deliveryWindowId,
      delivery_date: parsed.deliveryDate,
    },
  });

  return orderSchema.parse(raw);
}

/**
 * GET /api/orders/list/ — scoped by the JWT: a vendor gets their incoming
 * orders, an employee gets their own. Not paginated. Newest first.
 */
export async function fetchOrders(): Promise<Order[]> {
  const raw = await apiRequest<unknown>("orders/list/");
  return orderListSchema
    .parse(raw)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** PATCH /api/orders/{id}/status/ */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const raw = await apiRequest<unknown>(`orders/${orderId}/status/`, {
    method: "PATCH",
    body: { status: ORDER_STATUS_WIRE[status] },
  });
  return orderStatusUpdateSchema.parse(raw);
}
