import { apiRequest } from "@/lib/api/client";
import { orderSchema, placeOrderSchema } from "@/schemas/orderSchema";
import type { Order, PlaceOrderInput } from "@/types/order";

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
