"use client"

import Link from "next/link"
import { CircleAlert, ShoppingCart, Store } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { VendorCard } from "@/components/shared/VendorCard"
import { VendorList } from "@/components/shared/VendorList"
import { VendorListSkeleton } from "@/components/shared/VendorListSkeleton"
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

      {isPending && <VendorListSkeleton />}

      {isError && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Unable to load vendors</AlertTitle>
          <AlertDescription>
            Something went wrong loading vendors. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {vendors && vendors.length === 0 && (
        <EmptyState
          icon={Store}
          title="No vendors available"
          description="Check back later for active vendors."
        />
      )}

      {vendors && vendors.length > 0 && (
        <VendorList>
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </VendorList>
      )}
    </div>
  )
}
