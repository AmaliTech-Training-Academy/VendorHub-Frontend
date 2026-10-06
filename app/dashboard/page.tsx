// app/dashboard/page.tsx
"use client";

import Link from "next/link";

import { ClipboardList, Package, ShoppingBag, ArrowRight } from "lucide-react";

import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge/OrderStatusBadge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { useVendorId } from "@/hooks/useVendorId";
import {
  countOrdersThisWeek,
  countPendingOrders,
  summariseItems,
} from "@/lib/orderStats";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/types/order";

const RECENT_ORDER_COUNT = 5;

export default function DashboardOverviewPage() {
  const vendorId = useVendorId();
  const { data: products, isError } = useProducts(vendorId);
  const {
    data: orders,
    isPending: ordersPending,
    isError: ordersError,
  } = useOrders(vendorId);

  let productsHint = "Live in your storefront";
  if (products) {
    productsHint = `${String(products.length)} total, live in your storefront`;
  } else if (isError) {
    productsHint = "Couldn't load your products";
  }

  const productsInStock = {
    label: "Products in stock",
    value: products ? products.filter((p) => p.inStock).length : "—",
    hint: productsHint,
    icon: Package,
  };
  const ordersUnavailable = ordersError ? "Couldn't load your orders" : null;
  const pendingOrders = {
    label: "Pending orders",
    value: orders ? countPendingOrders(orders) : "—",
    hint: ordersUnavailable ?? "Received or being prepared",
    icon: ClipboardList,
  };
  const ordersThisWeek = {
    label: "Orders this week",
    value: orders ? countOrdersThisWeek(orders) : "—",
    hint: ordersUnavailable ?? "Since Monday",
    icon: ShoppingBag,
  };
  const stats = [pendingOrders, productsInStock, ordersThisWeek];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl sm:text-4xl font-semibold text-blue-950">
          Overview
        </h1>
        <p className="text-sm sm:text-lg text-muted-foreground">
          Here&apos;s how your storefront is doing
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-start justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <span className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.hint}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <RecentOrdersCard
        orders={orders}
        isPending={ordersPending}
        isError={ordersError}
      />
    </div>
  );
}

function RecentOrdersCard({
  orders,
  isPending,
  isError,
}: {
  orders: Order[] | undefined;
  isPending: boolean;
  isError: boolean;
}) {
  const recentOrders = orders?.slice(0, RECENT_ORDER_COUNT) ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle>Recent orders</CardTitle>
          <CardDescription>
            The latest orders from your customers
          </CardDescription>
        </div>
        <Link
          href="/dashboard/orders"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </CardHeader>

      <CardContent>
        {isPending && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading your orders…
          </p>
        )}
        {isError && (
          <p className="py-8 text-center text-sm text-destructive">
            Couldn&apos;t load your orders. Please try again.
          </p>
        )}
        {orders && recentOrders.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No orders yet. They&apos;ll show up here as soon as an employee
            places one.
          </p>
        )}
        {recentOrders.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead className="hidden md:table-cell">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell text-right">
                  Placed
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm font-medium">
                    {order.reference}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {summariseItems(order)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-right text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
