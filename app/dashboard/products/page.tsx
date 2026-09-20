"use client"

import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ProductForm } from "@/components/shared/ProductForm"
import { ProductsTable } from "@/components/shared/ProductsTable"
import {
  useAddProduct,
  useDeleteProduct,
  useEditProduct,
  useProducts,
  useToggleProductStock,
} from "@/hooks/useProducts"
import { MOCK_VENDOR_ID } from "@/lib/constants"
import type { Product, ProductFormValues } from "@/types/product"

type DialogState = { mode: "add" } | { mode: "edit"; product: Product } | null

export default function ProductsPage() {
  const vendorId = MOCK_VENDOR_ID
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const { data: products, isPending, isError } = useProducts(vendorId)
  const addProduct = useAddProduct(vendorId)
  const editProduct = useEditProduct(vendorId)
  const deleteProduct = useDeleteProduct(vendorId)
  const toggleStock = useToggleProductStock(vendorId)

  function handleSubmit(values: ProductFormValues) {
    if (dialogState?.mode === "edit") {
      editProduct.mutate(
        { id: dialogState.product.id, input: values },
        { onSuccess: () => setDialogState(null) }
      )
      return
    }
    addProduct.mutate(values, { onSuccess: () => setDialogState(null) })
  }

  const isSubmitting = addProduct.isPending || editProduct.isPending
  const submitError = (dialogState?.mode === "edit" ? editProduct : addProduct).error
    ?.message

  function openDialog(state: NonNullable<DialogState>) {
    addProduct.reset()
    editProduct.reset()
    setDialogState(state)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">My Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage the products in your catalogue.
          </p>
        </div>
        <Button onClick={() => openDialog({ mode: "add" })}>
          <Plus />
          Add product
        </Button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading products…
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Something went wrong loading your products. Please try again.
        </p>
      )}

      {products && (
        <ProductsTable
          products={products}
          onEdit={(product) => openDialog({ mode: "edit", product })}
          onDelete={(product) => deleteProduct.mutate(product.id)}
          onToggleStock={(product, inStock) =>
            toggleStock.mutate({ id: product.id, inStock })
          }
          isDeleting={deleteProduct.isPending}
          isTogglingId={
            toggleStock.isPending ? toggleStock.variables?.id : undefined
          }
        />
      )}

      <Dialog
        open={!!dialogState}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) setDialogState(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogState?.mode === "edit" ? "Edit product" : "Add product"}
            </DialogTitle>
            <DialogDescription>
              {dialogState?.mode === "edit"
                ? "Update the details of this product."
                : "Fill in the details to add a new product to your catalogue."}
            </DialogDescription>
          </DialogHeader>
          {dialogState && (
            <ProductForm
              key={dialogState.mode === "edit" ? dialogState.product.id : "add"}
              defaultValues={
                dialogState.mode === "edit" ? dialogState.product : undefined
              }
              submitLabel={dialogState.mode === "edit" ? "Save changes" : "Add product"}
              submittingLabel={dialogState.mode === "edit" ? "Saving…" : "Adding…"}
              submitError={submitError}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              onCancel={() => setDialogState(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
