"use client";

import { CircleAlert, Store } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EmptyState } from "@/components/shared/EmptyState";
import { VendorCard } from "@/components/shared/VendorCard";
import { VendorList } from "@/components/shared/VendorList";
import { VendorListSkeleton } from "@/components/shared/VendorListSkeleton";
import { useVendors } from "@/hooks/useVendors";

export default function VendorsPage() {
  const { data: vendors, isPending, isError } = useVendors();

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-accent via-accent/60 to-transparent p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Store aria-hidden="true" className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Hungry? Here&apos;s who&apos;s open
          </h1>
          <p className="text-sm text-muted-foreground">
            Pick a vendor, fill your basket, and we&apos;ll bring it to your desk.
          </p>
        </div>
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
          {vendors.map((vendor, index) => (
            <VendorCard key={vendor.id} vendor={vendor} index={index} />
          ))}
        </VendorList>
      )}
    </div>
  );
}
