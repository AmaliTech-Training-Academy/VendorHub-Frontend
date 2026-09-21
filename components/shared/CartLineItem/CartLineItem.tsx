"use client"

import { Fragment } from "react"
import { Minus, Plus, Trash2 } from "lucide-react"
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
  const actions = [
    {
      key: "decrease",
      label: `Decrease quantity of ${item.name}`,
      icon: <Minus />,
      onClick: () => onDecrease(item.productId),
    },
    {
      key: "increase",
      label: `Increase quantity of ${item.name}`,
      icon: <Plus />,
      onClick: () => onIncrease(item.productId),
    },
    {
      key: "remove",
      label: `Remove ${item.name} from cart`,
      icon: <Trash2 className="text-destructive" />,
      onClick: () => onRemove(item.productId),
    },
  ]

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-muted-foreground">
          {formatPrice(item.price)} each
        </span>
      </div>
      <div className="flex items-center gap-1">
        {actions.map((action) => (
          <Fragment key={action.key}>
            {action.key === "increase" && (
              <span className="w-6 text-center text-sm">{item.quantity}</span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={action.label}
              onClick={action.onClick}
            >
              {action.icon}
            </Button>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export { CartLineItem }
