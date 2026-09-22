import { z } from "zod";

export const deliveryWindowSchema = z.object({
  id: z.string(),
  label: z.string(),
  available: z.boolean(),
});

export const cartItemSchema = z.object({
  productId: z.string(),
  vendorId: z.string(),
  name: z.string(),
  price: z.number().gt(0),
  quantity: z.number().int().positive(),
});

export const placeOrderSchema = z.object({
  vendorId: z.string().min(1, "Select a vendor"),
  employeeId: z.string().min(1),
  items: z.array(cartItemSchema).min(1, "Your cart is empty"),
  deliveryWindowId: z.string().min(1, "Select a delivery window"),
});

/** Validated by the cart page's form — the only field the employee edits directly. */
export const confirmOrderSchema = placeOrderSchema.pick({ deliveryWindowId: true });

export const ORDER_STATUSES = [
  "placed",
  "confirmed",
  "preparing",
  "ready_for_collection",
  "collected",
] as const;

export const orderSchema = z.object({
  id: z.string(),
  reference: z.string(),
  vendorId: z.string(),
  /** Snapshotted at order time so a later vendor rename doesn't rewrite history. */
  vendorName: z.string(),
  employeeId: z.string(),
  items: z.array(cartItemSchema),
  deliveryWindowId: z.string(),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  total: z.number().nonnegative(),
  status: z.enum(ORDER_STATUSES),
  createdAt: z.string(),
});
