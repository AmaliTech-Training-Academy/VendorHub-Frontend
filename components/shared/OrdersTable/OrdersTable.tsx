"use client";

import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Loader2,
} from "lucide-react";

import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagination } from "@/hooks/usePagination";
import { formatDate, formatPrice } from "@/lib/utils";
import { nextOrderStatus } from "@/schemas/orderSchema";
import type { Order, OrderStatus } from "@/types/order";

const ITEMS_PER_PAGE = 5;

const ADVANCE_LABEL: Record<OrderStatus, string> = {
  received: "Mark received",
  preparing: "Start preparing",
  ready_for_collection: "Mark ready",
};

function OrdersTable({
  orders,
  onAdvance,
  updatingOrderId,
}: {
  orders: Order[];
  /** When given, each row gets a button to move the order to its next status. */
  onAdvance?: (order: Order, status: OrderStatus) => void;
  updatingOrderId?: string;
}) {
  const { page, setPage, pageCount, pageItems, total, pageSize } =
    usePagination(orders, ITEMS_PER_PAGE);

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            {onAdvance && (
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={onAdvance ? 6 : 5}
                className="h-24 text-center text-muted-foreground"
              >
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            pageItems.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ClipboardList aria-hidden="true" className="size-5" />
                    </div>
                    <span className="font-mono text-sm font-semibold">
                      {order.reference}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell>
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items
                </TableCell>
                <TableCell className="font-semibold">
                  {formatPrice(order.total)}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                {onAdvance && (
                  <TableCell className="text-right">
                    <AdvanceButton
                      order={order}
                      isUpdating={updatingOrderId === order.id}
                      onAdvance={onAdvance}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination footer */}
      <div className="flex items-center justify-between border-t border-border px-4 py-4 sm:px-6">
        {/* Mobile Layout */}
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPage(page - 1);
            }}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPage(page + 1);
            }}
            disabled={page === pageCount}
          >
            Next
          </Button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{rangeStart}</span> to{" "}
            <span className="font-medium">{rangeEnd}</span> of{" "}
            <span className="font-medium">{total}</span> results
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Page {page} of {pageCount}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => {
                  setPage(page - 1);
                }}
                disabled={page === 1}
                aria-label="Go to previous page"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => {
                  setPage(page + 1);
                }}
                disabled={page === pageCount}
                aria-label="Go to next page"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdvanceButton({
  order,
  isUpdating,
  onAdvance,
}: {
  order: Order;
  isUpdating: boolean;
  onAdvance: (order: Order, status: OrderStatus) => void;
}) {
  const next = nextOrderStatus(order.status);
  if (!next) {
    return null;
  }
  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded-full"
      disabled={isUpdating}
      aria-label={`${ADVANCE_LABEL[next]}: ${order.reference}`}
      onClick={() => {
        onAdvance(order, next);
      }}
    >
      {isUpdating && (
        <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
      )}
      {ADVANCE_LABEL[next]}
    </Button>
  );
}

export { OrdersTable };
