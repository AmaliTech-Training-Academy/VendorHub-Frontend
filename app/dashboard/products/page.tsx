"use client"

import { useState } from "react"
import {
  CircleAlert,
  CircleCheck,
  Package,
  PackageOpen,
  PackageX,
  Plus,
} from "lucide-react"
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
import { StatCard } from "@/components/shared/StatCard"
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-accent via-accent/60 to-transparent p-5">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-orange-400 shadow-sm dark:ring-1 dark:ring-white/15">
            <Package aria-hidden="true" className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Products</h1>
            <p className="text-sm text-muted-foreground">
              Manage the products in your catalogue.
            </p>
          </div>
        </div>
        <Button className="rounded-full" onClick={() => openDialog({ mode: "add" })}>
          <Plus />
          Add product
        </Button>
      </div>

      {status === Status.SUCCESS && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={Package} label="Total products" value={products.length} />
          <StatCard
            icon={CircleCheck}
            tone="success"
            label="In stock"
            value={products.filter((product) => product.inStock).length}
          />
          <StatCard
            icon={PackageX}
            tone="warning"
            label="Out of stock"
            value={products.filter((product) => !product.inStock).length}
          />
        </div>
      )}

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
