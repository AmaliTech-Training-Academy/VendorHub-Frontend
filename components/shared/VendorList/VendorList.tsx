import { EmptyState } from "@/components/shared/EmptyState"
import { VendorCard } from "@/components/shared/VendorCard"
import type { Vendor } from "@/types/vendor"

function VendorList({ vendors }: { vendors: Vendor[] }) {
  if (vendors.length === 0) {
    return (
      <EmptyState
        title="No vendors available"
        description="Check back later for active vendors."
      />
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
