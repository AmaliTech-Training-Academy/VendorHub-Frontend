"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

function CartSummary({
  subtotal,
  deliveryFee,
  isSubmitting,
}: {
  subtotal: number
  deliveryFee: number
  isSubmitting?: boolean
}) {
  const total = subtotal + deliveryFee

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Delivery fee</span>
        <span>{formatPrice(deliveryFee)}</span>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3 font-medium">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      <Button type="submit" disabled={isSubmitting} className="mt-1">
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        Confirm order
      </Button>
    </div>
  )
}

export { CartSummary }
