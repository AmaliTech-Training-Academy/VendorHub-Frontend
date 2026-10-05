import Image from "next/image";

import { Plus, Trash2, Upload } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import type {
  VendorProfileFormInput,
  VendorProfileFormValues,
} from "@/schemas/vendorProfile";

export function StorefrontImageCard({
  imagePreview,
  errors,
  onImageChange,
}: {
  imagePreview: string | null;
  errors: FieldErrors<VendorProfileFormInput>;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Storefront image</CardTitle>
        <CardDescription>
          Shown as the banner on your storefront page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-muted">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Storefront preview"
                fill
                className="object-cover"
              />
            ) : (
              <Upload className="size-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="storefrontImage" className="w-fit cursor-pointer">
              <span className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted">
                <Upload className="size-4" />
                Upload image
              </span>
            </Label>
            <input
              id="storefrontImage"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={onImageChange}
            />
            <p className="text-xs text-muted-foreground">
              JPG, PNG, or WEBP. Max 5MB.
            </p>
            {errors.storefrontImage?.message && (
              <Alert variant="destructive" className="px-3 py-2 text-xs">
                <AlertDescription>
                  {errors.storefrontImage.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ContactDetailsCard({
  register,
  errors,
}: {
  register: UseFormRegister<VendorProfileFormInput>;
  errors: FieldErrors<VendorProfileFormInput>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact details</CardTitle>
        <CardDescription>
          So employees and VendorHub can reach you
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="address">Address</Label>
          <Input
            {...register("address")}
            id="address"
            placeholder="e.g. Ridge Office Park, Accra"
          />
          {errors.address?.message && (
            <Alert variant="destructive" className="px-3 py-2 text-xs">
              <AlertDescription>{errors.address.message}</AlertDescription>
            </Alert>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            {...register("phone")}
            id="phone"
            type="tel"
            placeholder="e.g. 024 123 4567"
          />
          {errors.phone?.message && (
            <Alert variant="destructive" className="px-3 py-2 text-xs">
              <AlertDescription>{errors.phone.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

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
            <div className="flex-1 flex flex-col gap-1.5">
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
              disabled={fields.length === 1}
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
