import type { z } from "zod";
import type {
  cartItemSchema,
  confirmOrderSchema,
  deliveryWindowSchema,
  orderSchema,
  placeOrderSchema,
} from "@/lib/schemas/orderSchema";

export type DeliveryWindow = z.infer<typeof deliveryWindowSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type ConfirmOrderValues = z.infer<typeof confirmOrderSchema>;
export type Order = z.infer<typeof orderSchema>;
