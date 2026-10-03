"use client";

import { notFound, useSearchParams } from "next/navigation";

import { Suspense } from "react";

import { VendorCatalogue } from "@/components/shared/VendorCatalogue";
import { VendorCatalogueSkeleton } from "@/components/shared/VendorCatalogueSkeleton";

// Vendor IDs aren't known at build time, so the static export reads the
// vendor from ?id= in the browser instead of a [vendorId] route segment.
function CatalogueFromQuery() {
  const vendorId = useSearchParams().get("id");
  if (!vendorId) {
    notFound();
  }
  return <VendorCatalogue vendorId={vendorId} />;
}

export default function VendorCataloguePage() {
  return (
    <Suspense fallback={<VendorCatalogueSkeleton />}>
      <CatalogueFromQuery />
    </Suspense>
  );
}
