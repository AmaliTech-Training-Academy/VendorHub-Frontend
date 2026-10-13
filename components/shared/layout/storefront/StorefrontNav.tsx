"use client";


import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// eslint-disable-next-line import/order
import { cn } from "cn";

import { LogOut, Menu, Receipt, ShoppingCart, Store, User } from "lucide-react";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartItemCount } from "@/store/cartStore";
import { useAuthStore } from "@/store/useAuthStore";

const tabs = [
  { href: "/storefront/vendors", label: "Vendors", icon: Store },
  { href: "/storefront/order-history", label: "Order history", icon: Receipt },
];

/** "Daniel Osei" -> "Daniel". Falls back to the part before "@" for emails. */
function getFirstName(name: string | null) {
  if (!name) {
    return "";
  }
  const base = name.includes("@") ? name.split("@")[0] : name;
  return base.trim().split(/\s+/).at(0) ?? "";
}

/** "Daniel Osei" -> "DO", "Daniel" -> "D". */
function getInitials(name: string | null) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  const first = parts.at(0)?.charAt(0) ?? "";
  const last = parts.length > 1 ? (parts.at(-1)?.charAt(0) ?? "") : "";
  return (first + last).toUpperCase();
}

export function StorefrontNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = useAuthStore((state) => state.logout);
  const displayName = useAuthStore((state) => state.displayName);
  const email = useAuthStore((state) => state.email);
  const cartCount = useCartItemCount();

  const isCartPage = pathname.replace(/\/+$/, "") === "/storefront/cart";
  const firstName = getFirstName(displayName);
  const initials = getInitials(displayName);
  // The store falls back to the email as the display name; don't show it twice.
  const showEmail = !!email && email !== displayName;

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-blue-950 shadow-sm">
      <div className="mx-auto flex h-16 items-center justify-between gap-3 px-4 md:h-18 md:gap-4 md:px-6">
        {/* Logo */}
        <Link
          href="/storefront/vendors"
          className="flex shrink-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-white/40 md:gap-3"
        >
          <Image
            src="/logo.png"
            alt="VendorHub logo"
            width={50}
            height={50}
            className="size-9 rounded-full bg-white object-contain p-1 md:size-12"
          />
          <span className="hidden text-xl font-bold min-[380px]:inline md:text-2xl">
            <span className="text-white">Vendor</span>
            <span className="text-orange-400">Hub</span>
          </span>
        </Link>

        {/* Tabs: centered, desktop only */}
        <nav
          aria-label="Main"
          className="hidden flex-1 justify-center gap-1 md:flex"
        >
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "gap-2 px-5 py-4 text-white/70",
                  // The trailing `!` makes these beat the ghost variant's own hover colours.
                  isActive
                    ? "bg-white text-blue-950 hover:bg-white! hover:text-blue-950!"
                    : "hover:bg-white/15! hover:text-white!",
                )}
              >
                <Icon className="size-6" />
                <span className="text-sm font-semibold">{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
          {/* Cart */}
          <Link
            href="/storefront/cart"
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            aria-current={isCartPage ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-12 min-w-12 flex-col gap-0.5 px-2 text-white md:h-14 md:min-w-14",
              isCartPage
                ? "bg-white text-blue-950 hover:bg-white! hover:text-blue-950!"
                : "hover:bg-white/15! hover:text-white!",
            )}
          >
            <span className="relative flex size-6 items-center justify-center">
              <ShoppingCart aria-hidden="true" className="size-5" />
              {cartCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 -right-2 flex min-w-4 items-center justify-center rounded-full bg-orange-400 px-1 text-[10px] leading-4 font-bold text-blue-950 tabular-nums"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </span>
            <span className="text-xs leading-none font-semibold">Cart</span>
          </Link>

          {/* Account: desktop */}
          <div className="hidden items-center gap-3 md:flex">
            {firstName && (
              <span className="hidden max-w-32 truncate text-sm font-medium text-white/80 lg:block">
                Hi, {firstName}
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Account menu"
                    className="size-11 cursor-pointer rounded-full bg-white/20 text-orange-400 hover:bg-white/30! hover:text-white!"
                  />
                }
              >
                <User className="size-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-56">
                {displayName && (
                  <>
                    <div className="px-2 py-1.5">
                      <p className="truncate text-sm font-semibold">
                        {displayName}
                      </p>
                      {showEmail && (
                        <p className="truncate text-xs text-muted-foreground">
                          {email}
                        </p>
                      )}
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive"
                >
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Hamburger: mobile only */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="text-white hover:bg-white/15! hover:text-white! md:hidden"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 max-w-[85vw] gap-0 p-0">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigate the storefront or log out.
              </SheetDescription>

              {/* Who is logged in */}
              <div className="flex items-center gap-3 px-4 pt-6 pr-14 pb-5">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-base font-bold text-white"
                >
                  {initials || <User className="size-5" />}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-blue-950">
                    {displayName ?? "Welcome"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {showEmail ? email : "Employee"}
                  </p>
                </div>
              </div>

              <Separator />

              <nav
                aria-label="Mobile"
                className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-3"
              >
                {tabs.map((tab) => {
                  const isActive = pathname.startsWith(tab.href);
                  const Icon = tab.icon;
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      onClick={() => {
                        setMobileOpen(false);
                      }}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-12 w-full shrink-0 justify-start gap-3 rounded-xl px-3 text-base",
                        isActive
                          ? "bg-blue-950 text-white hover:bg-blue-950! hover:text-white!"
                          : "text-foreground hover:bg-muted!",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg",
                          isActive
                            ? "bg-orange-500 text-white"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        <Icon className="size-4.5" />
                      </span>
                      <span className="font-semibold">{tab.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout stays pinned to the bottom, clear of the iPhone home bar */}
              <div className="shrink-0 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="h-12 w-full justify-start gap-3 rounded-xl px-3 text-base text-destructive hover:bg-destructive/10! hover:text-destructive!"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                    <LogOut className="size-4.5" />
                  </span>
                  <span className="font-semibold">Log out</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
