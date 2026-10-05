"use client";

import { CalendarDays, Clock, Mail, Store, Truck } from "lucide-react";

import { VendorProfileForm } from "@/components/shared/layout/dashboard/VendorProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useVendor } from "@/hooks/useVendors";
import { formatPrice } from "@/lib/utils";
import { WEEKDAY_LABELS } from "@/schemas/deliverySettingsSchema";
import { useAuthStore } from "@/store/useAuthStore";

export default function VendorProfilePage() {
  const userId = useAuthStore((state) => state.userId);
  const email = useAuthStore((state) => state.email);
  const {
    data: vendor,
    isPending,
    isError,
  } = useVendor(userId === null ? "" : String(userId));

  return (
    <div className="w-full max-w-none space-y-8">
      <header className="flex flex-col gap-2 border-b border-border pb-5">
        <p className="text-sm font-medium text-primary">Vendor workspace</p>
        <h1 className="text-3xl font-semibold tracking-tight text-blue-950">
          Store profile
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Keep your store identity and storefront details together in one place.
        </p>
      </header>

      <div className="grid min-w-0 grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <VendorProfileForm />

        <aside className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store aria-hidden="true" className="size-5 text-primary" />
                Store identity
              </CardTitle>
              <CardDescription>
                Information associated with your vendor account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  Store name
                </span>
                <span className="font-semibold">
                  {isPending
                    ? "Loading store..."
                    : (vendor?.name ?? "Unavailable")}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  Vendor ID
                </span>
                <span className="font-mono text-sm">
                  {vendor?.id ?? (isPending ? "Loading..." : "Unavailable")}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
                  <Mail aria-hidden="true" className="size-3.5" />
                  Account email
                </span>
                <span className="break-all text-sm font-medium">
                  {email ?? "Sign in again to load your email"}
                </span>
              </div>
              {vendor?.categories && vendor.categories.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Categories
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {vendor.categories.map((category) => (
                      <span
                        key={category}
                        className="border border-border px-2 py-1 text-xs"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {isError && (
                <p role="status" className="text-sm text-muted-foreground">
                  Store details could not be loaded right now.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery details</CardTitle>
              <CardDescription>
                Current information shown to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck aria-hidden="true" className="size-4" />
                  Delivery fee
                </span>
                <span className="text-sm font-medium">
                  {vendor ? formatPrice(vendor.deliveryFee) : "Loading..."}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays aria-hidden="true" className="size-4" />
                  Delivery days
                </span>
                <span className="text-sm font-medium">
                  {vendor?.availableDays.length
                    ? vendor.availableDays
                        .map((day) => WEEKDAY_LABELS[day])
                        .join(", ")
                    : isPending
                      ? "Loading..."
                      : "Not set"}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock aria-hidden="true" className="size-4" />
                  Delivery windows
                </span>
                {vendor?.timeWindows.length ? (
                  <ul className="flex flex-col gap-1">
                    {vendor.timeWindows.map((window) => (
                      <li
                        key={window.id}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span>{window.label}</span>
                        <span className="text-muted-foreground">
                          {window.startTime}–{window.endTime}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-sm font-medium">
                    {isPending ? "Loading..." : "Not set"}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
