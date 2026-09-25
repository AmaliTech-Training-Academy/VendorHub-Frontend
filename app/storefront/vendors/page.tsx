"use client";

import { useState } from "react";
import { CircleAlert, Store } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { VendorCard } from "@/components/shared/VendorCard";
import { VendorList } from "@/components/shared/VendorList";
import { VendorListSkeleton } from "@/components/shared/VendorListSkeleton";
import { useVendors } from "@/hooks/useVendors";
import { groupVendorsByCategory } from "@/lib/vendors";

export default function VendorsPage() {
  const { data: vendors, isPending, isError } = useVendors();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const groups = vendors ? groupVendorsByCategory(vendors) : [];
  const visibleGroups = groups.filter(
    (group) => !selectedCategory || group.category === selectedCategory,
  );

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
        <div className="flex flex-col gap-8">
          {groups.length > 1 && (
            <div
              role="group"
              aria-label="Filter vendors by category"
              className="sticky top-0 z-10 -mx-6 flex flex-wrap gap-2 bg-background/85 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70"
            >
              <Button
                size="sm"
                className="rounded-full"
                variant={selectedCategory ? "outline" : "default"}
                aria-pressed={!selectedCategory}
                onClick={() => setSelectedCategory(null)}
              >
                All ({vendors.length})
              </Button>
              {groups.map((group) => (
                <Button
                  key={group.category}
                  size="sm"
                  className="rounded-full"
                  variant={selectedCategory === group.category ? "default" : "outline"}
                  aria-pressed={selectedCategory === group.category}
                  onClick={() => setSelectedCategory(group.category)}
                >
                  {group.category} ({group.vendors.length})
                </Button>
              ))}
            </div>
          )}

          {visibleGroups.map((group) => (
            <section
              key={group.category}
              aria-labelledby={`vendors-${group.category}`}
              className="flex flex-col gap-3"
            >
              <div className="flex items-baseline justify-between px-1">
                <h2
                  id={`vendors-${group.category}`}
                  className="text-lg font-semibold tracking-tight"
                >
                  {group.category}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {group.vendors.length}{" "}
                  {group.vendors.length === 1 ? "vendor" : "vendors"}
                </span>
              </div>
              <VendorList count={group.vendors.length}>
                {group.vendors.map((vendor, index) => (
                  <VendorCard key={vendor.id} vendor={vendor} index={index} />
                ))}
              </VendorList>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
