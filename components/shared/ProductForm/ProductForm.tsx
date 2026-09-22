"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CircleAlert, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DialogFooter } from "@/components/ui/dialog"
import { PRODUCT_CATEGORIES, productSchema } from "@/lib/schemas/productSchema"
import { cn } from "@/lib/utils"
import type { ProductFormInput, ProductFormValues } from "@/types/product"

const DEFAULT_VALUES: ProductFormInput = {
  name: "",
  description: "",
  price: "",
  category: PRODUCT_CATEGORIES[0],
  inStock: true,
}

function ProductForm({
  defaultValues,
  isSubmitting,
  submitLabel,
  submittingLabel,
  submitError,
  onSubmit,
  onCancel,
}: {
  defaultValues?: ProductFormValues
  isSubmitting?: boolean
  submitLabel: string
  submittingLabel: string
  submitError?: string
  onSubmit: (values: ProductFormValues) => void
  onCancel?: () => void
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ?? DEFAULT_VALUES,
    mode: "onTouched",
  })

  const inStock = watch("inStock")

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
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
          <Select
            id="product-category"
            aria-invalid={!!errors.category}
            disabled={isSubmitting}
            {...register("category")}
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          {errors.category && (
            <p role="alert" className="text-sm text-destructive">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
        <Label htmlFor="product-in-stock" className="cursor-pointer">
          In stock
        </Label>
        <Switch
          id="product-in-stock"
          checked={inStock}
          disabled={isSubmitting}
          onCheckedChange={(checked) => setValue("inStock", checked)}
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
  )
}

export { ProductForm }
