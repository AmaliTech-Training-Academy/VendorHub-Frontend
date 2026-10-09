import { Mail, Store } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Vendor } from "@/types/vendor";

type StoreIdentityCardProps = {
  vendor: Vendor | undefined;
  email: string | null;
  isPending: boolean;
  isError: boolean;
};

export function StoreIdentityCard({
  vendor,
  email,
  isPending,
  isError,
}: StoreIdentityCardProps) {
  let storeName = "Unavailable";
  let vendorId = "Unavailable";
  if (isPending) {
    storeName = "Loading store...";
    vendorId = "Loading...";
  }
  if (vendor) {
    storeName = vendor.name;
    vendorId = String(vendor.id);
  }

  return (
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
          <span className="font-semibold">{storeName}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase text-muted-foreground">
            Vendor ID
          </span>
          <span className="font-mono text-sm">{vendorId}</span>
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
        {vendor && vendor.categories.length > 0 && (
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
  );
}
