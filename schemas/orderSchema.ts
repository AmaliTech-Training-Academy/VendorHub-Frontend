import { z } from "zod";

import { parseDecimal } from "@/lib/api/mapping";
import { ORDER_STATUSES } from "@/lib/constants";

/** A vendor's delivery window, as listed on the vendor (see vendorSchema). */
export const deliveryWindowSchema = z.object({
  id: z.number(),
  label: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

export const cartItemSchema = z.object({
  productId: z.number(),
  vendorId: z.string(),
  name: z.string(),
  price: z.number().gt(0),
  quantity: z.number().int().positive(),
});

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * What the cart hands to placeOrder. The employee comes from the JWT and the
 * prices/totals are computed by the backend, so neither is sent.
 */
export const placeOrderSchema = z.object({
  vendorId: z.string().min(1, "Select a vendor"),
  items: z.array(cartItemSchema).min(1, "Your cart is empty"),
  deliveryWindowId: z
    .number({ error: "Select a delivery window" })
    .int()
    .positive("Select a delivery window"),
  /** YYYY-MM-DD, one of the vendor's available days. */
  deliveryDate: z
    .string({ error: "Select a delivery date" })
    .regex(DATE_RE, "Select a delivery date"),
});

/** Validated by the cart page's form — the only fields the employee edits directly. */
export const confirmOrderSchema = placeOrderSchema.pick({
  deliveryWindowId: true,
  deliveryDate: true,
});

/** OrderCreateOutput and OrderListOutput, which have identical fields. */
const orderApiSchema = z.object({
  id: z.number(),
  order_code: z.string(),
  employee: z.number(),
  vendor: z.number(),
  vendor_name: z.string(),
  delivery_window: z.number(),
  delivery_date: z.string(),
  selected_window_name: z.string(),
  selected_start_time: z.string(),
  selected_end_time: z.string(),
  items: z.array(
    z.object({
      id: z.number(),
      product_id: z.number(),
      product_name: z.string(),
      quantity: z.number(),
      unit_price: z.string(),
      subtotal: z.string(),
    }),
  ),
  subtotal: z.string(),
  delivery_fee: z.string(),
  total_amount: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

type OrderStatusValue = (typeof ORDER_STATUSES)[number];

/** The backend's StatusEnum values; note the spaces in "READY FOR COLLECTION". */
export const ORDER_STATUS_WIRE: Record<OrderStatusValue, string> = {
  received: "RECEIVED",
  preparing: "PREPARING",
  ready_for_collection: "READY FOR COLLECTION",
};

/**
 * An order that already exists server-side must never fail to parse (the
 * employee would retry and double-order), so an unrecognised status falls
 * back to "received" instead of throwing.
 */
export function toOrderStatus(status: string): OrderStatusValue {
  const normalised = status.trim().toUpperCase().replace(/_/g, " ");
  return (
    ORDER_STATUSES.find((s) => ORDER_STATUS_WIRE[s] === normalised) ?? "received"
  );
}

/** The status a vendor can move an order to next, or null once it's ready. */
export function nextOrderStatus(status: OrderStatusValue): OrderStatusValue | null {
  return ORDER_STATUSES[ORDER_STATUSES.indexOf(status) + 1] ?? null;
}

export const orderSchema = orderApiSchema.transform((raw) => ({
  id: String(raw.id),
  reference: raw.order_code,
  vendorId: String(raw.vendor),
  /** Snapshotted at order time so a later vendor rename doesn't rewrite history. */
  vendorName: raw.vendor_name,
  employeeId: String(raw.employee),
  items: raw.items.map((item) => ({
    productId: item.product_id,
    vendorId: String(raw.vendor),
    name: item.product_name,
    price: parseDecimal(item.unit_price),
    quantity: item.quantity,
  })),
  deliveryWindowId: raw.delivery_window,
  deliveryWindowLabel: `${raw.selected_window_name} · ${raw.selected_start_time.slice(0, 5)}–${raw.selected_end_time.slice(0, 5)}`,
  deliveryDate: raw.delivery_date,
  subtotal: parseDecimal(raw.subtotal),
  deliveryFee: parseDecimal(raw.delivery_fee),
  total: parseDecimal(raw.total_amount),
  status: toOrderStatus(raw.status),
  createdAt: raw.created_at,
}));

/** PATCH /api/orders/{id}/status/ response (OrderStatusUpdateOutput). */
export const orderStatusUpdateSchema = z
  .object({ id: z.number(), status: z.string(), updated_at: z.string() })
  .transform((raw) => ({ id: String(raw.id), status: toOrderStatus(raw.status) }));
