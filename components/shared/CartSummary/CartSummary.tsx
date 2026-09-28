"use client"

import { Loader2, ReceiptText } from "lucide-react"
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
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24">
      <div className="flex items-center gap-2">
        <ReceiptText aria-hidden="true" className="size-5 text-primary" />
        <h2 className="font-semibold">Order summary</h2>
      </div>
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Delivery fee</span>
          <span>{formatPrice(deliveryFee)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-border pt-4">
        <span className="font-medium">Total</span>
        <span className="text-xl font-semibold text-primary">
          {formatPrice(total)}
        </span>
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full rounded-full">
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {isSubmitting ? "Placing order…" : "Confirm order"}
      </Button>
    </div>
  )
}

export { CartSummary }
