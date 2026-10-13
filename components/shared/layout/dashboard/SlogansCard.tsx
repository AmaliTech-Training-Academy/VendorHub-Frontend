
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type {
  VendorProfileFormInput,
  VendorProfileFormValues,
} from "@/types/vendorProfile";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

const MAX_SLOGAN_LENGTH = 150;

export function SlogansCard({
  register,
  errors,
  className,
}: {
  /**
   * Accepted so existing callers keep compiling. The single-slogan card
   * registers the input directly and doesn't need it.
   */
  control?: Control<VendorProfileFormInput, unknown, VendorProfileFormValues>;
  register: UseFormRegister<VendorProfileFormInput>;
  errors: FieldErrors<VendorProfileFormInput>;
  className?: string;
}) {
  const sloganError =
    errors.slogans?.[0]?.value?.message ??
    errors.slogans?.message ??
    errors.slogans?.root?.message;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Slogan</CardTitle>
        <CardDescription>
          A short line that appears on your storefront (max {MAX_SLOGAN_LENGTH}{" "}
          characters)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <Input
          {...register("slogans.0.value")}
          aria-label="Slogan"
          maxLength={MAX_SLOGAN_LENGTH}
          placeholder="e.g. Local favorites, delivered."
        />
        {sloganError && (
          <Alert variant="destructive" className="px-3 py-2 text-xs">
            <AlertDescription>{sloganError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
