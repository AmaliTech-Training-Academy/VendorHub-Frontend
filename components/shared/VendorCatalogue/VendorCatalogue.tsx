"use client";

import Link from "next/link";

import {
  ArrowLeft,
  CircleAlert,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";


import { VendorCatalogueSkeleton } from "@/components/shared/VendorCatalogueSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useVendor, useVendorCatalogue } from "@/hooks/useVendors";

import { useAddToCart } from "../layout/storefront/catalogue/CartLogics";
import { ProductsSection } from "../layout/storefront/catalogue/ProductsSection";
import { SwitchVendorDialog } from "../layout/storefront/catalogue/SwitchVendorDialog";
import { VendorHero } from "../layout/storefront/catalogue/VendorHero";

function VendorCatalogue({
  vendorId,
  heroImage,
}: {
  vendorId: string;
  heroImage?: string;
}) {
  const { data: vendor, isPending: isVendorPending } = useVendor(vendorId);
  const { data: products, isPending, isError } = useVendorCatalogue(vendorId);
  const { handleAdd, confirmSwitchVendor, pendingSwitchProduct, cancelSwitch } =
    useAddToCart(vendorId);

  // Local Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Clean filters helper trigger
  const handleResetFilters = () => {
    setSearchQuery("");
    setMaxPrice("");
  };

  // Compute live client-side dataset filtering
  const filteredProducts = useMemo(() => {
    if (!products) {
      return [];
    }

    return products.filter((product) => {
      const matchesName = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPrice =
        maxPrice === "" || product.price <= parseFloat(maxPrice);
      return matchesName && matchesPrice;
    });
  }, [products, searchQuery, maxPrice]);

  return (
    <div className="w-full  mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner Navigation Row */}
      <div className="flex flex-col gap-3">
        <Link
          href="/storefront/vendors"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to vendors
        </Link>

        {isVendorPending && (
          <Skeleton className="w-full h-48 sm:h-64 rounded-2xl bg-muted/60" />
        )}
        {vendor && <VendorHero vendor={vendor} heroImage={heroImage} />}
      </div>

      {/* Main Structural Wrapper: Adapts responsively from mobile stacks to a persistent desktop row */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* RESPONSIVE STICKY SIDEBAR: Stays pinned on screen scroll on desktop */}
        {products && products.length > 0 && (
          <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-20 z-10 space-y-5 bg-card p-5 rounded-2xl border border-border shadow-sm">
            {/* Header controls layout block */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                <h2 className="font-semibold text-sm text-foreground">
                  Filters
                </h2>
              </div>
              {(searchQuery || maxPrice) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-destructive font-medium flex items-center gap-1"
                >
                  <X className="size-3" />
                  Reset
                </Button>
              )}
            </div>

            {/* Responsive grid split: inline configuration on mobile viewports, single stacking on larger viewports */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* 1. Filter Item: Name Search query input field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="search-menu-input"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Search Menu
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
                  <Input
                    id="search-menu-input"
                    placeholder="Search by item name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                    }}
                    className="pl-9 h-9 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* 2. Filter Item: Maximum item valuation matching limit selection */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="budget"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Maximum Budget
                  </label>
                  {maxPrice && (
                    <span className="text-xs font-semibold text-primary">
                      GH₵{maxPrice}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground/60">
                    GH₵
                  </span>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    placeholder="Enter maximum price..."
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                    }}
                    className="pl-12 h-9 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* PRODUCTS LIST PANEL CONTAINER */}
        <div className="flex-1 min-w-0 w-full">
          {isPending && <VendorCatalogueSkeleton />}

          {isError && (
            <Alert variant="destructive" className="rounded-2xl">
              <CircleAlert className="size-4" />
              <AlertTitle>Unable to load catalogue</AlertTitle>
              <AlertDescription>
                Something went wrong loading this vendor&apos;s catalogue.
                Please try again.
              </AlertDescription>
            </Alert>
          )}

          {products &&
            (filteredProducts.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/10 p-6 text-center">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  No matches found
                </p>
                <p className="text-xs text-muted-foreground/70 mb-3">
                  Try adjusting your filters or search keywords.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="rounded-xl h-8 text-xs"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <ProductsSection
                vendor={vendor}
                products={filteredProducts}
                onAdd={handleAdd}
              />
            ))}
        </div>
      </div>

      {/* Switch Vendor Conflict Alert Modal Window overlay trigger */}
      <SwitchVendorDialog
        open={!!pendingSwitchProduct}
        onCancel={cancelSwitch}
        onConfirm={confirmSwitchVendor}
      />
    </div>
  );
}

export { VendorCatalogue };
