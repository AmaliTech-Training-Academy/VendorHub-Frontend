"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_PRODUCT_IMAGE_MB,
  PRODUCT_CATEGORIES,
  productSchema,
} from "@/schemas/productSchema";
import type { ProductFormInput, ProductFormValues } from "@/types/product";

const DEFAULT_VALUES: ProductFormInput = {
  name: "",
  description: "",
  price: "",
  category: "",
  inStock: true,
  image: null,
  removeImage: false,
};

function ProductForm({
  defaultValues,
  imageUrl,
  isSubmitting,
  submitLabel,
  submittingLabel,
  submitError,
  onSubmit,
  onCancel,
}: {
  defaultValues?: ProductFormValues;
  /** The product's current image when editing. */
  imageUrl?: string | null;
  isSubmitting?: boolean;
  submitLabel: string;
  submittingLabel: string;
  submitError?: string;
  onSubmit: (values: ProductFormValues) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ?? DEFAULT_VALUES,
    mode: "onTouched",
  });

  const inStock = useWatch({ control, name: "inStock" });
  const image = useWatch({ control, name: "image" });
  const removeImage = useWatch({ control, name: "removeImage" });

  // If 'image' is already a string URL or can be used directly:
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!image) {
      return;
    }

    const url = URL.createObjectURL(image);

    // Defers the state update so it is not synchronous within the effect body
    const timeoutId = setTimeout(() => {
      setPreview(url);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      URL.revokeObjectURL(url);
      setPreview(null);
    };
  }, [image]);

  // New file wins, then the saved image (unless the vendor removed it).
  const shownImage = preview ?? (removeImage ? null : (imageUrl ?? null));

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
      className="flex flex-col gap-4 "
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="product-name">Product name</Label>
        <Input
          id="product-name"
          placeholder="e.g. Jollof Rice (1kg)"
          aria-invalid={!!errors.name}
          disabled={isSubmitting}
          {...register("name")}
        />
        {errors.name && (
          <p role="alert" className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="product-description">Description</Label>
        <Textarea
          id="product-description"
          placeholder="Briefly describe the product"
          aria-invalid={!!errors.description}
          disabled={isSubmitting}
          {...register("description")}
        />
        {errors.description && (
          <p role="alert" className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-price">Price (GHS)</Label>
          <Input
            id="product-price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            aria-invalid={!!errors.price}
            disabled={isSubmitting}
            {...register("price")}
          />
          {errors.price && (
            <p role="alert" className="text-sm text-destructive">
              {errors.price.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="product-category">Category</Label>
          <Input
            id="product-category"
            list="product-category-suggestions"
            placeholder="e.g. Groceries"
            autoComplete="off"
            aria-invalid={!!errors.category}
            disabled={isSubmitting}
            {...register("category")}
          />
          {/* Suggestions only — a vendor can type any category, not just these. */}
          <datalist id="product-category-suggestions">
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          {errors.category && (
            <p role="alert" className="text-sm text-destructive">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="product-image">Product image</Label>
        <div className="flex items-center gap-3">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40">
            {shownImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={shownImage}
                alt="Product preview"
                className="size-full object-cover"
              />
            ) : (
              <ImagePlus
                aria-hidden="true"
                className="size-6 text-muted-foreground"
              />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <Input
              id="product-image"
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              aria-invalid={!!errors.image}
              disabled={isSubmitting}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setValue("image", file, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
                if (file) {
                  setValue("removeImage", false);
                }
              }}
            />
            {shownImage && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                disabled={isSubmitting}
                onClick={() => {
                  setValue("image", null, { shouldValidate: true });
                  // Only ask the backend to clear an image that already exists.
                  setValue("removeImage", Boolean(imageUrl));
                }}
              >
                <Trash2 className="size-4" />
                Remove image
              </Button>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, GIF or WebP, up to {MAX_PRODUCT_IMAGE_MB} MB. Optional.
        </p>
        {errors.image && (
          <p role="alert" className="text-sm text-destructive">
            {errors.image.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
        <Label htmlFor="product-in-stock" className="cursor-pointer">
          In stock
        </Label>
        <Switch
          id="product-in-stock"
          checked={inStock}
          disabled={isSubmitting}
          onCheckedChange={(checked) => {
            setValue("inStock", checked);
          }}
        />
      </div>

      {submitError && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Unable to save product</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <DialogFooter className={cn("mt-2")}>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}

export { ProductForm };
