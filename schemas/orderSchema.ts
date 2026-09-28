import { z } from "zod";
import { ORDER_STATUSES } from "@/lib/constants";

export const deliveryWindowSchema = z.object({
  id: z.string(),
  label: z.string(),
  available: z.boolean(),
});

export const cartItemSchema = z.object({
  productId: z.number(),
  vendorId: z.string(),
  name: z.string(),
  price: z.number().gt(0),
  quantity: z.number().int().positive(),
});

export const placeOrderSchema = z.object({
  vendorId: z.string().min(1, "Select a vendor"),
  /** Passed by the caller (already has the vendor loaded) rather than looked
   *  up here, so the orders mock doesn't need to depend on the vendors API. */
  vendorName: z.string().min(1),
  deliveryFee: z.number().nonnegative(),
  employeeId: z.string().min(1),
  items: z.array(cartItemSchema).min(1, "Your cart is empty"),
  deliveryWindowId: z.string().min(1, "Select a delivery window"),
});

/** Validated by the cart page's form — the only field the employee edits directly. */
export const confirmOrderSchema = placeOrderSchema.pick({ deliveryWindowId: true });

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
