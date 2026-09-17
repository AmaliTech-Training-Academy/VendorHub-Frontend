"use client"

import Link from "next/link"
import { Loader2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VendorList } from "@/components/shared/VendorList"
import { useVendors } from "@/hooks/useVendors"

export default function VendorsPage() {
  const { data: vendors, isPending, isError } = useVendors()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Vendors</h1>
          <p className="text-sm text-muted-foreground">
            Browse active vendors and start an order.
          </p>
        </div>
        <Link href="/storefront/cart">
          <Button variant="outline">
            <ShoppingCart />
            Cart
          </Button>
        </Link>
      </div>

      {isPending && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading vendors…
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Something went wrong loading vendors. Please try again.
        </p>
      )}

      {vendors && <VendorList vendors={vendors} />}
    </div>
  )
}
