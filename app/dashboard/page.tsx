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
import { useProducts } from "@/hooks/useProducts";
import { useVendorId } from "@/hooks/useVendorId";
import { formatPrice } from "@/lib/utils";
import type { RecentOrder } from "@/types/interfaces";

// TEMPORARY: the order stats and recent orders below are hardcoded until the
// backend has endpoints for listing orders. Product stats are real.
const pendingOrders = {
  label: "Pending orders",
  value: 3,
  hint: "Waiting for you to prepare",
  icon: ClipboardList,
};

const ordersThisWeek = {
  label: "Orders this week",
  value: 27,
  hint: "Since Monday",
  icon: ShoppingBag,
};

const recentOrders: RecentOrder[] = [
  {
    id: "1042",
    customer: "Daniel Osei",
    items: "2x Jollof rice, 1x Meat pie",
    total: 48,
    status: "received",
    placedAt: "10 min ago",
  },
  {
    id: "1041",
    customer: "Ama Boateng",
    items: "1x Waakye",
    total: 15,
    status: "preparing",
    placedAt: "35 min ago",
  },
  {
    id: "1040",
    customer: "Kwame Asante",
    items: "3x Kelewele",
    total: 30,
    status: "preparing",
    placedAt: "1 hr ago",
  },
  {
    id: "1039",
    customer: "Efua Mensah",
    items: "2x Jollof rice",
    total: 40,
    status: "ready_for_collection",
    placedAt: "2 hrs ago",
  },
  {
    id: "1038",
    customer: "Yaw Fosu",
    items: "1x Meat pie, 1x Waakye",
    total: 23,
    status: "ready_for_collection",
    placedAt: "Yesterday",
  },
];

export default function DashboardOverviewPage() {
  const { data: products, isError } = useProducts(useVendorId());

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
          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No orders yet. They&apos;ll show up here as soon as a customer
              places one.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
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
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {order.items}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-right text-muted-foreground">
                      {order.placedAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
