"use client";

import {
  CircleAlert,
  CircleCheck,
  Package,
  PackageOpen,
  PackageX,
  Plus,
} from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/shared/EmptyState";
import { ProductForm } from "@/components/shared/ProductForm";
import { ProductsTable } from "@/components/shared/ProductsTable";
import { ProductsTableSkeleton } from "@/components/shared/ProductsTableSkeleton";
import { StatCard } from "@/components/shared/StatCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAddProduct } from "@/hooks/useAddProduct";
import { useDeleteProduct } from "@/hooks/useDeleteProduct";
import { useEditProduct } from "@/hooks/useEditProduct";
import { useProducts } from "@/hooks/useProducts";
import { useToggleProductStock } from "@/hooks/useToggleProductStock";
import { useVendorId } from "@/hooks/useVendorId";
import type { Product, ProductFormValues } from "@/types/product";
import { Status } from "@/types/status";

type DialogState = { mode: "add" } | { mode: "edit"; product: Product } | null;

const DIALOG_COPY = {
  add: {
    title: "Add product",
    description: "Fill in the details to add a new product to your catalogue.",
    submitLabel: "Add product",
    submittingLabel: "Adding…",
  },
  edit: {
    title: "Edit product",
    description: "Update the details of this product.",
    submitLabel: "Save changes",
    submittingLabel: "Saving…",
  },
} as const;

function ProductDialog({
  state,
  isSubmitting,
  submitError,
  onSubmit,
  onClose,
}: {
  state: DialogState;
  isSubmitting: boolean;
  submitError?: string;
  onSubmit: (values: ProductFormValues) => void;
  onClose: () => void;
}) {
  const copy = DIALOG_COPY[state?.mode ?? "add"];
  const product = state?.mode === "edit" ? state.product : undefined;

  return (
    <Dialog
      open={!!state}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {onClose();}
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>
        {state && (
          <ProductForm
            key={product?.id ?? "add"}
            defaultValues={product}
            submitLabel={copy.submitLabel}
            submittingLabel={copy.submittingLabel}
            submitError={submitError}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function ProductsPage() {
  const vendorId = useVendorId();
  const [dialogState, setDialogState] = useState<DialogState>(null);

  const { data: products, status } = useProducts(vendorId);
  const addProduct = useAddProduct(vendorId);
  const editProduct = useEditProduct(vendorId);
  const deleteProduct = useDeleteProduct(vendorId);
  const toggleStock = useToggleProductStock(vendorId);

  function handleSubmit(values: ProductFormValues) {
    if (dialogState?.mode === "edit") {
      editProduct.mutate(
        { id: dialogState.product.id, input: values },
        { onSuccess: () => { setDialogState(null); } },
      );
      return;
    }
    addProduct.mutate(values, { onSuccess: () => { setDialogState(null); } });
  }

  const isSubmitting = addProduct.isPending || editProduct.isPending;
  const submitError = (dialogState?.mode === "edit" ? editProduct : addProduct)
    .error?.message;

  function openDialog(state: NonNullable<DialogState>) {
    addProduct.reset();
    editProduct.reset();
    setDialogState(state);
  }

  return (
    <div className="mx-auto flex w-full  flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-linear-to-br from-accent via-accent/60 to-transparent p-5">
        <div className="flex items-center gap-4">
          <div className="flex p-3 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-orange-400 shadow-sm dark:ring-1 dark:ring-white/15">
            <Package aria-hidden="true" className="size-8" />
          </div>
          <div>
            <h1 className="text-lg sm:text-3xl font-semibold tracking-tight">
              My Products
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage the products in your catalogue.
            </p>
          </div>
        </div>
        <Button
          className="rounded-full px-4 "
          onClick={() => { openDialog({ mode: "add" }); }}
        >
          <Plus />
          Add product
        </Button>
      </div>

      {status === Status.SUCCESS && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={Package}
            label="Total products"
            value={products.length}
          />
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
          onEdit={(product) => { openDialog({ mode: "edit", product }); }}
          onDelete={(product) => { deleteProduct.mutate(product.id); }}
          onToggleStock={(product, inStock) => {
            toggleStock.mutate({ id: product.id, inStock });
          }}
          isDeleting={deleteProduct.isPending}
          isTogglingId={
            toggleStock.isPending ? toggleStock.variables.id : undefined
          }
        />
      )}

      <ProductDialog
        state={dialogState}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onSubmit={handleSubmit}
        onClose={() => { setDialogState(null); }}
      />
    </div>
  );
}
