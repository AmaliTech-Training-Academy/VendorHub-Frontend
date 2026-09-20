import Link from "next/link"
import { Store } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { Vendor } from "@/types/vendor"

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Link
      href={`/storefront/vendors/${vendor.id}`}
      className="flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Store className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{vendor.name}</span>
          <span className="text-sm text-muted-foreground">
            {vendor.categories.join(", ")}
          </span>
        </div>
      </div>
      <Badge variant="outline" className="w-fit">
        Delivery fee: {formatPrice(vendor.deliveryFee)}
      </Badge>
    </Link>
  )
}

export { VendorCard }
