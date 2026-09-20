"use client"

import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"

function StorefrontProductCard({
  product,
  quantityInCart = 0,
  onAdd,
}: {
  product: Product
  quantityInCart?: number
  onAdd: (product: Product) => void
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium">{product.name}</span>
        <span className="shrink-0 font-medium">{formatPrice(product.price)}</span>
      </div>
      <p className="text-sm text-muted-foreground">{product.description}</p>
      <div className="mt-1 flex items-center justify-between">
        {quantityInCart > 0 ? (
          <Badge variant="success">In cart: {quantityInCart}</Badge>
        ) : (
          <span />
        )}
        <Button size="sm" variant="outline" onClick={() => onAdd(product)}>
          <Plus />
          Add to cart
        </Button>
      </div>
    </div>
  )
}

export { StorefrontProductCard }
