"use client";

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/product";

const ITEMS_PER_PAGE = 10;

function ProductsTable({
  products,
  onEdit,
  onDelete,
  onToggleStock,
  isDeleting,
  isTogglingId,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStock: (product: Product, inStock: boolean) => void;
  isDeleting?: boolean;
  isTogglingId?: number;
}) {
  const [productPendingDelete, setProductPendingDelete] =
    useState<Product | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Calculations
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Safety fallbacks if elements are deleted causing current page to empty out
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

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
            {paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product) => (
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
                  <TableCell className="font-semibold">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.inStock}
                        disabled={isTogglingId === product.id}
                        onCheckedChange={(checked) => {
                          onToggleStock(product, checked);
                        }}
                        aria-label={
                          product.inStock
                            ? "Mark as out of stock"
                            : "Mark as in stock"
                        }
                      />
                      {isTogglingId === product.id ? (
                        <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                      ) : (
                        <Badge
                          variant={product.inStock ? "success" : "secondary"}
                        >
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
                        onClick={() => {
                          onEdit(product);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${product.name}`}
                        onClick={() => {
                          setProductPendingDelete(product);
                        }}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination Navigation Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-4 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
              }}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              }}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium">
                  {products.length === 0 ? 0 : startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, products.length)}
                </span>{" "}
                of <span className="font-medium">{products.length}</span>{" "}
                results
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage === 1}
                  aria-label="Go to previous page"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  disabled={currentPage === totalPages}
                  aria-label="Go to next page"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog
        open={!!productPendingDelete}
        onOpenChange={(open) => {
          if (!open) {
            setProductPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;
              {productPendingDelete?.name}
              &rdquo;? This will remove it from your catalogue and the
              storefront. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={() => {
                if (productPendingDelete) {
                  onDelete(productPendingDelete);
                  setProductPendingDelete(null);
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
  );
}

export { ProductsTable };
