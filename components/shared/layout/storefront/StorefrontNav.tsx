"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Store, Receipt, Menu, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const tabs = [
  { href: "/storefront/vendors", label: "Vendors", icon: Store },
  { href: "/storefront/order-history", label: "Order history", icon: Receipt },
];

export function StorefrontNav() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="p-4">
      <div className="bg-blue-950 max-w-6xl mx-auto flex items-center justify-between px-4 py-3 md:px-6 rounded-lg">
        {/* Logo */}
        <Link
          href="/storefront/vendors"
          className="flex items-center gap-2 shrink-0"
        >
          <Image
            src="/logo.png"
            alt="VendorHub logo"
            width={28}
            height={28}
            className="object-contain rounded-full bg-white p-1"
          />
          <span className="font-bold text-base  sm:inline ">
            <span className="text-white">Vendor</span>
            <span className="text-orange-400">Hub</span>
          </span>
        </Link>

        {/* Tabs — centered, desktop only */}
        <div className="hidden md:flex flex-1 justify-center gap-1">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Button
                key={tab.href}
                variant="ghost"
                size="sm"
                className={cn(
                  "text-white/70 hover:text-white hover:bg-white/10",
                  isActive &&
                    "bg-white text-blue-950 hover:bg-white hover:text-blue-950",
                )}
              >
                <Link href={tab.href} className="flex items-center gap-2">
                  <Icon className="size-4" />
                  <span className="font-semibold text-sm">{tab.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>

        {/* Account — desktop */}
        <div className="hidden md:flex items-center shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 hover:text-white rounded-full"
                />
              }
            >
              <User />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Hamburger — mobile only */}
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/10 hover:text-white"
              />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col gap-2 mt-8 px-4">
              {tabs.map((tab) => {
                const isActive = pathname.startsWith(tab.href);
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.href}
                    variant={isActive ? "secondary" : "ghost"}
                    className="justify-start"
                  >
                    <Link href={tab.href} className="flex items-center gap-2">
                      <Icon className="size-4" />
                      {tab.label}
                    </Link>
                  </Button>
                );
              })}
              <Separator className="my-2" />
              <Button
                variant="ghost"
                className="justify-start"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Log out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
