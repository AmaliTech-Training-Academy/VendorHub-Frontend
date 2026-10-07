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
  >({
    control,
    name: "slogans",
  });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Slogans</CardTitle>
        <CardDescription>
          Short lines that scroll across your storefront banner — up to 5
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="flex flex-1 flex-col gap-1.5">
              <Input
                {...register(`slogans.${index}.value` as const)}
                placeholder="e.g. Local favorites, delivered."
              />
              {errors.slogans?.[index]?.value?.message && (
                <Alert variant="destructive" className="px-3 py-2 text-xs">
                  <AlertDescription>
                    {errors.slogans[index].value.message}
                  </AlertDescription>
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
              aria-label="Remove slogan"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        {errors.slogans?.message && (
          <Alert variant="destructive" className="px-3 py-2 text-xs">
            <AlertDescription>{errors.slogans.message}</AlertDescription>
          </Alert>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          onClick={() => {
            append({ value: "" });
          }}
          disabled={fields.length >= 5}
        >
          <Plus className="size-4" />
          Add slogan
        </Button>
      </CardContent>
    </Card>
  );
}
