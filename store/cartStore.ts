import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import { z } from "zod";
import { cartItemSchema } from "@/schemas/orderSchema";
import { useAuthStore } from "@/store/useAuthStore";
import type { CartItem } from "@/types/order";

export type AddCartItemInput = {
  productId: number;
  vendorId: string;
  name: string;
  price: number;
};

export type AddItemResult = { blocked: true } | { blocked: false };

type CartState = {
  vendorId: string | null;
  items: CartItem[];
  /** The user the cart belongs to, so one person's cart is never restored for another. */
  ownerId: number | null;
  /** False until the saved cart has been read back from localStorage. */
  hasHydrated: boolean;
  deliveryWindowId: number | null;
  /** YYYY-MM-DD */
  deliveryDate: string | null;
  /** Fails with `{ blocked: true }` instead of adding when the item belongs
   *  to a different vendor than what's already in the cart — the caller
   *  decides whether to block or confirm-clear via `clearCart`. */
  addItem: (item: AddCartItemInput) => AddItemResult;
  removeItem: (productId: number) => void;
  /** Removes the item entirely when its quantity would drop below 1. */
  decreaseQuantity: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  setDeliveryWindow: (deliveryWindowId: number) => void;
  setDeliveryDate: (deliveryDate: string) => void;
  clearCart: () => void;
};

/** Drops an item; an emptied cart also forgets its vendor and delivery choices. */
function withoutItem(state: CartState, productId: number) {
  const items = state.items.filter((i) => i.productId !== productId);
  return {
    items,
    vendorId: items.length > 0 ? state.vendorId : null,
    ownerId: items.length > 0 ? state.ownerId : null,
    deliveryWindowId: items.length > 0 ? state.deliveryWindowId : null,
    deliveryDate: items.length > 0 ? state.deliveryDate : null,
  };
}

/** Only the items are saved; delivery date/window are re-picked on each visit. */
const persistedCartSchema = z.object({
  vendorId: z.string().nullable(),
  items: z.array(cartItemSchema),
  ownerId: z.number().nullable(),
});

type PersistedCart = z.infer<typeof persistedCartSchema>;

function emptyCart(): PersistedCart {
  return { vendorId: null, items: [], ownerId: null };
}

export const CART_STORAGE_KEY = "vendorhub-cart";

// localStorage can be blocked (private modes) or full. Saving is best-effort:
// a failure must never break adding to the cart or leave hydration hanging.
const safeStorage: StateStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Not saved; the in-memory cart still works.
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Nothing to remove if storage is unavailable.
    }
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      vendorId: null,
      items: [],
      ownerId: null,
      hasHydrated: false,
      deliveryWindowId: null,
      deliveryDate: null,

      addItem: (item) => {
        const { vendorId, items } = get();
        if (vendorId && vendorId !== item.vendorId) {
          return { blocked: true };
        }

        const existing = items.find((i) => i.productId === item.productId);
        set({
          vendorId: item.vendorId,
          ownerId: useAuthStore.getState().userId,
          items: existing
            ? items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
              )
            : [...items, { ...item, quantity: 1 }],
        });
        return { blocked: false };
      },

      removeItem: (productId) => set((state) => withoutItem(state, productId)),

      decreaseQuantity: (productId) =>
        set((state) => {
          const item = state.items.find((i) => i.productId === productId);
          if (!item) return state;
          if (item.quantity <= 1) return withoutItem(state, productId);
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
            ),
          };
        }),

      increaseQuantity: (productId) =>
        set((state) => {
          if (!state.items.some((i) => i.productId === productId)) return state;
          return {
            items: state.items.map((i) =>
              i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }),

      setDeliveryWindow: (deliveryWindowId) => set({ deliveryWindowId }),

      setDeliveryDate: (deliveryDate) => set({ deliveryDate }),

      clearCart: () =>
        set({
          vendorId: null,
          items: [],
          ownerId: null,
          deliveryWindowId: null,
          deliveryDate: null,
        }),
    }),
    {
      name: CART_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: ({ vendorId, items, ownerId }) => ({ vendorId, items, ownerId }),
      // Hydrated from a layout effect, not at import time, so the first client
      // render matches the server-rendered (empty) cart.
      skipHydration: true,
      // Saved data is untrusted: an old shape, hand-edited value or another
      // user's cart is ignored instead of crashing or leaking across accounts.
      merge: (persisted, current) => {
        const parsed = persistedCartSchema.safeParse(persisted);
        const owned =
          parsed.success && parsed.data.ownerId === useAuthStore.getState().userId;
        return { ...current, ...(owned ? parsed.data : emptyCart()) };
      },
      migrate: emptyCart,
      onRehydrateStorage: () => () => {
        useCartStore.setState({ hasHydrated: true });
      },
    },
  ),
);

// A different user (or a logout) must never see or restore the previous cart.
useAuthStore.subscribe((state, previous) => {
  if (state.userId !== previous.userId) useCartStore.getState().clearCart();
});

/** Total quantity across all cart items, e.g. for a cart button's badge count. */
export function useCartItemCount() {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
}

/** Sum of price × quantity across all cart items, before the delivery fee. */
export function useCartSubtotal() {
  return useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
}
