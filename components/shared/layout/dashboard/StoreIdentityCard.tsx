import { Mail, Store } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// The storefront endpoint only returns address/phone/logo/slogan, so the
// identity fields (id, name, categories) are optional here.

type StoreIdentityCardProps = {
  vendorId: string | null;
  email?: string | null;
  name: string | null;
  isPending?: boolean;
  isError?: boolean;
};

export function StoreIdentityCard({
  vendorId,
  email,
  name,
  isPending,
  isError,
}: StoreIdentityCardProps) {
  let storeName = "Unavailable";
  let id = "Unavailable";
  if (isPending) {
    storeName = "Loading store...";
    id = "Loading...";
  }
  if (name) {
    storeName = name;
  }
  if (vendorId) {
    id = vendorId;
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
          <span className="font-mono text-sm">{id}</span>
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

        {isError && (
          <p role="status" className="text-sm text-muted-foreground">
            Store details could not be loaded right now.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
