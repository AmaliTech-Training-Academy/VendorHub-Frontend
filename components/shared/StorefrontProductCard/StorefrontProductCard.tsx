"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { VendorProduct } from "@/types/product";

import { ProductImage } from "../layout/storefront/ProductImage";

function StorefrontProductCard({
  product,
  quantityInCart = 0,
  index = 0,
  onAdd,
  onIncrease,
  onDecrease,
}: {
  product: VendorProduct;
  quantityInCart?: number;
  index?: number;
  onAdd: (product: VendorProduct) => void;
  onIncrease?: (productId: number) => void;
  onDecrease?: (productId: number) => void;
}) {
  const showStepper = quantityInCart > 0 && onIncrease && onDecrease;

  return (
    <div
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
      className={`group flex flex-col sm:w-xs overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards motion-reduce:animate-none hover:shadow-md hover:shadow-primary/10 cursor-pointer ${
        quantityInCart > 0 ? "border-primary/40" : "border-border"
      }`}
    >
      <ProductImage name={product.name} />

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="truncate text-sm font-semibold leading-snug">
          {product.name}
        </h3>

        <p className="line-clamp-1 text-xs text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">
            {formatPrice(product.price)}
          </span>

          {showStepper ? (
            <div
              role="group"
              aria-label={`Quantity of ${product.name} in cart`}
              className="flex items-center gap-0.5 rounded-full bg-primary/10 p-0.5"
            >
              <Button
                size="icon-sm"
                variant="ghost"
                className="size-6 rounded-full"
                aria-label={`Remove one ${product.name}`}
                onClick={() => {
                  onDecrease(product.id);
                }}
              >
                <Minus className="size-3.5" />
              </Button>
              <span
                aria-live="polite"
                className="min-w-5 text-center text-xs font-semibold tabular-nums"
              >
                {quantityInCart}
              </span>
              <Button
                size="icon-sm"
                className="size-6 rounded-full"
                aria-label={`Add one more ${product.name}`}
                onClick={() => {
                  onIncrease(product.id);
                }}
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              size="icon-sm"
              className="size-6 rounded-full"
              aria-label={`Add ${product.name}`}
              onClick={() => {
                onAdd(product);
              }}
            >
              <Plus className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export { StorefrontProductCard };
