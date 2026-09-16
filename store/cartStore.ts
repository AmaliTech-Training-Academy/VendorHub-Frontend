import { create } from "zustand";
import type { CartItem } from "@/types/order";

export type AddCartItemInput = {
  productId: string;
  vendorId: string;
  name: string;
  price: number;
};

export type AddItemResult = { blocked: true } | { blocked: false };

type CartState = {
  vendorId: string | null;
  items: CartItem[];
  deliveryWindowId: string | null;
  /** Fails with `{ blocked: true }` instead of adding when the item belongs
   *  to a different vendor than what's already in the cart — the caller
   *  decides whether to block or confirm-clear via `clearCart`. */
  addItem: (item: AddCartItemInput) => AddItemResult;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDeliveryWindow: (deliveryWindowId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  vendorId: null,
  items: [],
  deliveryWindowId: null,

  addItem: (item) => {
    const { vendorId, items } = get();
    if (vendorId && vendorId !== item.vendorId) {
      return { blocked: true };
    }

    const existing = items.find((i) => i.productId === item.productId);
    set({
      vendorId: item.vendorId,
      items: existing
        ? items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...items, { ...item, quantity: 1 }],
    });
    return { blocked: false };
  },

  removeItem: (productId) =>
    set((state) => {
      const items = state.items.filter((i) => i.productId !== productId);
      return {
        items,
        vendorId: items.length > 0 ? state.vendorId : null,
        deliveryWindowId: items.length > 0 ? state.deliveryWindowId : null,
      };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        const items = state.items.filter((i) => i.productId !== productId);
        return {
          items,
          vendorId: items.length > 0 ? state.vendorId : null,
          deliveryWindowId: items.length > 0 ? state.deliveryWindowId : null,
        };
      }
      return {
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        ),
      };
    }),

  setDeliveryWindow: (deliveryWindowId) => set({ deliveryWindowId }),

  clearCart: () => set({ vendorId: null, items: [], deliveryWindowId: null }),
}));
