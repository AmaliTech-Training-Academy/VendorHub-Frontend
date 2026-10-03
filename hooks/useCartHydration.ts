import { useEffect } from "react";

import { useCartStore } from "@/store/cartStore";

/**
 * Restores the saved cart after mount. Doing it here instead of at import
 * time keeps the first client render identical to the server-rendered one.
 */
export function useCartHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);
}
