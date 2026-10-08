"use client";

import Link from "next/link";

import { ArrowLeft, CircleAlert } from "lucide-react";

import { VendorCatalogueSkeleton } from "@/components/shared/VendorCatalogueSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/storefront/vendors"
          className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to vendors
        </Link>

        {isVendorPending && (
          <Skeleton className="h-72 w-full rounded-lg sm:h-88" />
        )}
        {vendor && <VendorHero vendor={vendor} heroImage={heroImage} />}
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        {isPending && <VendorCatalogueSkeleton />}

        {isError && (
          <Alert variant="destructive">
            <CircleAlert />
            <AlertTitle>Unable to load catalogue</AlertTitle>
            <AlertDescription>
              Something went wrong loading this vendor&apos;s catalogue. Please
              try again.
            </AlertDescription>
          </Alert>
        )}

        {products && (
          <ProductsSection
            vendor={vendor}
            products={products}
            onAdd={handleAdd}
          />
        )}
      </div>

      <SwitchVendorDialog
        open={!!pendingSwitchProduct}
        onCancel={cancelSwitch}
        onConfirm={confirmSwitchVendor}
      />
    </div>
  );
}

export { VendorCatalogue };
