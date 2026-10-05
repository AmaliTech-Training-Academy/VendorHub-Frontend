import Image from "next/image";

import { Upload } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { VendorProfileFormInput } from "@/types/vendorProfile";

import type { FieldErrors } from "react-hook-form";

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
