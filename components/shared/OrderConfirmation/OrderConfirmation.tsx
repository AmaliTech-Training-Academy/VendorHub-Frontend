import Link from "next/link"
import { PartyPopper } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Order } from "@/types/order"

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(price)
}

function OrderConfirmation({ order }: { order: Order }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <PartyPopper className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Order placed!</h2>
        <p className="text-sm text-muted-foreground">
          Your order has been sent to the vendor.
        </p>
      </div>
      <div className="rounded-md bg-muted px-4 py-2 font-mono text-sm">
        {order.reference}
      </div>
      <p className="text-sm text-muted-foreground">
        Total charged: {formatPrice(order.total)}
      </p>
      <Link href="/storefront/vendors">
        <Button variant="outline">Continue browsing</Button>
      </Link>
    </div>
  )
}

export { OrderConfirmation }
