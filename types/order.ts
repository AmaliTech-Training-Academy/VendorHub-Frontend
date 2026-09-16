import { z } from "zod";

export const deliveryWindowSchema = z.object({
  id: z.string(),
  label: z.string(),
  available: z.boolean(),
});

export type DeliveryWindow = z.infer<typeof deliveryWindowSchema>;

export const cartItemSchema = z.object({
  productId: z.string(),
  vendorId: z.string(),
  name: z.string(),
  price: z.number().gt(0),
  quantity: z.number().int().positive(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const placeOrderSchema = z.object({
  vendorId: z.string().min(1, "Select a vendor"),
  employeeId: z.string().min(1),
  items: z.array(cartItemSchema).min(1, "Your cart is empty"),
  deliveryWindowId: z.string().min(1, "Select a delivery window"),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

/** Validated by the cart page's form — the only field the employee edits directly. */
export const confirmOrderSchema = placeOrderSchema.pick({ deliveryWindowId: true });

export type ConfirmOrderValues = z.infer<typeof confirmOrderSchema>;

export const orderSchema = z.object({
  id: z.string(),
  reference: z.string(),
  vendorId: z.string(),
  employeeId: z.string(),
  items: z.array(cartItemSchema),
  deliveryWindowId: z.string(),
  subtotal: z.number().nonnegative(),
  deliveryFee: z.number().nonnegative(),
  total: z.number().nonnegative(),
  status: z.enum(["pending", "confirmed"]),
  createdAt: z.string(),
});

export type Order = z.infer<typeof orderSchema>;
