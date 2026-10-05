import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "cn";
import {
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  Truck,
  User,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: Receipt },
  {
    href: "/dashboard/delivery-settings",
    label: "Delivery settings",
    icon: Truck,
  },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function Brand() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2.5 shrink-0 md:gap-3"
    >
      <Image
        src="/logo.png"
        alt="VendorHub logo"
        width={48}
        height={48}
        className="size-[34px] object-contain rounded-full bg-white p-1 md:size-12"
      />
      <span className="font-semibold text-lg md:text-3xl md:font-bold">
        <span className="text-white">Vendor</span>
        <span className="text-orange-400">Hub</span>
      </span>
    </Link>
  );
}

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "group h-30 w-full flex-col gap-0 rounded-xl px-3 text-base",
              "transition-all duration-200 motion-reduce:transition-none",
              isActive
                ? "bg-white text-blue-950 shadow-md hover:bg-white hover:text-blue-950"
                : "text-white/70 hover:translate-x-1 hover:bg-white/10 hover:text-white motion-reduce:hover:translate-x-0",
            )}
          >
            <span
              className={cn(
                "flex p-4 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                isActive
                  ? "bg-orange-500 text-white"
                  : "bg-white/5 text-white/70 group-hover:bg-white/15 group-hover:text-white",
              )}
            >
              <Icon className="size-10" />
            </span>
            <span className="text-xl font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="group h-14 w-full justify-start gap-3 rounded-xl px-3 text-base text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white motion-reduce:transition-none"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/5 transition-colors duration-200 group-hover:bg-red-500/20 group-hover:text-red-300">
        <LogOut className="size-5" />
      </span>
      <span className="font-semibold">Log out</span>
    </Button>
  );
}
