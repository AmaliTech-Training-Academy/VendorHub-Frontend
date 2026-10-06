"use client";

import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  Clock,
  Coffee,
  PackageX,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { StorefrontProductCard } from "@/components/shared/StorefrontProductCard";
import { VendorCatalogueSkeleton } from "@/components/shared/VendorCatalogueSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useVendor, useVendorCatalogue } from "@/hooks/useVendors";
import { formatPrice } from "@/lib/utils";
import { WEEKDAY_LABELS } from "@/schemas/deliverySettingsSchema";
import { useCartStore } from "@/store/cartStore";
import type { VendorProduct } from "@/types/product";

const defaultVendorMessages = [
  "Local favorites, delivered.",
  "Lunch break, upgraded.",
  "Easy ordering, right to your desk.",
  "Good food, one less errand.",
];
const vendorMessageIcons = [Sparkles, Coffee, Truck, Store];

function VendorCatalogue({
  vendorId,
  heroImage,
}: {
  vendorId: string;
  heroImage?: string;
}) {
  const { data: vendor, isPending: isVendorPending } = useVendor(vendorId);
  const { data: products, isPending, isError } = useVendorCatalogue(vendorId);
  const vendorMessages =
    vendor?.slogans.filter((message) => message.trim().length > 0) ??
    defaultVendorMessages;
  const marqueeMessages =
    vendorMessages.length > 0 ? vendorMessages : defaultVendorMessages;
  const { items, addItem, clearCart, increaseQuantity, decreaseQuantity } =
    useCartStore();

  const [pendingSwitchProduct, setPendingSwitchProduct] =
    useState<VendorProduct | null>(null);

  function handleAdd(product: VendorProduct) {
    const result = addItem({
      productId: product.id,
      vendorId,
      name: product.name,
      price: product.price,
    });
    if (result.blocked) {
      setPendingSwitchProduct(product);
      return;
    }
    toast.success(`${product.name} added to cart`);
  }

  function confirmSwitchVendor() {
    if (!pendingSwitchProduct) {
      return;
    }
    clearCart();
    const result = addItem({
      productId: pendingSwitchProduct.id,
      vendorId,
      name: pendingSwitchProduct.name,
      price: pendingSwitchProduct.price,
    });
    setPendingSwitchProduct(null);
    if (!result.blocked) {
      toast.success(`${pendingSwitchProduct.name} added to cart`);
    }
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
          <Skeleton className="h-72 w-full rounded-lg sm:h-88" />
        ) : (
          vendor && (
            <section className="relative isolate min-h-72 overflow-hidden rounded-lg bg-slate-950 text-white sm:min-h-88">
              <Image
                src={heroImage ?? "/street.jpg"}
                alt=""
                fill
                priority
                // sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover "
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/70 to-slate-950/20"
              />
              <div className="relative flex min-h-72 flex-col justify-between gap-8 p-6 sm:min-h-88 sm:p-8">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-orange-300">
                    <Store aria-hidden="true" className="size-4" />
                    <span>LOCAL BUSINESS</span>
                  </div>
                  <h1 className="max-w-2xl text-3xl leading-tight font-semibold sm:text-4xl">
                    {vendor.name}
                  </h1>
                  {vendor.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {vendor.categories.map((category) => (
                        <span
                          key={category}
                          className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <dl className="flex flex-wrap gap-2 text-sm">
                  <div className="flex items-center gap-2 rounded-md border border-white/20 bg-slate-950/35 px-3 py-2 backdrop-blur-sm">
                    <dt className="sr-only">Delivery fee</dt>
                    <Truck
                      aria-hidden="true"
                      className="size-4 text-orange-300"
                    />
                    <dd className="font-medium">
                      {vendor.deliveryFee === null
                        ? "Delivery fee unavailable"
                        : `${formatPrice(vendor.deliveryFee)} delivery`}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-white/20 bg-slate-950/35 px-3 py-2 backdrop-blur-sm">
                    <dt className="sr-only">Delivery days</dt>
                    <CalendarDays
                      aria-hidden="true"
                      className="size-4 text-orange-300"
                    />
                    <dd>
                      {vendor.availableDays.length > 0
                        ? vendor.availableDays
                            .map((day) => WEEKDAY_LABELS[day])
                            .join(", ")
                        : "No delivery days listed"}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-white/20 bg-slate-950/35 px-3 py-2 backdrop-blur-sm">
                    <dt className="sr-only">Delivery times</dt>
                    <Clock
                      aria-hidden="true"
                      className="size-4 text-orange-300"
                    />
                    <dd>
                      {vendor.timeWindows.length > 0
                        ? vendor.timeWindows
                            .map(
                              (window) =>
                                `${window.startTime}–${window.endTime}`,
                            )
                            .join(", ")
                        : "No delivery times listed"}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          )
        )}
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

        {products && products.length === 0 && (
          <EmptyState
            icon={PackageX}
            title="No products in stock"
            description="This vendor has no available products right now."
          />
        )}

        {products && products.length > 0 && (
          <section
            aria-labelledby="vendor-menu-heading"
            className="flex flex-col gap-4"
          >
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-primary">
                  From {vendor?.name ?? "your local vendor"}
                </p>
                <h2 id="vendor-menu-heading" className="text-xl font-semibold">
                  Today&apos;s selection
                </h2>
              </div>
              <span className="text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="overflow-hidden border-y border-border/70 py-2.5">
              <p className="sr-only">{marqueeMessages.join(" ")}</p>
              <div
                aria-hidden="true"
                className="vendor-message-track flex w-max items-center"
              >
                {[...marqueeMessages, ...marqueeMessages].map(
                  (message, index) => (
                    <span
                      key={index}
                      className="flex shrink-0 items-center gap-2.5 pr-7 text-xs text-muted-foreground sm:text-sm"
                    >
                      {(() => {
                        const Icon =
                          vendorMessageIcons[index % vendorMessageIcons.length];
                        return (
                          <>
                            <Icon
                              aria-hidden="true"
                              className="size-3.5 text-primary/70"
                            />
                            {message}
                            <span className="ml-4 size-1 rounded-full bg-primary/60" />
                          </>
                        );
                      })()}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {products.map((product, index) => (
                <StorefrontProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={
                    items.find((item) => item.productId === product.id)
                      ?.quantity ?? 0
                  }
                  index={index}
                  onAdd={handleAdd}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <AlertDialog
        open={!!pendingSwitchProduct}
        onOpenChange={(open) => {
          if (!open) {
            setPendingSwitchProduct(null);
          }
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
