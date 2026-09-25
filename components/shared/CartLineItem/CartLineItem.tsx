"use client"

import { Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import type { CartItem } from "@/types/order"

function CartLineItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: CartItem
  onDecrease: (productId: string) => void
  onIncrease: (productId: string) => void
  onRemove: (productId: string) => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <ShoppingBasket aria-hidden="true" className="size-6" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-semibold">{item.name}</span>
        <span className="text-sm text-muted-foreground">
          {formatPrice(item.price)} each
        </span>
      </div>

      <div
        role="group"
        aria-label={`Quantity of ${item.name}`}
        className="flex items-center gap-1 rounded-full bg-primary/10 p-0.5"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          aria-label={`Decrease quantity of ${item.name}`}
          onClick={() => onDecrease(item.productId)}
        >
          <Minus />
        </Button>
        <span
          aria-live="polite"
          className="min-w-6 text-center text-sm font-semibold tabular-nums"
        >
          {item.quantity}
        </span>
        <Button
          type="button"
          size="icon-sm"
          className="rounded-full"
          aria-label={`Increase quantity of ${item.name}`}
          onClick={() => onIncrease(item.productId)}
        >
          <Plus />
        </Button>
      </div>

      <span className="w-20 shrink-0 text-right font-semibold">
        {formatPrice(item.price * item.quantity)}
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Remove ${item.name} from cart`}
        onClick={() => onRemove(item.productId)}
      >
        <Trash2 className="text-destructive" />
      </Button>
    </div>
  )
}

export { CartLineItem }
