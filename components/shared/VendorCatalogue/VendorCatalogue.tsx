"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  Clock,
  PackageX,
  Store,
  Truck,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { StorefrontProductCard } from "@/components/shared/StorefrontProductCard";
import { VendorCatalogueSkeleton } from "@/components/shared/VendorCatalogueSkeleton";
import { useVendor, useVendorCatalogue } from "@/hooks/useVendors";
import { WEEKDAY_LABELS } from "@/schemas/deliverySettingsSchema";
import { formatPrice } from "@/lib/utils";
import { useCartItemCount, useCartStore } from "@/store/cartStore";
import type { Product } from "@/types/product";

function VendorCatalogue({ vendorId }: { vendorId: string }) {
  const { data: vendor, isPending: isVendorPending } = useVendor(vendorId);
  const { data: products, isPending, isError } = useVendorCatalogue(vendorId);
  const { items, addItem, clearCart, increaseQuantity, decreaseQuantity } =
    useCartStore();

  const [pendingSwitchProduct, setPendingSwitchProduct] =
    useState<Product | null>(null);

  function handleAdd(product: Product) {
    const result = addItem({
      productId: product.id,
      vendorId: product.vendorId,
      name: product.name,
      price: product.price,
    });
    if (result.blocked) {
      setPendingSwitchProduct(product);
    }
  }

  function confirmSwitchVendor() {
    if (!pendingSwitchProduct) return;
    clearCart();
    addItem({
      productId: pendingSwitchProduct.id,
      vendorId: pendingSwitchProduct.vendorId,
      name: pendingSwitchProduct.name,
      price: pendingSwitchProduct.price,
    });
    setPendingSwitchProduct(null);
  }

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

        {isVendorPending ? (
          <Skeleton className="h-36 w-full rounded-2xl" />
        ) : (
          vendor && (
            <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-accent via-accent/60 to-transparent p-5">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-sm">
                  <Store aria-hidden="true" className="size-7" />
                </div>
                <div className="flex min-w-0 flex-col gap-1.5">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {vendor.name}
                  </h1>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full bg-card/80 px-2 py-0.5 text-xs font-medium text-accent-foreground"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <dl className="flex flex-wrap gap-2 text-sm">
                <div className="flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1.5">
                  <dt className="sr-only">Delivery fee</dt>
                  <Truck aria-hidden="true" className="size-4 text-primary" />
                  <dd className="font-medium">
                    {formatPrice(vendor.deliveryFee)} delivery
                  </dd>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1.5">
                  <dt className="sr-only">Delivery days</dt>
                  <CalendarDays
                    aria-hidden="true"
                    className="size-4 text-primary"
                  />
                  <dd>
                    {vendor.availableDays
                      .map((day) => WEEKDAY_LABELS[day])
                      .join(", ")}
                  </dd>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-card/80 px-3 py-1.5">
                  <dt className="sr-only">Delivery times</dt>
                  <Clock aria-hidden="true" className="size-4 text-primary" />
                  <dd>
                    {vendor.timeWindows
                      .map((window) => `${window.startTime}–${window.endTime}`)
                      .join(", ")}
                  </dd>
                </div>
              </dl>
            </div>
          )
        )}
      </div>

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

      {products && products.length === 0 && (
        <EmptyState
          icon={PackageX}
          title="No products in stock"
          description="This vendor has no available products right now."
        />
      )}

      {products && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {products.map((product, index) => (
            <StorefrontProductCard
              key={product.id}
              product={product}
              quantityInCart={
                items.find((item) => item.productId === product.id)?.quantity ??
                0
              }
              index={index}
              onAdd={handleAdd}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
            />
          ))}
        </div>
      )}

      <AlertDialog
        open={!!pendingSwitchProduct}
        onOpenChange={(open) => {
          if (!open) setPendingSwitchProduct(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start a new order?</AlertDialogTitle>
            <AlertDialogDescription>
              Your cart has items from another vendor. Orders can only include
              products from a single vendor. Clear your cart and add this item
              instead?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSwitchVendor}>
              Clear cart & add item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export { VendorCatalogue };
