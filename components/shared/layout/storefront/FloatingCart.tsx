"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartItemCount } from "@/store/cartStore";

export function FloatingCart() {
  const cartCount = useCartItemCount();
  const [isBouncing, setIsBouncing] = useState(false);
  const [prevCount, setPrevCount] = useState(cartCount);

  useEffect(() => {
    if (cartCount > prevCount) {
      setIsBouncing(true);
      const timeout = setTimeout(() => setIsBouncing(false), 400);
      return () => clearTimeout(timeout);
    }
    setPrevCount(cartCount);
  }, [cartCount, prevCount]);

  if (cartCount === 0) return null;

  return (
    <Link href="/storefront/cart" className="fixed bottom-6 right-6 z-50">
      <Button
        size="icon"
        className={`relative h-14 w-14 rounded-full shadow-lg bg-orange-500 hover:bg-orange-600 transition-transform ${
          isBouncing ? "scale-110" : "scale-100"
        }`}
      >
        <ShoppingCart className="size-6" />
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-900 px-1 text-[11px] font-semibold text-white">
          {cartCount}
        </span>
      </Button>
    </Link>
  );
}
