"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Loader2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { StorefrontProductCard } from "@/components/shared/StorefrontProductCard"
import { useVendor, useVendorCatalogue } from "@/hooks/useVendors"
import { useCartStore } from "@/store/cartStore"
import type { Product } from "@/types/product"

function VendorCatalogue({ vendorId }: { vendorId: string }) {
  const { data: vendor, isPending: isVendorPending } = useVendor(vendorId)
  const { data: products, isPending, isError } = useVendorCatalogue(vendorId)
  const { items, addItem, clearCart } = useCartStore()

  const [pendingSwitchProduct, setPendingSwitchProduct] = useState<Product | null>(
    null
  )

  function handleAdd(product: Product) {
    const result = addItem({
      productId: product.id,
      vendorId: product.vendorId,
      name: product.name,
      price: product.price,
    })
    if (result.blocked) {
      setPendingSwitchProduct(product)
    }
  }

  function confirmSwitchVendor() {
    if (!pendingSwitchProduct) return
    clearCart()
    addItem({
      productId: pendingSwitchProduct.id,
      vendorId: pendingSwitchProduct.vendorId,
      name: pendingSwitchProduct.name,
      price: pendingSwitchProduct.price,
    })
    setPendingSwitchProduct(null)
  }

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Link
            href="/storefront/vendors"
            className="flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Back to vendors
          </Link>
          <h1 className="text-xl font-semibold">
            {isVendorPending ? "Loading…" : vendor?.name ?? "Vendor"}
          </h1>
          {vendor && (
            <p className="text-sm text-muted-foreground">
              {vendor.categories.join(", ")}
            </p>
          )}
        </div>
        <Link href="/storefront/cart">
          <Button variant="outline">
            <ShoppingCart />
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Button>
        </Link>
      </div>

      {isPending && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading catalogue…
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          Something went wrong loading this vendor&apos;s catalogue. Please try
          again.
        </p>
      )}

      {products && products.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium">No products in stock</p>
          <p className="text-sm text-muted-foreground">
            This vendor has no available products right now.
          </p>
        </div>
      )}

      {products && products.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <StorefrontProductCard
              key={product.id}
              product={product}
              quantityInCart={
                items.find((item) => item.productId === product.id)?.quantity ?? 0
              }
              onAdd={handleAdd}
            />
          ))}
        </div>
      )}

      <AlertDialog
        open={!!pendingSwitchProduct}
        onOpenChange={(open) => {
          if (!open) setPendingSwitchProduct(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start a new order?</AlertDialogTitle>
            <AlertDialogDescription>
              Your cart has items from another vendor. Orders can only include
              products from a single vendor. Clear your cart and add this item
              instead?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSwitchVendor}>
              Clear cart & add item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export { VendorCatalogue }
