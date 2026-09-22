"use client"

import { useState } from "react"
import { CircleAlert, PackageOpen, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { EmptyState } from "@/components/shared/EmptyState"
import { ProductForm } from "@/components/shared/ProductForm"
import { ProductsTable } from "@/components/shared/ProductsTable"
import { ProductsTableSkeleton } from "@/components/shared/ProductsTableSkeleton"
import { useAddProduct } from "@/hooks/useAddProduct"
import { useDeleteProduct } from "@/hooks/useDeleteProduct"
import { useEditProduct } from "@/hooks/useEditProduct"
import { useProducts } from "@/hooks/useProducts"
import { useToggleProductStock } from "@/hooks/useToggleProductStock"
import { MOCK_VENDOR_ID } from "@/lib/constants"
import type { Product, ProductFormValues } from "@/types/product"
import { Status } from "@/types/status"

type DialogState = { mode: "add" } | { mode: "edit"; product: Product } | null

export default function ProductsPage() {
  const vendorId = MOCK_VENDOR_ID
  const [dialogState, setDialogState] = useState<DialogState>(null)

  const { data: products, status } = useProducts(vendorId)
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

      {status === Status.PENDING && <ProductsTableSkeleton />}

      {status === Status.ERROR && (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Unable to load products</AlertTitle>
          <AlertDescription>
            Something went wrong loading your products. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {status === Status.SUCCESS && products.length === 0 && (
        <EmptyState
          icon={PackageOpen}
          title="No products yet"
          description="Add your first product to start selling."
        />
      )}

      {status === Status.SUCCESS && products.length > 0 && (
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
