import { VendorCard } from "@/components/shared/VendorCard"
import type { Vendor } from "@/types/vendor"

function VendorList({ vendors }: { vendors: Vendor[] }) {
  if (vendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border py-16 text-center">
        <p className="text-sm font-medium">No vendors available</p>
        <p className="text-sm text-muted-foreground">
          Check back later for active vendors.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  )
}

export { VendorList }
