"use client";

import Link from "next/link";

import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartItemCount } from "@/store/cartStore";

export function FloatingCart() {
  const cartCount = useCartItemCount();
  const [isBouncing, setIsBouncing] = useState(false);
  const [prevCount, setPrevCount] = useState(cartCount);

  // Track count changes during render rather than in an effect.
  if (cartCount !== prevCount) {
    setPrevCount(cartCount);
    if (cartCount > prevCount) {
      setIsBouncing(true);
    }
  }

  useEffect(() => {
    if (!isBouncing) {
      return;
    }
    const timeout = setTimeout(() => { setIsBouncing(false); }, 400);
    return () => { clearTimeout(timeout); };
  }, [isBouncing]);

  if (cartCount === 0) {return null;}

  return (
    <Link
      href="/storefront/cart"
      aria-label={`View cart, ${String(cartCount)} ${cartCount === 1 ? "item" : "items"}`}
      className={cn(
        buttonVariants({ size: "icon" }),
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 transition-transform",
        isBouncing ? "scale-110" : "scale-100",
      )}
    >
      <ShoppingCart className="size-6" />
      <span
        aria-hidden="true"
        className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-900 px-1 text-[11px] font-semibold text-white"
      >
        {cartCount}
      </span>
    </Link>
  );
}
