import Image from "next/image";

import { CalendarDays, Clock, MapPin, Phone, Store, Truck } from "lucide-react";

import {
  formatDeliveryDays,
  formatDeliveryFee,
  formatTimeWindows,
} from "@/lib/utils";
import type { Vendor } from "@/types/vendor";

import { HeroChip } from "./HeroChip";

export function VendorHero({
  vendor,
  heroImage,
}: {
  vendor: Vendor;
  heroImage?: string;
}) {
  const hasContact = Boolean(vendor.address || vendor.phone);

  return (
    <section className="relative isolate min-h-72 overflow-hidden rounded-lg bg-slate-950 text-white sm:min-h-88">
      <Image
        src={heroImage ?? "/street.jpg"}
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/70 to-slate-950/20"
      />
      <div className="relative flex min-h-72 flex-col justify-between gap-8 p-6 sm:min-h-88 sm:p-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-orange-300">
            <Store aria-hidden="true" className="size-4" />
            <span>{vendor.categories[0] ?? "Local business"}</span>
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

          {/* Contact details only render for vendors who have filled them in */}
          {hasContact && (
            <dl className="flex flex-wrap gap-2 text-sm">
              {vendor.address && (
                <HeroChip icon={MapPin} label="Address">
                  {vendor.address}
                </HeroChip>
              )}
              {vendor.phone && (
                <HeroChip icon={Phone} label="Contact">
                  <a
                    href={`tel:${vendor.phone.replace(/\s+/g, "")}`}
                    className="underline-offset-2 hover:underline focus-visible:underline"
                  >
                    {vendor.phone}
                  </a>
                </HeroChip>
              )}
            </dl>
          )}
        </div>

        <dl className="flex flex-wrap gap-2 text-sm">
          <HeroChip icon={Truck} label="Delivery fee">
            {formatDeliveryFee(vendor.deliveryFee)}
          </HeroChip>
          <HeroChip icon={CalendarDays} label="Delivery days">
            {formatDeliveryDays(vendor.availableDays)}
          </HeroChip>
          <HeroChip icon={Clock} label="Delivery times">
            {formatTimeWindows(vendor.timeWindows)}
          </HeroChip>
        </dl>
      </div>
    </section>
  );
}
