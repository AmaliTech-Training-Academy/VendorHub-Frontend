import { CalendarDays, Clock, Truck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { WEEKDAY_LABELS } from "@/schemas/deliverySettingsSchema";
import type { Vendor } from "@/types/vendor";

type DeliveryDetails = Partial<
  Pick<Vendor, "deliveryFee" | "availableDays" | "timeWindows">
>;

type DeliveryDetailsCardProps = {
  vendor: DeliveryDetails | undefined;
  isPending: boolean;
};

export function DeliveryDetailsCard({
  vendor,
  isPending,
}: DeliveryDetailsCardProps) {
  const loadingOrUnset = isPending ? "Loading..." : "Not set";

  const deliveryFee =
    vendor?.deliveryFee === null
      ? loadingOrUnset
      : formatPrice(Number(vendor?.deliveryFee));

  const deliveryDays = vendor?.availableDays?.length
    ? vendor.availableDays.map((day) => WEEKDAY_LABELS[day]).join(", ")
    : loadingOrUnset;

  const deliveryWindows = vendor?.timeWindows ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery details</CardTitle>
        <CardDescription>
          Current information shown to customers
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col  justify-between gap-3">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck aria-hidden="true" className="size-4" />
            Delivery fee
          </span>
          <span className="text-sm font-medium">{deliveryFee}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays aria-hidden="true" className="size-4" />
            Delivery days
          </span>
          <span className="text-sm font-medium">{deliveryDays}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock aria-hidden="true" className="size-4" />
            Delivery windows
          </span>
          {deliveryWindows.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {deliveryWindows.map((window) => (
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
            <span className="text-sm font-medium">{loadingOrUnset}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
