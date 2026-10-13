import { Plus, Trash2 } from "lucide-react";
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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

// Keep this in sync with the `.max(...)` on `slogans` in the vendor profile schema.
const MAX_SLOGANS = 5;

export function SlogansCard({
  control,
  register,
  errors,
  className,
}: {
  control: Control<VendorProfileFormInput, unknown, VendorProfileFormValues>;
  register: UseFormRegister<VendorProfileFormInput>;
  errors: FieldErrors<VendorProfileFormInput>;
  className?: string;
}) {
  const { fields, append, remove } = useFieldArray<
    VendorProfileFormInput,
    "slogans"
  >({ control, name: "slogans" });

  const slogansError = errors.slogans?.message ?? errors.slogans?.root?.message;
  const canAddMore = fields.length < MAX_SLOGANS;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Slogans</CardTitle>
        <CardDescription>
          Short lines that scroll across your storefront (up to {MAX_SLOGANS},
          max 150 characters each)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {fields.map((field, index) => {
          const sloganError = errors.slogans?.[index]?.value?.message;

          return (
            <div key={field.id} className="flex items-start gap-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <Input
                  {...register(`slogans.${index}.value` as const)}
                  maxLength={150}
                  placeholder="e.g. Local favorites, delivered."
                />
                {sloganError && (
                  <Alert variant="destructive" className="px-3 py-2 text-xs">
                    <AlertDescription>{sloganError}</AlertDescription>
                  </Alert>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  remove(index);
                }}
                aria-label={`Remove slogan ${index + 1}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          );
        })}

        {slogansError && (
          <Alert variant="destructive" className="px-3 py-2 text-xs">
            <AlertDescription>{slogansError}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => {
              append({ value: "" });
            }}
            disabled={!canAddMore}
          >
            <Plus className="size-4" />
            Add slogan
          </Button>
          <span className="text-xs text-muted-foreground tabular-nums">
            {fields.length} of {MAX_SLOGANS}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
