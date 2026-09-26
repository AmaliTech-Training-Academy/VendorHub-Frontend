"use client";

import {
  Carrot,
  Coffee,
  Croissant,
  House,
  Milk,
  Minus,
  Package,
  Plus,
  ShoppingBasket,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

const CATEGORY_TILES: Record<
  Product["category"],
  { icon: LucideIcon; tile: string }
> = {
  Groceries: {
    icon: ShoppingBasket,
    tile: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300",
  },
  Beverages: {
    icon: Coffee,
    tile: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
  },
  Bakery: {
    icon: Croissant,
    tile: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
  },
  Produce: {
    icon: Carrot,
    tile: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  Dairy: {
    icon: Milk,
    tile: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300",
  },
  Household: {
    icon: House,
    tile: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300",
  },
  Other: { icon: Package, tile: "bg-muted text-muted-foreground" },
};

function StorefrontProductCard({
  product,
  quantityInCart = 0,
  index = 0,
  onAdd,
  onIncrease,
  onDecrease,
}: {
  product: Product;
  quantityInCart?: number;
  index?: number;
  onAdd: (product: Product) => void;
  onIncrease?: (productId: string) => void;
  onDecrease?: (productId: string) => void;
}) {
  const { icon: Icon, tile } =
    CATEGORY_TILES[product.category] ?? CATEGORY_TILES.Other;
  const showStepper = quantityInCart > 0 && onIncrease && onDecrease;

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
      className={`flex gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards motion-reduce:animate-none hover:shadow-md hover:shadow-primary/10 ${
        quantityInCart > 0 ? "border-primary/40" : "border-border"
      }`}
    >
      <div
        className={`flex size-16 shrink-0 items-center justify-center rounded-xl ${tile}`}
      >
        <Icon aria-hidden="true" className="size-8" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug">{product.name}</h3>
          <span className="shrink-0 font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {product.category}
          </span>
          {showStepper ? (
            <div
              role="group"
              aria-label={`Quantity of ${product.name} in cart`}
              className="flex items-center gap-1 rounded-full bg-primary/10 p-0.5"
            >
              <Button
                size="icon-sm"
                variant="ghost"
                className="rounded-full"
                aria-label={`Remove one ${product.name}`}
                onClick={() => onDecrease(product.id)}
              >
                <Minus />
              </Button>
              <span
                aria-live="polite"
                className="min-w-6 text-center text-sm font-semibold tabular-nums"
              >
                {quantityInCart}
              </span>
              <Button
                size="icon-sm"
                className="rounded-full"
                aria-label={`Add one more ${product.name}`}
                onClick={() => onIncrease(product.id)}
              >
                <Plus />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => onAdd(product)}
            >
              <Plus />
              Add
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export { StorefrontProductCard };
