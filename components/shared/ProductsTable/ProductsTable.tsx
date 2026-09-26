"use client"

import { useState } from "react"
import { Loader2, Package, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"

function ProductsTable({
  products,
  onEdit,
  onDelete,
  onToggleStock,
  isDeleting,
  isTogglingId,
}: {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onToggleStock: (product: Product, inStock: boolean) => void
  isDeleting?: boolean
  isTogglingId?: string
}) {
  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(
    null
  )

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Package aria-hidden="true" className="size-5" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="font-semibold">{product.name}</span>
                      <span className="max-w-xs truncate text-sm text-muted-foreground">
                        {product.description}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell className="font-semibold">{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={product.inStock}
                      disabled={isTogglingId === product.id}
                      onCheckedChange={(checked) => onToggleStock(product, checked)}
                      aria-label={
                        product.inStock ? "Mark as out of stock" : "Mark as in stock"
                      }
                    />
                    {isTogglingId === product.id ? (
                      <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                    ) : (
                      <Badge variant={product.inStock ? "success" : "secondary"}>
                        {product.inStock ? "In stock" : "Out of stock"}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${product.name}`}
                      onClick={() => onEdit(product)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${product.name}`}
                      onClick={() => setProductPendingDelete(product)}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!productPendingDelete}
        onOpenChange={(open) => {
          if (!open) setProductPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{productPendingDelete?.name}
              &rdquo;? This will remove it from your catalogue and the storefront.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={() => {
                if (productPendingDelete) {
                  onDelete(productPendingDelete)
                  setProductPendingDelete(null)
                }
              }}
            >
              {isDeleting && <Loader2 className="size-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export { ProductsTable }
