"use client";
import { useState } from "react";
import { toast } from "sonner";

import { useCartStore } from "@/store/cartStore";
import type { VendorProduct } from "@/types/product";

export function useAddToCart(vendorId: string) {
  const { addItem, clearCart } = useCartStore();
  const [pendingSwitchProduct, setPendingSwitchProduct] =
    useState<VendorProduct | null>(null);

  function add(product: VendorProduct) {
    return addItem({
      productId: product.id,
      vendorId,
      name: product.name,
      price: product.price,
    });
  }

  function handleAdd(product: VendorProduct) {
    if (add(product).blocked) {
      setPendingSwitchProduct(product);
      return;
    }
    toast.success(`${product.name} added to cart`);
  }

  function confirmSwitchVendor() {
    if (!pendingSwitchProduct) {
      return;
    }
    clearCart();
    const { blocked } = add(pendingSwitchProduct);
    if (!blocked) {
      toast.success(`${pendingSwitchProduct.name} added to cart`);
    }
    setPendingSwitchProduct(null);
  }

  return {
    handleAdd,
    confirmSwitchVendor,
    pendingSwitchProduct,
    cancelSwitch: () => {
      setPendingSwitchProduct(null);
    },
  };
}
